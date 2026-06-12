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

-- 4. Cross-player daily averages -------------------------------------------
-- Read-only aggregate view (no user_id exposed) — e.g. "average guesses
-- today" across all players, broken down by puzzle date and difficulty.
create or replace view daily_aggregate_stats as
select
  date_string,
  difficulty,
  count(*) as players,
  count(*) filter (where won) as winners,
  avg(guess_count) filter (where won) as avg_guesses
from game_results
where mode = 'daily' and date_string is not null
group by date_string, difficulty;

grant select on daily_aggregate_stats to anon, authenticated;
