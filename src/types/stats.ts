export interface DifficultyStats {
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  bestStreak: number;
  bestGuesses: number | null;
  /** Length-8 array — index i = number of wins achieved in (i+1) guesses */
  guessDistribution: number[];
  lastPlayedDate: string | null;
}

export type AllStats = {
  daily: Record<string, DifficultyStats>;
  unlimited: Record<string, DifficultyStats>;
};
