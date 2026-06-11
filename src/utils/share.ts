import type { Difficulty } from '../hooks/useDifficulty';
import type { GuessEntry } from '../hooks/useGameState';
import { MAX_GUESSES } from '../hooks/useGameState';
import type { GameMode } from '../hooks/useGameMode';
import type { GameStatus, HintResult } from '../types/game';
import { puzzleNumberFromDateString } from './dateSeed';

const DIFFICULTY_LABELS: Record<Difficulty, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

const GREEN = '🟩';
const YELLOW = '🟨';
const GRAY = '⬛';

/** Population and elevation are "close" when within the same tier — surfaced as yellow. */
function populationEmoji(hint: HintResult): string {
  if (hint.isCorrect) return GREEN;
  return hint.populationMagnitude === 'same-tier' ? YELLOW : GRAY;
}

function elevationEmoji(hint: HintResult): string {
  if (hint.isCorrect) return GREEN;
  return hint.elevationMagnitude === 'same-tier' ? YELLOW : GRAY;
}

/** Within ~1000km counts as "close" on a worldwide scale. */
function distanceEmoji(hint: HintResult): string {
  if (hint.isCorrect) return GREEN;
  return hint.distanceKm < 1000 ? YELLOW : GRAY;
}

/** One row of 8 squares matching the hint chip order in HintRow. */
export function hintEmojis(hint: HintResult): string {
  if (hint.isCorrect) return GREEN.repeat(8);
  return [
    hint.hemisphereMatch ? GREEN : GRAY,
    hint.continentMatch ? GREEN : GRAY,
    hint.countryMatch ? GREEN : GRAY,
    hint.vibeMatch ? GREEN : GRAY,
    populationEmoji(hint),
    elevationEmoji(hint),
    GRAY,
    distanceEmoji(hint),
  ].join('');
}

export function buildShareText(
  entries: GuessEntry[],
  mode: GameMode,
  difficulty: Difficulty,
  status: GameStatus,
  dateString: string,
): string {
  const grid = entries.map((e) => hintEmojis(e.hint)).join('\n');
  const result = status === 'won' ? `${entries.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;

  const title =
    mode === 'daily'
      ? `Weatherle #${puzzleNumberFromDateString(dateString)} (${DIFFICULTY_LABELS[difficulty]}) ${result}`
      : `Weatherle (Unlimited · ${DIFFICULTY_LABELS[difficulty]}) ${result}`;

  return `${title}\n\n${grid}\n\n${window.location.origin}${import.meta.env.BASE_URL}`;
}
