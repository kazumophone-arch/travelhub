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
  image_source_url: string | null;
  affiliate_hotel_url: string | null;
  affiliate_tour_url: string | null;
  is_published: boolean;
  created_at: string;
};

type SupabaseCity = {
  id: string;
  slug: string;
  city: string;
  country: string;
};

type Filter =
  | "all"
  | "draft"
  | "published"
  | "missing-city"
  | "missing-image"
  | "missing-hotel"
  | "missing-tour"
  | "missing-both";

type BadgeTone = "ok" | "missing" | "neutral";

export function AdminSupabaseSpotList() {
  const [spots, setSpots] = useState<SupabaseSpot[]>([]);
  const [cities, setCities] = useState<SupabaseCity[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
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

  const citiesById = useMemo(() => {
    return new Map(cities.map((city) => [city.id, city]));
  }, [cities]);

  const filteredSpots = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);

    return spots.filter((spot) => {
      const city = spot.city_id ? citiesById.get(spot.city_id) : undefined;
      const hasCity = Boolean(spot.city_id && city);

      if (filter === "published" && !spot.is_published) return false;
      if (filter === "draft" && spot.is_published) return false;
      if (filter === "missing-city" && hasCity) return false;
      if (filter === "missing-image" && hasText(spot.image_url)) return false;
      if (filter === "missing-hotel" && hasText(spot.affiliate_hotel_url)) return false;
      if (filter === "missing-tour" && hasText(spot.affiliate_tour_url)) return false;
      if (filter === "missing-both" && !isUnmonetized(spot)) return false;
      if (!normalizedQuery) return true;

      return [spot.name, spot.slug, city?.city, city?.country]
        .some((value) => normalizeSearch(value).includes(normalizedQuery));
    });
  }, [citiesById, filter, query, spots]);

  const summaryItems = useMemo(() => {
    const publishedCount = spots.filter((spot) => spot.is_published).length;

    return [
      { label: "スポット数", value: spots.length },
      { label: "公開", value: publishedCount },
      { label: "下書き", value: spots.length - publishedCount },
      { label: "画像なし", value: spots.filter((spot) => !hasText(spot.image_url)).length },
      { label: "Hotel URLなし", value: spots.filter((spot) => !hasText(spot.affiliate_hotel_url)).length },
      { label: "Tour URLなし", value: spots.filter((spot) => !hasText(spot.affiliate_tour_url)).length },
      { label: "収益化なし", value: spots.filter(isUnmonetized).length },
    ];
  }, [spots]);

  function getCityLabel(spot: SupabaseSpot) {
    if (!spot.city_id) {
      return "city_id が未設定です";
    }

    const city = citiesById.get(spot.city_id);

    if (!city) {
      return "不明な都市ID";
    }

    return `${city.city}, ${city.country} (${city.slug})`;
  }

  function getCitySlug(spot: SupabaseSpot) {
    if (!spot.city_id) return "";

    const city = citiesById.get(spot.city_id);

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
      <div style={summaryGridStyle}>
        {summaryItems.map((item) => (
          <div key={item.label} style={summaryCardStyle}>
            <div style={summaryLabelStyle}>{item.label}</div>
            <div style={summaryValueStyle}>{item.value}</div>
          </div>
        ))}
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="スポット名・slug・都市名・国名で検索"
        style={searchInputStyle}
      />

      <div style={filterRowStyle}>
        {([
          "all",
          "published",
          "draft",
          "missing-city",
          "missing-image",
          "missing-hotel",
          "missing-tour",
          "missing-both",
        ] as const).map((value) => (
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
          const city = spot.city_id ? citiesById.get(spot.city_id) : undefined;
          const citySlug = getCitySlug(spot);
          const hasCity = Boolean(spot.city_id && city);

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

                <div style={badgeRowStyle}>
                  <Badge label={spot.is_published ? "公開" : "下書き"} tone={spot.is_published ? "ok" : "missing"} />
                  <Badge label={hasCity ? "都市紐づけあり" : "都市未紐づけ"} tone={hasCity ? "ok" : "missing"} />
                  <Badge label={hasText(spot.image_url) ? "画像あり" : "画像なし"} tone={hasText(spot.image_url) ? "ok" : "missing"} />
                  <Badge label={hasText(spot.image_source_url) ? "画像出典あり" : "画像出典なし"} tone={hasText(spot.image_source_url) ? "ok" : "missing"} />
                  <Badge label={hasText(spot.affiliate_hotel_url) ? "Hotel URLあり" : "Hotel URLなし"} tone={hasText(spot.affiliate_hotel_url) ? "ok" : "missing"} />
                  <Badge label={hasText(spot.affiliate_tour_url) ? "Tour URLあり" : "Tour URLなし"} tone={hasText(spot.affiliate_tour_url) ? "ok" : "missing"} />
                  {isUnmonetized(spot) && <Badge label="収益化なし" tone="missing" />}
                </div>
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
  if (filter === "missing-city") return "都市未紐づけ";
  if (filter === "missing-image") return "画像なし";
  if (filter === "missing-hotel") return "Hotel URLなし";
  if (filter === "missing-tour") return "Tour URLなし";
  if (filter === "missing-both") return "収益化なし";
  return "すべて";
}

function Badge({ label, tone }: { label: string; tone: BadgeTone }) {
  return <span style={getBadgeStyle(tone)}>{label}</span>;
}

function getBadgeStyle(tone: BadgeTone): CSSProperties {
  if (tone === "ok") return { ...badgeStyle, ...okBadgeStyle };
  if (tone === "missing") return { ...badgeStyle, ...missingBadgeStyle };
  return { ...badgeStyle, ...neutralBadgeStyle };
}

function hasText(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

function isUnmonetized(spot: SupabaseSpot) {
  return !hasText(spot.affiliate_hotel_url) && !hasText(spot.affiliate_tour_url);
}

function normalizeSearch(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

const wrapStyle: CSSProperties = {
  marginTop: 22,
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: 10,
  marginBottom: 16,
};

const summaryCardStyle: CSSProperties = {
  padding: "13px 14px",
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
  boxShadow: "0 6px 18px rgba(30,64,88,.04)",
};

const summaryLabelStyle: CSSProperties = {
  fontSize: 12,
  color: "#607080",
  fontWeight: 850,
};

const summaryValueStyle: CSSProperties = {
  marginTop: 4,
  fontSize: 24,
  color: "#17202a",
  fontWeight: 900,
};

const searchInputStyle: CSSProperties = {
  width: "100%",
  marginBottom: 12,
  padding: "12px 13px",
  borderRadius: 16,
  border: "1px solid rgba(23,32,42,.1)",
  background: "#ffffff",
  color: "#17202a",
  fontSize: 14,
  outline: "none",
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

const badgeRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
  marginTop: 12,
};

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 26,
  padding: "4px 9px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 850,
};

const okBadgeStyle: CSSProperties = {
  background: "#e8f7ef",
  color: "#126b43",
  border: "1px solid rgba(18,107,67,.14)",
};

const missingBadgeStyle: CSSProperties = {
  background: "#fff4df",
  color: "#9a5b12",
  border: "1px solid rgba(154,91,18,.16)",
};

const neutralBadgeStyle: CSSProperties = {
  background: "#f2f6f8",
  color: "#607080",
  border: "1px solid rgba(96,112,128,.14)",
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


