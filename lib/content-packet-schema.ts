// Phase 1: preview-only types for the Taleglen Content Packet format.
// Nothing in this file writes to Supabase. These types describe the JSON
// shape an owner pastes in after asking an AI to draft content — see
// /admin/import for the review screen that consumes them.

export type PacketGalleryImage = {
  url?: string;
  alt?: string;
  credit?: string;
  position?: string;
};

export type PacketClimateMonth = {
  month?: string;
  high?: number | null;
  low?: number | null;
  demand?: string;
};

export type PacketClimate = {
  months?: PacketClimateMonth[];
  peakSeason?: string;
  valueSeason?: string;
  weatherSummary?: string;
};

export type RecommendedStatus = "draft" | "publish";

export type PacketCountry = {
  slug?: string;
  name?: string;
  isoCode?: string;
  region?: string;
  imageUrl?: string;
  imageCredit?: string;
  imageSourceUrl?: string;
  sortRank?: number;
  recommendedStatus?: RecommendedStatus;
  seoTitle?: string;
  metaDescription?: string;
  sourceNotes?: string;
  warnings?: string[];
};

export type PacketCity = {
  slug?: string;
  countrySlug?: string;
  city?: string;
  country?: string;
  summary?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: string;
  imageSourceUrl?: string;
  imagePosition?: string;
  gallery?: PacketGalleryImage[];
  hotelUrl?: string;
  tourUrl?: string;
  bestMonths?: string[];
  seasonNote?: string;
  climate?: PacketClimate;
  tags?: string[];
  sortRank?: number;
  recommendedStatus?: RecommendedStatus;
  seoTitle?: string;
  metaDescription?: string;
  sourceNotes?: string;
  warnings?: string[];
};

export type PacketSpotNotes = {
  howToUse?: string;
  bestFor?: string;
  beforeYouGo?: string;
};

export type PacketSpot = {
  slug?: string;
  citySlug?: string;
  name?: string;
  summary?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: string;
  imageSourceUrl?: string;
  imagePosition?: string;
  gallery?: PacketGalleryImage[];
  hotelUrl?: string;
  tourUrl?: string;
  notes?: PacketSpotNotes;
  tags?: string[];
  recommendedStatus?: RecommendedStatus;
  seoTitle?: string;
  metaDescription?: string;
  sourceNotes?: string;
  warnings?: string[];
};

export type PacketJournalArticle = {
  slug?: string;
  title?: string;
  category?: string;
  description?: string;
  relatedCitySlug?: string;
  featured?: boolean;
  ctaLabel?: string;
  body?: string;
  recommendedStatus?: RecommendedStatus;
  sourceNotes?: string;
  warnings?: string[];
};

export type TaleglenContentPacket = {
  packetVersion?: string;
  generatedBy?: string;
  ownerNote?: string;
  countries?: PacketCountry[];
  cities?: PacketCity[];
  spots?: PacketSpot[];
  journalArticles?: PacketJournalArticle[];
};

export type PacketParseResult =
  | { ok: true; packet: TaleglenContentPacket }
  | { ok: false; error: string };

// Safe JSON.parse: never throws, never touches the network or Supabase.
export function parseContentPacket(rawText: string): PacketParseResult {
  const trimmed = rawText.trim();

  if (!trimmed) {
    return { ok: false, error: "貼り付けまたはアップロードされた内容が空です。" };
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(trimmed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return { ok: false, error: `JSONとして読み取れませんでした: ${message}` };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, error: "パケットは1つのJSONオブジェクトである必要があります。" };
  }

  const record = parsed as Record<string, unknown>;

  for (const key of ["countries", "cities", "spots", "journalArticles"] as const) {
    if (key in record && !Array.isArray(record[key])) {
      return { ok: false, error: `"${key}" は配列である必要があります。` };
    }
  }

  return { ok: true, packet: parsed as TaleglenContentPacket };
}
