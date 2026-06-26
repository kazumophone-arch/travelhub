"use client";

import { useEffect, useState } from "react";
import { SpotDetailView, type SpotDetailSpot } from "@/components/SpotDetailView";
import { EditableText } from "@/components/EditableText";
import { EditableImageButton } from "@/components/EditableImageButton";
import { EditableLinkButton } from "@/components/EditableLinkButton";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import { normalizeImagePosition, type ImagePosition } from "@/lib/url-fields";

type Props = {
  spotId: string;
  cityId: string;
  citySlug: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  imageUrl: string;
  imagePosition: ImagePosition;
  affiliateHotelUrl: string;
  affiliateTourUrl: string;
  onChangeName: (value: string) => void;
  onChangeSummary: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onChangeImageUrl: (value: string) => void;
  onChangeImagePosition: (value: ImagePosition) => void;
  onChangeAffiliateHotelUrl: (value: string) => void;
  onChangeAffiliateTourUrl: (value: string) => void;
};

async function readResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || "サーバー応答を読み取れませんでした。" };
  }
}

export function AdminSpotInlineEditor({
  spotId,
  cityId,
  citySlug,
  name,
  slug,
  summary,
  description,
  imageUrl,
  imagePosition,
  affiliateHotelUrl,
  affiliateTourUrl,
  onChangeName,
  onChangeSummary,
  onChangeDescription,
  onChangeImageUrl,
  onChangeImagePosition,
  onChangeAffiliateHotelUrl,
  onChangeAffiliateTourUrl,
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
        setNearbySpots(
          ((spotsData.spots ?? []) as SpotDetailSpot[])
            .filter((spot) => spot.id !== spotId)
            .slice(0, 3)
            .map((spot) => ({
              ...spot,
              imagePosition: normalizeImagePosition(spot.image_position),
            }))
        );
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

  if (!city) {
    return <div style={emptyStyle}>都市を選択するとページが表示されます。</div>;
  }

  return (
    <SpotDetailView
      city={city}
      spot={previewSpot}
      nearbySpots={nearbySpots}
      slots={{
        title: (
          <EditableText value={name} onChange={onChangeName} ariaLabel="スポット名" placeholder="スポット名" />
        ),
        lead: (
          <EditableText
            value={summary}
            onChange={onChangeSummary}
            multiline
            ariaLabel="概要（リード文）"
            placeholder="このスポットの概要"
          />
        ),
        why: (
          <EditableText
            value={description}
            onChange={onChangeDescription}
            multiline
            ariaLabel="説明（Why go）"
            placeholder="このスポットを訪れる理由"
          />
        ),
        heroOverlay: (
          <EditableImageButton
            url={imageUrl}
            position={imagePosition}
            onChangeUrl={onChangeImageUrl}
            onChangePosition={onChangeImagePosition}
            uploadKind="spot"
            citySlug={citySlug}
            spotSlug={slug}
          />
        ),
        planEditor: (
          <EditableLinkButton
            buttonLabel="🔗 このスポットのホテル・ツアーリンクを編集"
            fields={[
              {
                label: "ホテルアフィリエイトURL（スポット固有）",
                value: affiliateHotelUrl,
                onChange: onChangeAffiliateHotelUrl,
              },
              {
                label: "ツアーアフィリエイトURL（スポット固有）",
                value: affiliateTourUrl,
                onChange: onChangeAffiliateTourUrl,
              },
            ]}
          />
        ),
      }}
    />
  );
}

const emptyStyle = {
  padding: 18,
  borderRadius: 16,
  background: "#fffdf8",
  border: "1px solid rgba(168,116,50,.14)",
  color: "#607080",
  fontSize: 13,
} as const;
