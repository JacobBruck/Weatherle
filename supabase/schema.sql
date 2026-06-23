-- Weatherle Supabase schema
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

-- 1. Profiles -----------------------------------------------------------
-- One row per signed-up user. Auto-created via trigger below.
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "Users can view their own profile" on profiles;
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data ->> 'name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- 2. Game results --------------------------------------------------------
-- One row per finished round (daily or unlimited). Append-only history,
-- used both to rebuild stats_summary and to compute cross-player averages.
create table if not exists game_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  mode text not null check (mode in ('daily', 'unlimited')),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  date_string text,
  city_id text not null,
  won boolean not null,
  guess_count int not null,
  cumulative_distance_km numeric not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists game_results_user_idx on game_results (user_id);
create index if not exists game_results_daily_idx on game_results (mode, date_string, difficulty);

alter table game_results enable row level security;

drop policy if exists "Users can view their own results" on game_results;
create policy "Users can view their own results"
  on game_results for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own results" on game_results;
create policy "Users can insert their own results"
  on game_results for insert
  with check (auth.uid() = user_id);

-- 3. Per-user stats summary ----------------------------------------------
-- Mirrors the local DifficultyStats shape — one row per (user, mode, difficulty).
create table if not exists stats_summary (
  user_id uuid not null references auth.users (id) on delete cascade,
  mode text not null check (mode in ('daily', 'unlimited')),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  games_played int not null default 0,
  wins int not null default 0,
  current_streak int not null default 0,
  best_streak int not null default 0,
  best_guesses int,
  guess_distribution int[] not null default '{0,0,0,0,0,0,0,0}',
  last_played_date text,
  continents_won text[] not null default '{}',
  countries_won text[] not null default '{}',
  vibes_won text[] not null default '{}',
  won_high_elevation boolean not null default false,
  won_low_elevation boolean not null default false,
  won_megacity boolean not null default false,
  won_small_town boolean not null default false,
  cumulative_distance_km numeric not null default 0,
  primary key (user_id, mode, difficulty)
);

alter table stats_summary enable row level security;

drop policy if exists "Users can view their own stats" on stats_summary;
create policy "Users can view their own stats"
  on stats_summary for select
  using (auth.uid() = user_id);

drop policy if exists "Users can upsert their own stats" on stats_summary;
create policy "Users can upsert their own stats"
  on stats_summary for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own stats" on stats_summary;
create policy "Users can update their own stats"
  on stats_summary for update
  using (auth.uid() = user_id);

-- 4. Anonymous daily contributions -----------------------------------------
-- Stores one row per anonymous (signed-out) daily play. `client_id` is a
-- random UUID generated client-side and stored in localStorage — no personal
-- information is attached. The primary key prevents the same browser from
-- being counted twice for the same puzzle.
create table if not exists daily_anon_results (
  date_string text not null,
  difficulty  text not null check (difficulty in ('easy', 'medium', 'hard')),
  won         boolean not null,
  guess_count int not null check (guess_count between 1 and 8),
  client_id   uuid not null,
  created_at  timestamptz not null default now(),
  primary key (date_string, difficulty, client_id)
);

-- No direct insert/select granted to clients — all writes go through the
-- validated security-definer function below.
alter table daily_anon_results enable row level security;

-- Validated write path for anonymous results. Runs with elevated privilege
-- (security definer) so the table itself stays closed to direct client
-- access. Server-side checks: date must be today or yesterday in UTC (covers
-- all real-world timezones), and all value constraints mirror the table's
-- own CHECK constraints.
create or replace function record_anon_daily_result(
  p_date_string text,
  p_difficulty  text,
  p_won         boolean,
  p_guess_count int,
  p_client_id   uuid
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Reject dates more than 1 day in the past or any future date.
  if p_date_string::date < current_date - 1 or p_date_string::date > current_date then
    raise exception 'invalid date_string';
  end if;
  if p_difficulty not in ('easy', 'medium', 'hard') then
    raise exception 'invalid difficulty';
  end if;
  if p_guess_count < 1 or p_guess_count > 8 then
    raise exception 'invalid guess_count';
  end if;

  insert into daily_anon_results (date_string, difficulty, won, guess_count, client_id)
  values (p_date_string, p_difficulty, p_won, p_guess_count, p_client_id)
  on conflict (date_string, difficulty, client_id) do nothing;
end;
$$;

grant execute on function record_anon_daily_result(text, text, boolean, int, uuid) to anon, authenticated;

-- 5. Cross-player daily averages -------------------------------------------
-- Combines signed-in results (game_results) with anonymous ones
-- (daily_anon_results) into a single aggregate per puzzle date + difficulty.
-- No user_id or client_id is ever exposed.
create or replace view daily_aggregate_stats as
select
  date_string,
  difficulty,
  sum(players)::bigint as players,
  sum(winners)::bigint as winners,
  case when sum(winners) > 0
    then sum(avg_guesses * winners) / sum(winners)
    else null
  end as avg_guesses
from (
  select
    date_string,
    difficulty,
    count(*)                             as players,
    count(*) filter (where won)          as winners,
    avg(guess_count) filter (where won)  as avg_guesses
  from game_results
  where mode = 'daily' and date_string is not null
  group by date_string, difficulty

  union all

  select
    date_string,
    difficulty,
    count(*)                             as players,
    count(*) filter (where won)          as winners,
    avg(guess_count) filter (where won)  as avg_guesses
  from daily_anon_results
  group by date_string, difficulty
) combined
group by date_string, difficulty;

grant select on daily_aggregate_stats to anon, authenticated;
