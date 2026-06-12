/** Hidden personal touches — shown when these specific cities are the target. */
export const SPECIAL_MESSAGES: Record<string, { win: string; lose: string }> = {
  'new-milford-us': {
    win: "Congratulations, you've discovered the Creator's hometown!",
    lose: "So close! That was the Creator's hometown — New Milford, CT.",
  },
  'villanova-us': {
    win: "Congratulations, you've discovered the Creator's College town! Go Cats!! \\V/",
    lose: "So close! That was the Creator's College town — Villanova! Go Cats!! \\V/",
  },
};

/** Only these cities trigger the cracking-egg easter egg; all other cities use the normal flow. */
export const EASTER_EGG_CITY_IDS = new Set(Object.keys(SPECIAL_MESSAGES));
