export const CATEGORY_OPTIONS = [
  "Strategie",
  "Familie",
  "Party",
  "Kaartspel",
  "Kinderspel",
];

export const SORT_OPTIONS = [
  { value: "name-asc", label: "Naam (A-Z)" },
  { value: "name-desc", label: "Naam (Z-A)" },
  { value: "price-asc", label: "Prijs (laag-hoog)" },
  { value: "price-desc", label: "Prijs (hoog-laag)" },
  { value: "popular", label: "Populariteit" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

// Games with a review count at or above this get the "Meest gewild" flame badge.
export const POPULAR_REVIEW_THRESHOLD = 90;

// No curated video per game (144 titles) — link to a YouTube search for the
// game's instruction video instead, so the icon always leads somewhere relevant.
export function getInstructionVideoUrl(title: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} spelregels uitleg`)}`;
}
