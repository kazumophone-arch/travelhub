"use client";

import { useEffect, useState } from "react";
import {
  CityDetailView,
  type CityDetailNearbyCity,
  type CityDetailSpot,
} from "@/components/CityDetailView";
import { EditableText } from "@/components/EditableText";
import { EditableImageButton } from "@/components/EditableImageButton";
import { EditableLinkButton } from "@/components/EditableLinkButton";
import { EditableGallery } from "@/components/EditableGallery";
import { EditableClimate } from "@/components/EditableClimate";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import { normalizeImagePosition, type GalleryImage, type ImagePosition } from "@/lib/url-fields";
import type { CityClimate } from "@/lib/climate";

type Props = {
  cityId: string;
  slug: string;
  city: string;
  country: string;
  countryId: string;
  sortRank: number;
  imageUrl: string;
  imagePosition: ImagePosition;
  imageAlt: string;
  imageCredit: string;
  imageSourceUrl: string;
  affiliateHotelUrl: string;
  affiliateTourUrl: string;
  bestMonths: string[];
  seasonNote: string;
  isPublished: boolean;
  onChangeCity: (value: string) => void;
  onChangeCountry: (value: string) => void;
  onChangeImageUrl: (value: string) => void;
  onChangeImagePosition: (value: ImagePosition) => void;
  onChangeAffiliateHotelUrl: (value: string) => void;
  onChangeAffiliateTourUrl: (value: string) => void;
  gallery: GalleryImage[];
  onChangeGallery: (value: GalleryImage[]) => void;
  climate: CityClimate;
  onChangeClimate: (value: CityClimate) => void;
};

type AdminCityRow = {
  id: string;
  slug: string;
  city: string;
  country: string;
  country_id: string | null;
  summary: string | null;
  image_url: string | null;
  image_position?: string | null;
  sort_rank: number | null;
  is_published: boolean;
};

type ChapterContext = {
  chapterNumber: number | null;
  chapterTotal: number;
  nextCity: CityDetailNearbyCity | null;
  nearbyCities: CityDetailNearbyCity[];
};

const EMPTY_CHAPTER_CONTEXT: ChapterContext = {
  chapterNumber: null,
  chapterTotal: 0,
  nextCity: null,
  nearbyCities: [],
};

function toNearbyCity(row: AdminCityRow): CityDetailNearbyCity {
  return {
    id: row.id,
    slug: row.slug,
    city: row.city,
    country: row.country,
    summary: row.summary,
    image_url: row.image_url,
    image_position: row.image_position,
  };
}

// Mirrors getCountryChapterContext (data/supabase-public-cities.ts): same
// country match strategy (country_id first, else country name) and the
// same sort_rank-then-name order, so the admin preview's chapter number /
// Next Chapter / Nearby Cities match exactly what the public page would
// show once this city is published. Sibling cities are restricted to
// is_published = true (matching what a real visitor would see); the city
// currently being edited is always included at its sort position, even if
// it is still a draft, since the whole preview already shows draft content
// as if it were live.
function buildChapterContext({
  cityId,
  slug,
  countryId,
  country,
  sortRank,
  allCities,
}: {
  cityId: string;
  slug: string;
  countryId: string;
  country: string;
  sortRank: number;
  allCities: AdminCityRow[];
}): ChapterContext {
  if (!cityId || !slug) {
    return EMPTY_CHAPTER_CONTEXT;
  }

  const normalizedCountry = country.trim().toLowerCase();

  const siblings = allCities.filter((row) => {
    if (row.id === cityId) return true;
    if (!row.is_published) return false;

    if (countryId) {
      return row.country_id === countryId;
    }

    return normalizedCountry.length > 0 && row.country.trim().toLowerCase() === normalizedCountry;
  });

  const selfRow: AdminCityRow = {
    id: cityId,
    slug,
    city: "",
    country,
    country_id: countryId || null,
    summary: null,
    image_url: null,
    image_position: null,
    sort_rank: sortRank,
    is_published: true,
  };

  const merged = siblings.some((row) => row.id === cityId)
    ? siblings.map((row) => (row.id === cityId ? { ...row, sort_rank: sortRank } : row))
    : [...siblings, selfRow];

  const sorted = [...merged].sort((a, b) => {
    const rankA = a.sort_rank ?? 999;
    const rankB = b.sort_rank ?? 999;
    if (rankA !== rankB) return rankA - rankB;
    return a.city.localeCompare(b.city);
  });

  const index = sorted.findIndex((row) => row.id === cityId);

  if (index === -1) {
    return EMPTY_CHAPTER_CONTEXT;
  }

  const chapterTotal = sorted.length;
  const nextRow = sorted[index + 1] ?? null;
  const nearbyCities = sorted
    .filter((row) => row.id !== cityId && row.id !== nextRow?.id)
    .slice(0, 4)
    .map(toNearbyCity);

  return {
    chapterNumber: chapterTotal >= 2 ? index + 1 : null,
    chapterTotal,
    nextCity: nextRow ? toNearbyCity(nextRow) : null,
    nearbyCities,
  };
}

