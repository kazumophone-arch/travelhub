// Phase 1: pure, read-only validation/diff logic for the AI Content Import
// Desk. Nothing here calls Supabase, calls an AI API, or writes anything.
// The API route (app/api/admin/import/validate/route.ts) fetches existing
// rows with SELECT-only queries and passes them into the functions below.
import { getOptionalHttpUrl } from "@/lib/url-fields";
import type {
  PacketCity,
  PacketCountry,
  PacketJournalArticle,
  PacketSpot,
  RecommendedStatus,
  TaleglenContentPacket,
} from "@/lib/content-packet-schema";

export type ImportStatus = "new" | "update" | "invalid";

export type FieldDiff = { field: string; before: string; after: string };

export type EntityReport = {
  kind: "country" | "city" | "spot" | "journal";
  index: number;
  slug: string;
  label: string;
  status: ImportStatus;
  errors: string[];
  missingFields: string[];
  uncertainMarkers: string[];
  warnings: string[];
  recommendedStatus: RecommendedStatus | null;
  publicUrlPreview: string | null;
  diffs: FieldDiff[];
};

export type PacketReport = {
  packetVersion: string | null;
  generatedBy: string | null;
  ownerNote: string | null;
  countries: EntityReport[];
  cities: EntityReport[];
  spots: EntityReport[];
  journalArticles: EntityReport[];
  summary: {
    totalEntities: number;
    newCount: number;
    updateCount: number;
    invalidCount: number;
    uncertainCount: number;
  };
};

export type ExistingCountryRow = {
  id: string;
  slug: string;
  name: string;
  region: string | null;
  image_url: string | null;
  image_source_url: string | null;
};

export type ExistingCityRow = {
  id: string;
  slug: string;
  city: string;
  country: string;
  summary: string | null;
  description: string | null;
  image_url: string | null;
  image_credit: string | null;
  image_source_url: string | null;
  affiliate_hotel_url: string | null;
  affiliate_tour_url: string | null;
};

export type ExistingSpotNotes = {
  how_to_use?: string | null;
  best_for?: string | null;
  before_you_go?: string | null;
} | null;

export type ExistingSpotRow = {
  id: string;
  slug: string;
  city_id: string | null;
  name: string;
  summary: string | null;
  description: string | null;
  image_url: string | null;
  image_credit: string | null;
  image_source_url: string | null;
  affiliate_hotel_url: string | null;
  affiliate_tour_url: string | null;
  notes: ExistingSpotNotes;
};

const UNCERTAIN_RE = /\[UNCERTAIN:[^\]]*\]/gi;

// Suspicious query-string fragments that suggest an AI invented a partner/
// affiliate tracking id rather than using a plain, id-less search URL.
const SUSPICIOUS_AFFILIATE_PARAMS = [
  "aid=",
  "tag=",
  "affiliate_id=",
  "partner_id=",
  "associate_id=",
  "camref=",
  "clickref=",
];

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function collectStrings(value: unknown, into: string[], depth = 0) {
  if (depth > 6) return;

  if (typeof value === "string") {
    into.push(value);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, into, depth + 1);
    return;
  }

  if (value && typeof value === "object") {
    for (const nested of Object.values(value as Record<string, unknown>)) {
      collectStrings(nested, into, depth + 1);
    }
  }
}

function findUncertainMarkers(entity: unknown): string[] {
  const strings: string[] = [];
  collectStrings(entity, strings);

  const matches: string[] = [];
  for (const text of strings) {
    const found = text.match(UNCERTAIN_RE);
    if (found) matches.push(...found);
  }

  return matches;
}

