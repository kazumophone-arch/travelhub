/**
 * SAMPLE / PLACEHOLDER DATA — Kyoto scroll story only.
 *
 * Everything in this file is illustrative "sample" content, explicitly
 * approved by the site owner for public display, PROVIDED that every card
 * or badge rendered from this data is clearly labelled "Sample" (or
 * equivalent) in the UI so it is never mistaken for confirmed, factual
 * information.
 *
 * Rules for this file:
 * - No real hotel names, tour operators, or prices — categories/descriptions
 *   only.
 * - Nothing here is persisted to Supabase/the DB; it is hardcoded and
 *   referenced only by components/ScrollyCityStory.tsx (Kyoto's dedicated
 *   scroll story page).
 * - When real per-city data for these sections exists in the future, this
 *   file (or the relevant section of it) should be deleted/replaced wholesale
 *   rather than patched in place.
 */

export type SampleSeasonKey = "spring" | "summer" | "autumn" | "winter";

export type SampleSeason = {
  key: SampleSeasonKey;
  label: string;
  /** Index into the section's shared image pool (hero + spot images). */
  imageIndex: number;
  /** Sample-only "suggested spot" name for this season (illustrative). */
  sampleHighlight: string;
};

// Seasons are mapped onto the 4 existing real images (hero + up to 3 spots)
// purely so the tab UI has something to show. This mapping is arbitrary and
// carries no factual claim about which season each photo was taken in.
export const SAMPLE_SEASONS: SampleSeason[] = [
  { key: "spring", label: "Spring", imageIndex: 0, sampleHighlight: "Sample: a quieter garden or riverside walk" },
  { key: "summer", label: "Summer", imageIndex: 1, sampleHighlight: "Sample: a shaded temple approach" },
  { key: "autumn", label: "Autumn", imageIndex: 2, sampleHighlight: "Sample: a hillside or forest viewpoint" },
  { key: "winter", label: "Winter", imageIndex: 3, sampleHighlight: "Sample: a calm, low-crowd morning route" },
];

export type SampleStayLength = {
  key: "quick" | "standard" | "slow";
  label: string;
  duration: string;
  description: string;
};

// General-purpose pacing guidance, not city-verified trip planning data.
export const SAMPLE_STAY_LENGTHS: SampleStayLength[] = [
  {
    key: "quick",
    label: "Quick",
    duration: "1 day",
    description: "Sample / general guideline: enough time for a small number of highlights at a brisk pace.",
  },
  {
    key: "standard",
    label: "Standard",
    duration: "2–3 days",
    description: "Sample / general guideline: a comfortable pace covering the main sights without rushing.",
  },
  {
    key: "slow",
    label: "Slow",
    duration: "4–5 days",
    description: "Sample / general guideline: room for day trips, quieter neighborhoods, and unhurried return visits.",
  },
];

export type SampleStayArea = {
  key: "luxury" | "mid-range" | "budget";
  label: string;
  description: string;
};

// Category-level descriptions only — no real property names or prices.
export const SAMPLE_STAY_AREAS: SampleStayArea[] = [
  {
    key: "luxury",
    label: "Luxury",
    description: "Sample: upscale hotel and ryokan options, typically closer to central sightseeing areas.",
  },
  {
    key: "mid-range",
    label: "Mid-range",
    description: "Sample: comfortable, well-located hotels that balance cost and convenience.",
  },
  {
    key: "budget",
    label: "Budget",
    description: "Sample: simple, affordable stays for travelers prioritizing value over location.",
  },
];

export type SampleTourCategory = {
  key: "walking" | "food" | "cruise";
  label: string;
  description: string;
};

// Category-level descriptions only — no real tour operator names or prices.
export const SAMPLE_TOUR_CATEGORIES: SampleTourCategory[] = [
  {
    key: "walking",
    label: "Walking Tour",
    description: "Sample: a guided route through notable streets, temples, or districts on foot.",
  },
  {
    key: "food",
    label: "Food Tour",
    description: "Sample: a tasting-style route through local dishes, markets, or small eateries.",
  },
  {
    key: "cruise",
    label: "Cruise",
    description: "Sample: a scenic boat or river route, where seasonally available, for a different view of the city.",
  },
];