async function readResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || "サーバー応答を読み取れませんでした。" };
  }
}

export function AdminCityInlineEditor({
  cityId,
  slug,
  city,
  country,
  countryId,
  sortRank,
  imageUrl,
  imagePosition,
  imageAlt,
  imageCredit,
  imageSourceUrl,
  affiliateHotelUrl,
  affiliateTourUrl,
  bestMonths,
  seasonNote,
  isPublished,
  onChangeCity,
  onChangeCountry,
  onChangeImageUrl,
  onChangeImagePosition,
  onChangeAffiliateHotelUrl,
  onChangeAffiliateTourUrl,
  gallery,
  onChangeGallery,
  climate,
  onChangeClimate,
}: Props) {
  const [spots, setSpots] = useState<CityDetailSpot[]>([]);
  const [chapterContext, setChapterContext] = useState<ChapterContext>(EMPTY_CHAPTER_CONTEXT);

  useEffect(() => {
    let cancelled = false;

    async function loadSpots() {
      if (!cityId) {
        setSpots([]);
        return;
      }

      const response = await fetch(`/api/admin/spots?cityId=${encodeURIComponent(cityId)}`);
      const data = await readResponse(response);

      if (cancelled || !response.ok) return;

      setSpots(
        ((data.spots ?? []) as CityDetailSpot[]).map((spot) => ({
          ...spot,
          image_position: normalizeImagePosition(spot.image_position),
        }))
      );
    }

    loadSpots();

    return () => {
      cancelled = true;
    };
  }, [cityId]);

  // Read-only preview context: mirrors the public chapter-numbering /
  // Next Chapter / Nearby Cities logic so the admin preview shows the same
  // sections a real visitor would see once this city is published. Reuses
  // the existing admin cities list endpoint (SELECT-only); this never
  // writes anything.
  useEffect(() => {
    let cancelled = false;

    async function loadChapterContext() {
      if (!cityId || !slug) {
        setChapterContext(EMPTY_CHAPTER_CONTEXT);
        return;
      }

      const response = await fetch("/api/admin/cities");
      const data = await readResponse(response);

      if (cancelled || !response.ok) return;

      const context = buildChapterContext({
        cityId,
        slug,
        countryId,
        country,
        sortRank,
        allCities: (data.cities ?? []) as AdminCityRow[],
      });

      setChapterContext(context);
    }

    loadChapterContext();

    return () => {
      cancelled = true;
    };
  }, [cityId, slug, countryId, country, sortRank]);

  const previewCity: SupabasePublicCity = {
    id: cityId,
    slug: slug || "preview",
    city: city || "都市名未入力",
    country: country || "国未入力",
    region: "",
    summary: "",
    description: "",
    image_url: imageUrl,
    image_alt: imageAlt,
    image_credit: imageCredit,
    image_source_url: imageSourceUrl,
    image_position: imagePosition,
    imagePosition,
    affiliate_hotel_url: affiliateHotelUrl,
    affiliate_tour_url: affiliateTourUrl,
    is_published: isPublished,
    sort_rank: sortRank,
    is_featured: false,
    featured_rank: null,
    best_months: bestMonths,
    season_note: seasonNote || null,
    gallery,
    climate,
  };

  return (
    <CityDetailView
      city={previewCity}
      spots={spots}
      chapterNumber={chapterContext.chapterNumber}
      chapterTotal={chapterContext.chapterTotal}
      nextCity={chapterContext.nextCity}
      nearbyCities={chapterContext.nearbyCities}
      slots={{
        title: (
          <EditableText value={city} onChange={onChangeCity} ariaLabel="都市名" placeholder="都市名" />
        ),
        country: (
          <EditableText
            value={country}
            onChange={onChangeCountry}
            ariaLabel="国名"
            placeholder="国名"
          />
        ),
        heroOverlay: (
          <EditableImageButton
            url={imageUrl}
            position={imagePosition}
            onChangeUrl={onChangeImageUrl}
            onChangePosition={onChangeImagePosition}
            uploadKind="city"
            citySlug={slug}
          />
        ),
        ctaEditor: (
          <EditableLinkButton
            tone="dark"
            buttonLabel="🔗 ホテル・ツアーのリンクを編集"
            fields={[
              {
                label: "ホテルアフィリエイトURL",
                value: affiliateHotelUrl,
                onChange: onChangeAffiliateHotelUrl,
              },
              {
                label: "ツアーアフィリエイトURL",
                value: affiliateTourUrl,
                onChange: onChangeAffiliateTourUrl,
              },
            ]}
          />
        ),
        galleryEditor: (
          <EditableGallery
            images={gallery}
            onChange={onChangeGallery}
            uploadKind="city"
            citySlug={slug}
          />
        ),
        climateEditor: <EditableClimate climate={climate} onChange={onChangeClimate} />,
      }}
    />
  );
}
