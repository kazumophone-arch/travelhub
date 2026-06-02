"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

type SupabaseSpot = {
  id: string;
  city_id: string | null;
  name: string;
  slug: string;
  summary: string;
  image_url: string;
  is_published: boolean;
  created_at: string;
};

type SupabaseCity = {
  id: string;
  slug: string;
  city: string;
  country: string;
};

type Filter = "all" | "draft" | "published";

export function AdminSupabaseSpotList() {
  const [spots, setSpots] = useState<SupabaseSpot[]>([]);
  const [cities, setCities] = useState<SupabaseCity[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [status, setStatus] = useState("読み込み中...");

  useEffect(() => {
    async function loadData() {
      const [spotsResponse, citiesResponse] = await Promise.all([
        fetch("/api/admin/spots"),
        fetch("/api/admin/cities"),
      ]);

      const spotsData = await spotsResponse.json();
      const citiesData = await citiesResponse.json();

      if (!spotsResponse.ok) {
        setStatus(spotsData.error ?? "スポットの読み込みに失敗しました。");
        return;
      }

      setSpots(spotsData.spots ?? []);
      setCities(citiesData.cities ?? []);
      setStatus("");
    }

    loadData();
  }, []);

  const filteredSpots = useMemo(() => {
    if (filter === "published") {
      return spots.filter((spot) => spot.is_published);
    }

    if (filter === "draft") {
      return spots.filter((spot) => !spot.is_published);
    }

    return spots;
  }, [spots, filter]);

  function getCityLabel(spot: SupabaseSpot) {
    if (!spot.city_id) {
      return "city_id が未設定です";
    }

    const city = cities.find((item) => item.id === spot.city_id);

    if (!city) {
      return "不明な都市ID";
    }

    return `${city.city}, ${city.country} (${city.slug})`;
  }

  function getCitySlug(spot: SupabaseSpot) {
    if (!spot.city_id) return "";

    const city = cities.find((item) => item.id === spot.city_id);

    return city?.slug ?? "";
  }

  async function deleteSpot(id: string) {
    const ok = window.confirm("このスポットを Supabase から削除しますか？");
    if (!ok) return;

    const response = await fetch(`/api/admin/spots?id=${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error ?? "スポットの削除に失敗しました。");
      return;
    }

    setSpots((current) => current.filter((spot) => spot.id !== id));
  }

  return (
    <section style={wrapStyle}>
      <div style={filterRowStyle}>
        {(["all", "draft", "published"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            style={filter === value ? activeFilterStyle : filterStyle}
          >
            {getFilterLabel(value)}
          </button>
        ))}
      </div>

      {status && <div style={emptyStyle}>{status}</div>}

      {!status && filteredSpots.length === 0 && (
        <div style={emptyStyle}>スポットが見つかりません。</div>
      )}

      <div style={listStyle}>
        {filteredSpots.map((spot) => {
          const citySlug = getCitySlug(spot);

          return (
            <div key={spot.id} style={itemStyle}>
              <div>
                <div style={metaStyle}>
                  {getCityLabel(spot)} · {spot.is_published ? "公開" : "下書き"}
                </div>

                <h2 style={titleStyle}>{spot.name}</h2>

                <p style={textStyle}>{spot.summary || "概要はまだありません。"}</p>

                <code style={codeStyle}>
                  {citySlug ? `/c/${citySlug}/spot/${spot.slug}` : "公開URLはまだありません"}
                </code>
              </div>

              <div style={buttonRowStyle}>
                <Link href={`/admin/spots/edit/${spot.id}`} style={buttonStyle}>
                  編集
                </Link>

                {citySlug ? (
                  <Link href={`/c/${citySlug}/spot/${spot.slug}`} style={buttonStyle}>
                    表示
                  </Link>
                ) : null}

                <button
                  type="button"
                  onClick={() => deleteSpot(spot.id)}
                  style={deleteButtonStyle}
                >
                  削除
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function getFilterLabel(filter: Filter) {
  if (filter === "published") return "公開";
  if (filter === "draft") return "下書き";
  return "すべて";
}

const wrapStyle: CSSProperties = {
  marginTop: 22,
};

const filterRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 16,
};

const filterStyle: CSSProperties = {
  padding: "9px 12px",
  borderRadius: 999,
  border: "1px solid rgba(23,32,42,.08)",
  background: "#ffffff",
  color: "#607080",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
  textTransform: "capitalize",
};

const activeFilterStyle: CSSProperties = {
  ...filterStyle,
  background: "#f7efe2",
  border: "1px solid rgba(168,116,50,.18)",
  color: "#9a6a2f",
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: 14,
};

const itemStyle: CSSProperties = {
  display: "grid",
  gap: 14,
  padding: 18,
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
  boxShadow: "0 8px 24px rgba(30,64,88,.05)",
};

const metaStyle: CSSProperties = {
  marginBottom: 8,
  fontSize: 12,
  color: "#9a6a2f",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".1em",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  letterSpacing: "-.04em",
};

const textStyle: CSSProperties = {
  margin: "8px 0 10px",
  fontSize: 14,
  lineHeight: 1.6,
  color: "#607080",
};

const codeStyle: CSSProperties = {
  display: "block",
  fontSize: 13,
  color: "#17202a",
  overflowWrap: "anywhere",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const buttonStyle: CSSProperties = {
  width: "fit-content",
  padding: "9px 12px",
  borderRadius: 999,
  background: "#138a72",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
};

const deleteButtonStyle: CSSProperties = {
  width: "fit-content",
  padding: "9px 12px",
  borderRadius: 999,
  background: "#ffffff",
  color: "#9a3d2f",
  border: "1px solid rgba(154,61,47,.18)",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
};

const emptyStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: "#fffdf8",
  border: "1px solid rgba(168,116,50,.14)",
  color: "#607080",
};


