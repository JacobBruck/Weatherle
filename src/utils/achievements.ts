import { citiesForDifficulty, type Difficulty } from '../hooks/useDifficulty';
import type { GameMode } from '../hooks/useGameMode';
import { getStats } from './stats';
import { VIBE_LABELS } from '../data/cityVibes';

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unlocked: boolean;
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const DIFF_LABELS: Record<Difficulty, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
const TOTAL_CONTINENTS = 7;
const TOTAL_VIBES = Object.keys(VIBE_LABELS).length;

/** Progress for every achievement, scoped to a single (mode, difficulty) pair. */
export function getAchievements(mode: GameMode, difficulty: Difficulty): Achievement[] {
  const stats = getStats(mode, difficulty);
  const pool = citiesForDifficulty(difficulty);
  const totalCountries = new Set(pool.map((c) => c.countryCode)).size;
  const tripleThreat = DIFFICULTIES.every((d) => getStats(mode, d).wins > 0);
  const hardWins = getStats(mode, 'hard').wins;
  const elevationExtremes = (stats.wonHighElevation ? 1 : 0) + (stats.wonLowElevation ? 1 : 0);
  const sizeExtremes = (stats.wonMegacity ? 1 : 0) + (stats.wonSmallTown ? 1 : 0);

  const achievements: Achievement[] = [
    {
      id: 'in-one',
      emoji: '🎯',
      title: 'In 1!',
      description: 'Guess the city correctly on your very first try.',
      current: stats.guessDistribution[0] > 0 ? 1 : 0,
      target: 1,
      unlocked: stats.guessDistribution[0] > 0,
    },
  ];

  if (mode === 'daily') {
    achievements.push(
      {
        id: 'streak-100',
        emoji: '🔥',
        title: '100 Day Streak',
        description: 'Reach a 100-day Daily Challenge win streak.',
        current: Math.min(stats.bestStreak, 100),
        target: 100,
        unlocked: stats.bestStreak >= 100,
      },
      {
        id: 'streak-365',
        emoji: '🔥',
        title: '365 Day Streak',
        description: 'Reach a 365-day Daily Challenge win streak.',
        current: Math.min(stats.bestStreak, 365),
        target: 365,
        unlocked: stats.bestStreak >= 365,
      },
      {
        id: 'streak-500',
        emoji: '🔥',
        title: '500 Day Streak',
        description: 'Reach a 500-day Daily Challenge win streak.',
        current: Math.min(stats.bestStreak, 500),
        target: 500,
        unlocked: stats.bestStreak >= 500,
      },
    );
  }

  achievements.push(
    {
      id: 'continents',
      emoji: '🌍',
      title: '7 Continents',
      description: 'Correctly guess a city on every continent, including Antarctica.',
      current: Math.min(stats.continentsWon.length, TOTAL_CONTINENTS),
      target: TOTAL_CONTINENTS,
      unlocked: stats.continentsWon.length >= TOTAL_CONTINENTS,
    },
    {
      id: 'all-countries',
      emoji: '🗺️',
      title: 'All Countries',
      description: `Correctly guess a city from every country in ${DIFF_LABELS[difficulty]} mode (${totalCountries} total).`,
      current: Math.min(stats.countriesWon.length, totalCountries),
      target: totalCountries,
      unlocked: stats.countriesWon.length >= totalCountries,
    },
    {
      id: 'vibe-collector',
      emoji: '🎭',
      title: 'Vibe Collector',
      description: `Correctly guess a city for each of the ${TOTAL_VIBES} city vibes (Capital, Vacation, Historical, Cultural, Industrial, Financial, Tech, Port, University, Religious).`,
      current: Math.min(stats.vibesWon.length, TOTAL_VIBES),
      target: TOTAL_VIBES,
      unlocked: stats.vibesWon.length >= TOTAL_VIBES,
    },
    {
      id: 'high-low',
      emoji: '⛰️',
      title: 'High & Low',
      description: 'Correctly guess a high-altitude city (2,000m+) and a sea-level city (10m or below).',
      current: elevationExtremes,
      target: 2,
      unlocked: elevationExtremes >= 2,
    },
    {
      id: 'big-small',
      emoji: '📏',
      title: 'Big & Small',
      description: 'Correctly guess a megacity (10M+ population) and a small town (under 50,000).',
      current: sizeExtremes,
      target: 2,
      unlocked: sizeExtremes >= 2,
    },
    {
      id: 'century',
      emoji: '💯',
      title: 'Century',
      description: 'Play 100 games.',
      current: Math.min(stats.gamesPlayed, 100),
      target: 100,
      unlocked: stats.gamesPlayed >= 100,
    },
    {
      id: 'marathoner',
      emoji: '🏃',
      title: 'Marathoner',
      description: 'Play 500 games.',
      current: Math.min(stats.gamesPlayed, 500),
      target: 500,
      unlocked: stats.gamesPlayed >= 500,
    },
    {
      id: 'triple-threat',
      emoji: '🎖️',
      title: 'Triple Threat',
      description: 'Win at least one game on Easy, Medium, and Hard.',
      current: tripleThreat ? 1 : 0,
      target: 1,
      unlocked: tripleThreat,
    },
    {
      id: 'hard-mode-hero',
      emoji: '🏅',
      title: 'Hard Mode Hero',
      description: 'Win 50 games on Hard difficulty.',
      current: Math.min(hardWins, 50),
      target: 50,
      unlocked: hardWins >= 50,
    },
    {
      id: 'comeback-kid',
      emoji: '😅',
      title: 'Comeback Kid',
      description: 'Win a game using all 8 guesses.',
      current: stats.guessDistribution[7] > 0 ? 1 : 0,
      target: 1,
      unlocked: stats.guessDistribution[7] > 0,
    },
  );

  // Globe Trotter — progressive tiers, each revealed once the previous one unlocks.
  const globeTrotterTiers: { id: string; title: string; target: number }[] = [
    { id: 'globe-trotter-1', title: 'Globe Trotter I', target: 50_000 },
    { id: 'globe-trotter-2', title: 'Globe Trotter II', target: 100_000 },
    { id: 'globe-trotter-3', title: 'Globe Trotter III', target: 500_000 },
  ];
  for (const tier of globeTrotterTiers) {
    achievements.push({
      id: tier.id,
      emoji: '🛫',
      title: tier.title,
      description: `Your guesses' combined distance from the target reaches ${tier.target.toLocaleString()} km.`,
      current: Math.min(Math.round(stats.cumulativeDistanceKm), tier.target),
      target: tier.target,
      unlocked: stats.cumulativeDistanceKm >= tier.target,
    });
    if (stats.cumulativeDistanceKm < tier.target) break;
  }

  // Hot Streak (Unlimited) — progressive tiers, each revealed once the previous one unlocks.
  if (mode === 'unlimited') {
    const hotStreakTiers: { id: string; title: string; target: number }[] = [
      { id: 'hot-streak-1', title: 'Hot Streak I', target: 10 },
      { id: 'hot-streak-2', title: 'Hot Streak II', target: 50 },
      { id: 'hot-streak-3', title: 'Hot Streak III', target: 100 },
    ];
    for (const tier of hotStreakTiers) {
      achievements.push({
        id: tier.id,
        emoji: '⚡',
        title: tier.title,
        description: `Win ${tier.target} Unlimited rounds in a row without a loss.`,
        current: Math.min(stats.bestStreak, tier.target),
        target: tier.target,
        unlocked: stats.bestStreak >= tier.target,
      });
      if (stats.bestStreak < tier.target) break;
    }
  }

  return achievements;
}