function checkAffiliateUrl(url: string | undefined, label: string, warnings: string[]) {
  const value = String(url ?? "").trim();
  if (!value) return;

  const safeUrl = getOptionalHttpUrl(value);
  if (!safeUrl) {
    warnings.push(`${label}: http/https で始まる有効なURLではありません（"${value}"）。`);
    return;
  }

  const lower: string = safeUrl.toLowerCase();
  const suspicious: string = SUSPICIOUS_AFFILIATE_PARAMS.find((param) => lower.includes(param)) ?? "";
  if (suspicious) {
    warnings.push(
      `${label}: 提携ID風のパラメータ（${suspicious}）を含みます。AIが正規の提携IDを持つことはないため、要手動確認です。`
    );
  }
}

function checkImageFields(
  imageUrl: string | undefined,
  imageCredit: string | undefined | null,
  imageSourceUrl: string | undefined | null,
  missingFields: string[],
  warnings: string[],
  hasCreditColumn = true
) {
  const url = String(imageUrl ?? "").trim();

  if (!url) {
    missingFields.push("画像URLが未設定です。");
    return;
  }

  const safeUrl = getOptionalHttpUrl(url);
  if (!safeUrl) {
    warnings.push(`画像URLが http/https で始まる有効なURLではありません（"${url}"）。`);
  }

  if (hasCreditColumn && !String(imageCredit ?? "").trim()) {
    missingFields.push("画像クレジットが未設定です。");
  }

  if (!String(imageSourceUrl ?? "").trim()) {
    missingFields.push("画像出典URLが未設定です。");
  }
}

function checkShortText(
  summary: string | undefined,
  description: string | undefined,
  minLength: number,
  missingFields: string[]
) {
  const combinedLength = String(summary ?? "").trim().length + String(description ?? "").trim().length;

  if (combinedLength === 0) {
    missingFields.push("説明文（summary/description）が未設定です。");
  } else if (combinedLength < minLength) {
    missingFields.push(`説明文が短めです（現在約${combinedLength}文字、目安${minLength}文字以上）。`);
  }
}

