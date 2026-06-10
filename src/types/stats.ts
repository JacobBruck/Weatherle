export interface DifficultyStats {
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  bestStreak: number;
  bestGuesses: number | null;
  /** Length-8 array — index i = number of wins achieved in (i+1) guesses */
  guessDistribution: number[];
  lastPlayedDate: string | null;
  /** Continents of cities correctly guessed as the target (for the "7 Continents" achievement). */
  continentsWon: string[];
  /** ISO country codes of cities correctly guessed as the target (for the "All Countries" achievement). */
  countriesWon: string[];
  /** Vibes of cities correctly guessed as the target (for the "Vibe Collector" achievement). */
  vibesWon: string[];
  /** Won a city at 2,000m+ elevation (for the "High & Low" achievement). */
  wonHighElevation: boolean;
  /** Won a city at sea level, ≤10m elevation (for the "High & Low" achievement). */
  wonLowElevation: boolean;
  /** Won a megacity, 10M+ population (for the "Big & Small" achievement). */
  wonMegacity: boolean;
  /** Won a small town, under 50,000 population (for the "Big & Small" achievement). */
  wonSmallTown: boolean;
  /** Sum of every guess's distance from the target, across all games (for the "Globe Trotter" achievement). */
  cumulativeDistanceKm: number;
}

export type AllStats = {
  daily: Record<string, DifficultyStats>;
  unlimited: Record<string, DifficultyStats>;
};
