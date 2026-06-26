"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminPreviewCanvas } from "@/components/AdminPreviewCanvas";
import { SpotDetailView, type SpotDetailSpot } from "@/components/SpotDetailView";
import layoutStyles from "@/components/AdminEditLayout.module.css";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import { normalizeImagePosition, type ImagePosition } from "@/lib/url-fields";

type Props = {
  spotId: string;
  cityId: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  imageUrl: string;
  imagePosition: ImagePosition;
  affiliateHotelUrl: string;
  affiliateTourUrl: string;
  isPublished: boolean;
  publicPath: string;
};

async function readResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || "サーバー応答を読み取れませんでした。" };
  }
}

export function AdminSpotWysiwygPreview({
  spotId,
  cityId,
  name,
  slug,
  summary,
  description,
  imageUrl,
  imagePosition,
  affiliateHotelUrl,
  affiliateTourUrl,
  isPublished,
  publicPath,
}: Props) {
  const [city, setCity] = useState<SupabasePublicCity | null>(null);
  const [nearbySpots, setNearbySpots] = useState<SpotDetailSpot[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadCityContext() {
      if (!cityId) {
        setCity(null);
        setNearbySpots([]);
        return;
      }

      const [cityResponse, spotsResponse] = await Promise.all([
        fetch(`/api/admin/cities?id=${encodeURIComponent(cityId)}`),
        fetch(`/api/admin/spots?cityId=${encodeURIComponent(cityId)}`),
      ]);

      const cityData = await readResponse(cityResponse);
      const spotsData = await readResponse(spotsResponse);

      if (cancelled) return;

      if (cityResponse.ok && cityData.city) {
        setCity({
          ...cityData.city,
          imagePosition: normalizeImagePosition(cityData.city.image_position),
        });
      }

      if (spotsResponse.ok) {
        const otherSpots = ((spotsData.spots ?? []) as SpotDetailSpot[])
          .filter((spot) => spot.id !== spotId)
          .slice(0, 3)
          .map((spot) => ({
            ...spot,
            imagePosition: normalizeImagePosition(spot.image_position),
          }));
        setNearbySpots(otherSpots);
      }
    }

    loadCityContext();

    return () => {
      cancelled = true;
    };
  }, [cityId, spotId]);

  const previewSpot: SpotDetailSpot = {
    id: spotId || "preview",
    slug: slug || "preview",
    name: name || "スポット名未入力",
    summary,
    description,
    image_url: imageUrl,
    image_position: imagePosition,
    imagePosition,
    affiliate_hotel_url: affiliateHotelUrl,
    affiliate_tour_url: affiliateTourUrl,
  };

  return (
    <section className={layoutStyles.previewColumn}>
      <div className={layoutStyles.previewLabel}>スポットページ プレビュー（実コンポーネント）</div>

      <div className={layoutStyles.linkRow}>
        <code className={layoutStyles.code}>{publicPath || "公開URLは未設定です"}</code>
        {publicPath ? (
          <Link href={publicPath} target="_blank" rel="noreferrer" className={layoutStyles.smallButton}>
            公開ページを開く
          </Link>
        ) : null}
        <span className={isPublished ? layoutStyles.statusOk : layoutStyles.statusDraft}>
          {isPublished ? "公開" : "下書き"}
        </span>
      </div>

      {city ? (
        <AdminPreviewCanvas>
          <SpotDetailView city={city} spot={previewSpot} nearbySpots={nearbySpots} />
        </AdminPreviewCanvas>
      ) : (
        <div className={layoutStyles.code}>都市を選択するとプレビューが表示されます。</div>
      )}
    </section>
  );
}