function duplicateSlugCounts(items: { slug?: string }[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const item of items) {
    const slug = String(item.slug ?? "").trim();
    if (!slug) continue;
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  return counts;
}

function diffField(field: string, before: string | null | undefined, after: string | undefined, diffs: FieldDiff[]) {
  const afterValue = after === undefined ? undefined : String(after).trim();
  if (afterValue === undefined || afterValue === "") return;

  const beforeValue = String(before ?? "").trim();
  if (beforeValue !== afterValue) {
    diffs.push({ field, before: beforeValue || "(空)", after: afterValue });
  }
}

function buildCountryReports(
  packetCountries: PacketCountry[],
  existingBySlug: Map<string, ExistingCountryRow>
): EntityReport[] {
  const slugCounts = duplicateSlugCounts(packetCountries);

  return packetCountries.map((country, index) => {
    const slug = String(country.slug ?? "").trim();
    const errors: string[] = [];
    const missingFields: string[] = [];
    const warnings: string[] = [];

    if (!String(country.name ?? "").trim()) errors.push("国名（name）が必須です。");
    if (!slug) {
      errors.push("スラッグ（slug）が必須です。");
    } else if (!SLUG_PATTERN.test(slug)) {
      errors.push("スラッグは英小文字・数字・ハイフンのみで入力してください。");
    } else if ((slugCounts.get(slug) ?? 0) > 1) {
      errors.push(`同一パケット内でスラッグ "${slug}" が重複しています。`);
    }

    checkImageFields(country.imageUrl, undefined, country.imageSourceUrl, missingFields, warnings, false);

    const uncertainMarkers = findUncertainMarkers(country);
    const existing = slug ? existingBySlug.get(slug) : undefined;
    const diffs: FieldDiff[] = [];
    let status: ImportStatus = errors.length > 0 ? "invalid" : "new";

    if (errors.length === 0 && existing) {
      status = "update";
      diffField("name", existing.name, country.name, diffs);
      diffField("region", existing.region, country.region, diffs);
      diffField("image_url", existing.image_url, country.imageUrl, diffs);
      diffField("image_source_url", existing.image_source_url, country.imageSourceUrl, diffs);
    }

    return {
      kind: "country",
      index,
      slug,
      label: String(country.name ?? slug ?? `country[${index}]`),
      status,
      errors,
      missingFields,
      uncertainMarkers,
      warnings,
      recommendedStatus: country.recommendedStatus ?? null,
      publicUrlPreview: slug ? `/countries/${slug}` : null,
      diffs,
    };
  });
}

function buildCityReports(
  packetCities: PacketCity[],
  packetCountrySlugs: Set<string>,
  existingCountrySlugs: Set<string>,
  existingBySlug: Map<string, ExistingCityRow>
): EntityReport[] {
  const slugCounts = duplicateSlugCounts(packetCities);

  return packetCities.map((city, index) => {
    const slug = String(city.slug ?? "").trim();
    const countrySlug = String(city.countrySlug ?? "").trim();
    const errors: string[] = [];
    const missingFields: string[] = [];
    const warnings: string[] = [];

    if (!String(city.city ?? "").trim()) errors.push("都市名（city）が必須です。");
    if (!slug) {
      errors.push("スラッグ（slug）が必須です。");
    } else if (!SLUG_PATTERN.test(slug)) {
      errors.push("スラッグは英小文字・数字・ハイフンのみで入力してください。");
    } else if ((slugCounts.get(slug) ?? 0) > 1) {
      errors.push(`同一パケット内でスラッグ "${slug}" が重複しています。`);
    }

    if (!countrySlug) {
      errors.push("countrySlug が必須です（国との紐付け）。");
    } else if (!packetCountrySlugs.has(countrySlug) && !existingCountrySlugs.has(countrySlug)) {
      errors.push(
        `countrySlug "${countrySlug}" がパケット内にも既存の国にも見つかりません（親関係エラー）。`
      );
    }

    checkShortText(city.summary, city.description, 60, missingFields);
    checkImageFields(city.imageUrl, city.imageCredit, city.imageSourceUrl, missingFields, warnings, true);
    checkAffiliateUrl(city.hotelUrl, "ホテルURL", warnings);
    checkAffiliateUrl(city.tourUrl, "ツアーURL", warnings);

    if (!String(city.hotelUrl ?? "").trim() && !String(city.tourUrl ?? "").trim()) {
      missingFields.push("ホテルURL・ツアーURLがどちらも未設定です。");
    }

    const uncertainMarkers = findUncertainMarkers(city);
    const existing = slug ? existingBySlug.get(slug) : undefined;
    const diffs: FieldDiff[] = [];
    let status: ImportStatus = errors.length > 0 ? "invalid" : "new";

    if (errors.length === 0 && existing) {
      status = "update";
      diffField("summary", existing.summary, city.summary, diffs);
      diffField("description", existing.description, city.description, diffs);
      diffField("image_url", existing.image_url, city.imageUrl, diffs);
      diffField("image_credit", existing.image_credit, city.imageCredit, diffs);
      diffField("image_source_url", existing.image_source_url, city.imageSourceUrl, diffs);
      diffField("affiliate_hotel_url", existing.affiliate_hotel_url, city.hotelUrl, diffs);
      diffField("affiliate_tour_url", existing.affiliate_tour_url, city.tourUrl, diffs);
    }

    return {
      kind: "city",
      index,
      slug,
      label: String(city.city ?? slug ?? `city[${index}]`),
      status,
      errors,
      missingFields,
      uncertainMarkers,
      warnings,
      recommendedStatus: city.recommendedStatus ?? null,
      publicUrlPreview: slug ? `/c/${slug}` : null,
      diffs,
    };
  });
}

function buildSpotReports(
  packetSpots: PacketSpot[],
  packetCitySlugs: Set<string>,
  existingCitySlugs: Set<string>,
  existingBySlug: Map<string, ExistingSpotRow>
): EntityReport[] {
  const slugCounts = duplicateSlugCounts(packetSpots);

  return packetSpots.map((spot, index) => {
    const slug = String(spot.slug ?? "").trim();
    const citySlug = String(spot.citySlug ?? "").trim();
    const errors: string[] = [];
    const missingFields: string[] = [];
    const warnings: string[] = [];

    if (!String(spot.name ?? "").trim()) errors.push("スポット名（name）が必須です。");
    if (!slug) {
      errors.push("スラッグ（slug）が必須です。");
    } else if (!SLUG_PATTERN.test(slug)) {
      errors.push("スラッグは英小文字・数字・ハイフンのみで入力してください。");
    } else if ((slugCounts.get(slug) ?? 0) > 1) {
      errors.push(`同一パケット内でスラッグ "${slug}" が重複しています。`);
    }

    if (!citySlug) {
      errors.push("citySlug が必須です（都市との紐付け）。");
    } else if (!packetCitySlugs.has(citySlug) && !existingCitySlugs.has(citySlug)) {
      errors.push(`citySlug "${citySlug}" がパケット内にも既存の都市にも見つかりません（親関係エラー）。`);
    }

    checkShortText(spot.summary, spot.description, 80, missingFields);
    checkImageFields(spot.imageUrl, spot.imageCredit, spot.imageSourceUrl, missingFields, warnings, true);
    checkAffiliateUrl(spot.hotelUrl, "ホテルURL", warnings);
    checkAffiliateUrl(spot.tourUrl, "ツアーURL", warnings);

    const notes = spot.notes ?? {};
    const missingNotes = ["howToUse", "bestFor", "beforeYouGo"].filter(
      (key) => !String((notes as Record<string, unknown>)[key] ?? "").trim()
    );
    if (missingNotes.length > 0) {
      missingFields.push(`フィールドガイドの項目が${missingNotes.length}件未入力です（notes）。`);
    }

    const uncertainMarkers = findUncertainMarkers(spot);
    const existing = slug ? existingBySlug.get(slug) : undefined;
    const diffs: FieldDiff[] = [];
    let status: ImportStatus = errors.length > 0 ? "invalid" : "new";

    if (errors.length === 0 && existing) {
      status = "update";
      diffField("summary", existing.summary, spot.summary, diffs);
      diffField("description", existing.description, spot.description, diffs);
      diffField("image_url", existing.image_url, spot.imageUrl, diffs);
      diffField("image_credit", existing.image_credit, spot.imageCredit, diffs);
      diffField("image_source_url", existing.image_source_url, spot.imageSourceUrl, diffs);
      diffField("affiliate_hotel_url", existing.affiliate_hotel_url, spot.hotelUrl, diffs);
      diffField("affiliate_tour_url", existing.affiliate_tour_url, spot.tourUrl, diffs);
      diffField("notes.how_to_use", existing.notes?.how_to_use, notes.howToUse, diffs);
      diffField("notes.best_for", existing.notes?.best_for, notes.bestFor, diffs);
      diffField("notes.before_you_go", existing.notes?.before_you_go, notes.beforeYouGo, diffs);
    }

    return {
      kind: "spot",
      index,
      slug,
      label: String(spot.name ?? slug ?? `spot[${index}]`),
      status,
      errors,
      missingFields,
      uncertainMarkers,
      warnings,
      recommendedStatus: spot.recommendedStatus ?? null,
      publicUrlPreview: slug && citySlug ? `/c/${citySlug}/spot/${slug}` : null,
      diffs,
    };
  });
}

function buildJournalReports(
  packetJournal: PacketJournalArticle[],
  packetCitySlugs: Set<string>,
  existingCitySlugs: Set<string>
): EntityReport[] {
  const slugCounts = duplicateSlugCounts(packetJournal);

  return packetJournal.map((article, index) => {
    const slug = String(article.slug ?? "").trim();
    const relatedCitySlug = String(article.relatedCitySlug ?? "").trim();
    const errors: string[] = [];
    const missingFields: string[] = [];

    if (!String(article.title ?? "").trim()) errors.push("タイトル（title）が必須です。");
    if (!slug) {
      errors.push("スラッグ（slug）が必須です。");
    } else if (!SLUG_PATTERN.test(slug)) {
      errors.push("スラッグは英小文字・数字・ハイフンのみで入力してください。");
    } else if ((slugCounts.get(slug) ?? 0) > 1) {
      errors.push(`同一パケット内でスラッグ "${slug}" が重複しています。`);
    }

    if (!relatedCitySlug) {
      missingFields.push("relatedCitySlug が未設定です。");
    } else if (!packetCitySlugs.has(relatedCitySlug) && !existingCitySlugs.has(relatedCitySlug)) {
      errors.push(
        `relatedCitySlug "${relatedCitySlug}" がパケット内にも既存の都市にも見つかりません（親関係エラー）。`
      );
    }

    checkShortText(article.description, article.body, 100, missingFields);

    const uncertainMarkers = findUncertainMarkers(article);

    return {
      kind: "journal",
      index,
      slug,
      label: String(article.title ?? slug ?? `journal[${index}]`),
      status: errors.length > 0 ? "invalid" : "new",
      errors,
      missingFields,
      uncertainMarkers,
      warnings: [
        "Journalは現在データベーステーブルがありません。取り込みは data/journal.ts に貼り付けるコードスニペットとして提供されます（自動書き込みなし）。",
      ],
      recommendedStatus: article.recommendedStatus ?? null,
      publicUrlPreview: slug ? `/journal/${slug}` : null,
      diffs: [],
    };
  });
}

export function buildPacketReport(
  packet: TaleglenContentPacket,
  existing: {
    countries: ExistingCountryRow[];
    cities: ExistingCityRow[];
    spots: ExistingSpotRow[];
  }
): PacketReport {
  const packetCountries = packet.countries ?? [];
  const packetCities = packet.cities ?? [];
  const packetSpots = packet.spots ?? [];
  const packetJournal = packet.journalArticles ?? [];

  const existingCountryBySlug = new Map(existing.countries.map((row) => [row.slug, row]));
  const existingCityBySlug = new Map(existing.cities.map((row) => [row.slug, row]));
  const existingSpotBySlug = new Map(existing.spots.map((row) => [row.slug, row]));

  const packetCountrySlugs = new Set(
    packetCountries.map((c) => String(c.slug ?? "").trim()).filter(Boolean)
  );
  const packetCitySlugs = new Set(
    packetCities.map((c) => String(c.slug ?? "").trim()).filter(Boolean)
  );
  const existingCountrySlugs = new Set(existing.countries.map((row) => row.slug));
  const existingCitySlugs = new Set(existing.cities.map((row) => row.slug));

  const countries = buildCountryReports(packetCountries, existingCountryBySlug);
  const cities = buildCityReports(
    packetCities,
    packetCountrySlugs,
    existingCountrySlugs,
    existingCityBySlug
  );
  const spots = buildSpotReports(
    packetSpots,
    packetCitySlugs,
    existingCitySlugs,
    existingSpotBySlug
  );
  const journalArticles = buildJournalReports(packetJournal, packetCitySlugs, existingCitySlugs);

  const all = [...countries, ...cities, ...spots, ...journalArticles];

  return {
    packetVersion: packet.packetVersion ?? null,
    generatedBy: packet.generatedBy ?? null,
    ownerNote: packet.ownerNote ?? null,
    countries,
    cities,
    spots,
    journalArticles,
    summary: {
      totalEntities: all.length,
      newCount: all.filter((e) => e.status === "new").length,
      updateCount: all.filter((e) => e.status === "update").length,
      invalidCount: all.filter((e) => e.status === "invalid").length,
      uncertainCount: all.filter((e) => e.uncertainMarkers.length > 0).length,
    },
  };
}
