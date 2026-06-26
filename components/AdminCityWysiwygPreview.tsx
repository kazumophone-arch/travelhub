"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminPreviewCanvas } from "@/components/AdminPreviewCanvas";
import { CityDetailView, type CityDetailSpot } from "@/components/CityDetailView";
import layoutStyles from "@/components/AdminEditLayout.module.css";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import { normalizeImagePosition, type ImagePosition } from "@/lib/url-fields";

type Props = {
  cityId: string;
  title: string;
  slug: string;
  country: string;
  imageUrl: string;
  imagePosition: ImagePosition;
  affiliateHotelUrl: string;
  affiliateTourUrl: string;
  bestMonths: string[];
  seasonNote: string;
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

export function AdminCityWysiwygPreview({
  cityId,
  title,
  slug,
  country,
  imageUrl,
  imagePosition,
  affiliateHotelUrl,
  affiliateTourUrl,
  bestMonths,
  seasonNote,
  isPublished,
  publicPath,
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
    city: title || "都市名未入力",
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
    <section className={layoutStyles.previewColumn}>
      <div className={layoutStyles.previewLabel}>都市ページ プレビュー（実コンポーネント）</div>

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

      <AdminPreviewCanvas>
        <CityDetailView city={previewCity} spots={spots} />
      </AdminPreviewCanvas>
    </section>
  );
}
