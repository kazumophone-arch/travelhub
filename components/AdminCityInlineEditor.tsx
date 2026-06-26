"use client";

import { useEffect, useState } from "react";
import { CityDetailView, type CityDetailSpot } from "@/components/CityDetailView";
import { EditableText } from "@/components/EditableText";
import { EditableImageButton } from "@/components/EditableImageButton";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import { normalizeImagePosition, type ImagePosition } from "@/lib/url-fields";

type Props = {
  cityId: string;
  slug: string;
  city: string;
  country: string;
  imageUrl: string;
  imagePosition: ImagePosition;
  affiliateHotelUrl: string;
  affiliateTourUrl: string;
  bestMonths: string[];
  seasonNote: string;
  isPublished: boolean;
  onChangeCity: (value: string) => void;
  onChangeCountry: (value: string) => void;
  onChangeImageUrl: (value: string) => void;
  onChangeImagePosition: (value: ImagePosition) => void;
};

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
  imageUrl,
  imagePosition,
  affiliateHotelUrl,
  affiliateTourUrl,
  bestMonths,
  seasonNote,
  isPublished,
  onChangeCity,
  onChangeCountry,
  onChangeImageUrl,
  onChangeImagePosition,
}: Props) {
  const [spots, setSpots] = useState<CityDetailSpot[]>([]);

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

  const previewCity: SupabasePublicCity = {
    id: cityId,
    slug: slug || "preview",
    city: city || "都市名未入力",
    country: country || "国未入力",
    region: "",
    summary: "",
    description: "",
    image_url: imageUrl,
    image_alt: "",
    image_credit: "",
    image_source_url: "",
    image_position: imagePosition,
    imagePosition,
    affiliate_hotel_url: affiliateHotelUrl,
    affiliate_tour_url: affiliateTourUrl,
    is_published: isPublished,
    sort_rank: 999,
    is_featured: false,
    featured_rank: null,
    best_months: bestMonths,
    season_note: seasonNote || null,
  };

  return (
    <CityDetailView
      city={previewCity}
      spots={spots}
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
      }}
    />
  );
}
