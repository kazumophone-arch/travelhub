"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";

type CityRow = {
  id: string;
  slug: string;
  city: string;
  country_id: string | null;
  country: string;
  region: string;
  summary: string;
  image_url: string;
  image_source_url: string | null;
  affiliate_hotel_url: string | null;
  affiliate_tour_url: string | null;
  is_published: boolean;
  sort_rank: number;
};

type SpotRow = {
  id: string;
  city_id: string | null;
};

type Filter =
  | "all"
  | "draft"
  | "published"
  | "missing-country"
  | "missing-image"
  | "missing-hotel"
  | "missing-tour"
  | "missing-both"
  | "zero-spots";

type BadgeTone = "ok" | "missing" | "neutral";

export function AdminSupabaseCityList() {
  const [cities, setCities] = useState<CityRow[]>([]);
  const [spots, setSpots] = useState<SpotRow[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("読み込み中...");

  useEffect(() => {
    async function loadCities() {
      const [citiesResponse, spotsResponse] = await Promise.all([
        fetch("/api/admin/cities"),
        fetch("/api/admin/spots"),
      ]);

      const citiesData = await citiesResponse.json();
      const spotsData = await spotsResponse.json();

      if (!citiesResponse.ok) {
        setStatus(citiesData.error ?? "都市の読み込みに失敗しました。");
        return;
      }

      if (!spotsResponse.ok) {
        setStatus(spotsData.error ?? "スポット数の読み込みに失敗しました。");
        return;
      }

      setCities(citiesData.cities ?? []);
      setSpots(spotsData.spots ?? []);
      setStatus("");
    }

    loadCities();
  }, []);

  const spotCountsByCityId = useMemo(() => {
    const counts = new Map<string, number>();

    for (const spot of spots) {
      if (!spot.city_id) continue;
      counts.set(spot.city_id, (counts.get(spot.city_id) ?? 0) + 1);
    }

    return counts;
  }, [spots]);

  const filteredCities = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);

    return cities.filter((city) => {
      const spotCount = spotCountsByCityId.get(city.id) ?? 0;

      if (filter === "published" && !city.is_published) return false;
      if (filter === "draft" && city.is_published) return false;
      if (filter === "missing-country" && hasText(city.country_id)) return false;
      if (filter === "missing-image" && hasText(city.image_url)) return false;
      if (filter === "missing-hotel" && hasText(city.affiliate_hotel_url)) return false;
      if (filter === "missing-tour" && hasText(city.affiliate_tour_url)) return false;
      if (filter === "missing-both" && !isUnmonetized(city)) return false;
      if (filter === "zero-spots" && spotCount > 0) return false;
      if (!normalizedQuery) return true;

      return [city.city, city.slug, city.country, city.region]
        .some((value) => normalizeSearch(value).includes(normalizedQuery));
    });
  }, [cities, filter, query, spotCountsByCityId]);

  const summaryItems = useMemo(() => {
    const publishedCount = cities.filter((city) => city.is_published).length;

    return [
      { label: "都市数", value: cities.length },
      { label: "公開", value: publishedCount },
      { label: "下書き", value: cities.length - publishedCount },
      { label: "国未紐づけ", value: cities.filter((city) => !hasText(city.country_id)).length },
      { label: "画像なし", value: cities.filter((city) => !hasText(city.image_url)).length },
      {
        label: "スポット0件",
        value: cities.filter((city) => (spotCountsByCityId.get(city.id) ?? 0) === 0).length,
      },
      { label: "収益化なし", value: cities.filter(isUnmonetized).length },
    ];
  }, [cities, spotCountsByCityId]);


  async function deleteCity(id: string) {
    const ok = window.confirm("この都市を Supabase から削除しますか？");
    if (!ok) return;

    const response = await fetch(`/api/admin/cities?id=${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error ?? "都市の削除に失敗しました。");
      return;
    }

    setCities((current) => current.filter((city) => city.id !== id));
    setStatus("");
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
        placeholder="都市名・slug・国名で検索"
        style={searchInputStyle}
      />

      <div style={filterRowStyle}>
        {([
          "all",
          "published",
          "draft",
          "missing-country",
          "missing-image",
          "missing-hotel",
          "missing-tour",
          "missing-both",
          "zero-spots",
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

      {!status && filteredCities.length === 0 && (
        <div style={emptyStyle}>都市が見つかりません。</div>
      )}

      <div style={listStyle}>
        {filteredCities.map((city) => {
          const spotCount = spotCountsByCityId.get(city.id) ?? 0;

          return (
            <div key={city.id} style={itemStyle}>
              <div>
                <div style={metaStyle}>
                  {city.country} · {city.is_published ? "公開" : "下書き"}
                </div>

                <h2 style={titleStyle}>{city.city}</h2>

                <p style={textStyle}>{city.summary || "概要はまだありません。"}</p>

                <code style={codeStyle}>/c/{city.slug}</code>

                <div style={badgeRowStyle}>
                  <Badge label={city.is_published ? "公開" : "下書き"} tone={city.is_published ? "ok" : "missing"} />
                  <Badge label={hasText(city.country_id) ? "国紐づけあり" : "国未紐づけ"} tone={hasText(city.country_id) ? "ok" : "missing"} />
                  <Badge label={hasText(city.image_url) ? "画像あり" : "画像なし"} tone={hasText(city.image_url) ? "ok" : "missing"} />
                  <Badge label={hasText(city.image_source_url) ? "画像出典あり" : "画像出典なし"} tone={hasText(city.image_source_url) ? "ok" : "missing"} />
                  <Badge label={hasText(city.affiliate_hotel_url) ? "Hotel URLあり" : "Hotel URLなし"} tone={hasText(city.affiliate_hotel_url) ? "ok" : "missing"} />
                  <Badge label={hasText(city.affiliate_tour_url) ? "Tour URLあり" : "Tour URLなし"} tone={hasText(city.affiliate_tour_url) ? "ok" : "missing"} />
                  <Badge label={spotCount > 0 ? `スポット数: ${spotCount}` : "スポット0件"} tone={spotCount > 0 ? "ok" : "missing"} />
                  {isUnmonetized(city) && <Badge label="収益化なし" tone="missing" />}
                </div>
              </div>

              <div style={buttonRowStyle}>
                <Link href={`/admin/cities/edit/${city.id}`} style={buttonStyle}>
                  編集
                </Link>

                <Link href={`/c/${city.slug}`} style={buttonStyle}>
                  表示
                </Link>

                <button
                  type="button"
                  onClick={() => deleteCity(city.id)}
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
  if (filter === "missing-country") return "国未紐づけ";
  if (filter === "missing-image") return "画像なし";
  if (filter === "missing-hotel") return "Hotel URLなし";
  if (filter === "missing-tour") return "Tour URLなし";
  if (filter === "missing-both") return "収益化なし";
  if (filter === "zero-spots") return "スポット0件";
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

function isUnmonetized(city: CityRow) {
  return !hasText(city.affiliate_hotel_url) && !hasText(city.affiliate_tour_url);
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

const emptyStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: "#fffdf8",
  border: "1px solid rgba(168,116,50,.14)",
  color: "#607080",
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
