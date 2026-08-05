// Run weekly via .github/workflows/weekly-analytics-email.yml — summarizes rounds
// played per game mode per day over the last 7 days into a digest email.
import { appendFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { getEasternDateString } from '../src/utils/dateSeed';

// Same public Supabase project + anon key already embedded in the deployed client
// bundle (src/utils/supabaseClient.ts) — anon keys are meant to be public, RLS (and
// the security-definer RPCs) are what actually protect the data.
const SUPABASE_URL = 'https://ypelcdpdhqvpvgybvgih.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_9DaB1f1N9ldxnuPIDQhhcQ_VLm9UX87';

const DAYS = 7;
const MODE_LABELS: Record<string, string> = { daily: 'Daily Challenge', unlimited: 'Unlimited' };

function lastNDateStrings(n: number): string[] {
  const now = new Date();
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(getEasternDateString(new Date(now.getTime() - i * 86_400_000)));
  }
  return out.reverse();
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const dateStrings = lastNDateStrings(DAYS);

  const { data, error } = await supabase
    .from('weekly_mode_play_counts')
    .select('date_string, mode, plays')
    .in('date_string', dateStrings);

  if (error) {
    console.error('Failed to fetch weekly_mode_play_counts', error);
    process.exitCode = 1;
    return;
  }

  const rows = (data ?? []) as { date_string: string; mode: string; plays: number }[];
  const byModeDay = new Map<string, number>();
  const totalByMode = new Map<string, number>();
  let grandTotal = 0;

  for (const row of rows) {
    const key = `${row.mode}|${row.date_string}`;
    byModeDay.set(key, (byModeDay.get(key) ?? 0) + row.plays);
    totalByMode.set(row.mode, (totalByMode.get(row.mode) ?? 0) + row.plays);
    grandTotal += row.plays;
  }

  const lines: string[] = [];
  lines.push(`Weatherle weekly summary — ${dateStrings[0]} to ${dateStrings[dateStrings.length - 1]}`);
  for (const mode of Object.keys(MODE_LABELS)) {
    lines.push('');
    lines.push(`${MODE_LABELS[mode]}: ${totalByMode.get(mode) ?? 0} plays`);
    for (const date of dateStrings) {
      lines.push(`  ${date}: ${byModeDay.get(`${mode}|${date}`) ?? 0}`);
    }
  }
  lines.push('');
  lines.push(`Total plays, both modes: ${grandTotal}`);

  const summary = lines.join('\n');
  console.log(summary);

  const output = process.env.GITHUB_OUTPUT;
  if (output) {
    appendFileSync(output, `summary<<EOF\n${summary}\nEOF\n`);
  }
}

main();
