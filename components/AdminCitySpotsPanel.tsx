"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

type SpotRow = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  image_url: string;
  is_published: boolean;
};

type Props = {
  cityId: string;
  citySlug: string;
};

function hasText(value: string) {
  return value.trim().length > 0;
}

export function AdminCitySpotsPanel({ cityId, citySlug }: Props) {
  const [spots, setSpots] = useState<SpotRow[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSpots() {
      if (!cityId) {
        setSpots([]);
        setStatus("都市を保存すると、ここにスポット一覧が表示されます。");
        return;
      }

      setStatus("読み込み中...");
      const response = await fetch(`/api/admin/spots?cityId=${encodeURIComponent(cityId)}`);
      const data = await response.json();

      if (cancelled) return;

      if (!response.ok) {
        setStatus(data.error ?? "スポットの読み込みに失敗しました。");
        return;
      }

      setSpots(data.spots ?? []);
      setStatus("");
    }

    loadSpots();

    return () => {
      cancelled = true;
    };
  }, [cityId]);

  return (
    <div style={wrapStyle}>
      {status ? <div style={emptyStyle}>{status}</div> : null}

      {!status && spots.length === 0 ? (
        <div style={emptyStyle}>このスポットにはまだスポットがありません。</div>
      ) : null}

      <div style={listStyle}>
        {spots.map((spot) => (
          <div key={spot.id} style={itemStyle}>
            <div style={itemBodyStyle}>
              <div style={itemTitleRowStyle}>
                <strong>{spot.name}</strong>
                <span style={spot.is_published ? badgeOkStyle : badgeDraftStyle}>
                  {spot.is_published ? "公開" : "下書き"}
                </span>
              </div>
              <p style={itemSummaryStyle}>{spot.summary || "概要はまだありません。"}</p>
              <div style={itemMetaRowStyle}>
                <span style={hasText(spot.image_url) ? metaOkStyle : metaMissingStyle}>
                  {hasText(spot.image_url) ? "画像あり" : "画像なし"}
                </span>
                {citySlug ? (
                  <code style={codeStyle}>{`/c/${citySlug}/spot/${spot.slug}`}</code>
                ) : null}
              </div>
            </div>

            <Link href={`/admin/spots/edit/${spot.id}`} style={editButtonStyle}>
              編集 →
            </Link>
          </div>
        ))}
      </div>

      {cityId ? (
        <Link href={`/admin/spots/new?cityId=${encodeURIComponent(cityId)}`} style={addButtonStyle}>
          + この都市にスポットを追加
        </Link>
      ) : null}
    </div>
  );
}

const wrapStyle: CSSProperties = {
  display: "grid",
  gap: 12,
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const itemStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  padding: 14,
  borderRadius: 16,
  background: "#f8faf7",
  border: "1px solid rgba(23,32,42,.08)",
};

const itemBodyStyle: CSSProperties = {
  minWidth: 0,
};

const itemTitleRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
  color: "#17202a",
};

const itemSummaryStyle: CSSProperties = {
  margin: "6px 0 0",
  fontSize: 12,
  lineHeight: 1.55,
  color: "#607080",
};

const itemMetaRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 8,
  marginTop: 8,
};

const codeStyle: CSSProperties = {
  fontSize: 11,
  color: "#607080",
  overflowWrap: "anywhere",
};

const badgeOkStyle: CSSProperties = {
  padding: "3px 8px",
  borderRadius: 999,
  background: "#e8f7ef",
  color: "#126b43",
  fontSize: 11,
  fontWeight: 850,
};

const badgeDraftStyle: CSSProperties = {
  padding: "3px 8px",
  borderRadius: 999,
  background: "#f3f5f4",
  color: "#7a8795",
  fontSize: 11,
  fontWeight: 850,
};

const metaOkStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 850,
  color: "#126b43",
};

const metaMissingStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 850,
  color: "#9a5b12",
};

const editButtonStyle: CSSProperties = {
  flexShrink: 0,
  padding: "8px 12px",
  borderRadius: 999,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
  color: "#138a72",
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 850,
};

const addButtonStyle: CSSProperties = {
  width: "fit-content",
  padding: "10px 14px",
  borderRadius: 999,
  background: "#138a72",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
};

const emptyStyle: CSSProperties = {
  padding: 14,
  borderRadius: 16,
  background: "#fffdf8",
  border: "1px solid rgba(168,116,50,.14)",
  color: "#607080",
  fontSize: 13,
};
