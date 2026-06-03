"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

type CountryRow = {
  id: string;
  name: string;
  slug: string;
  iso_code: string | null;
  region: string | null;
  image_url: string | null;
  image_source_url: string | null;
  is_published: boolean;
  sort_rank: number | null;
};

type Filter = "all" | "draft" | "published" | "missing-image";

type BadgeTone = "ok" | "missing" | "neutral";

export function AdminCountryList() {
  const [countries, setCountries] = useState<CountryRow[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("読み込み中...");

  useEffect(() => {
    async function loadCountries() {
      const response = await fetch("/api/admin/countries");
      const data = await response.json();

      if (!response.ok) {
        setStatus(data.error ?? "国の読み込みに失敗しました。");
        return;
      }

      setCountries(data.countries ?? []);
      setStatus("");
    }

    loadCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);

    return countries.filter((country) => {
      if (filter === "published" && !country.is_published) return false;
      if (filter === "draft" && country.is_published) return false;
      if (filter === "missing-image" && hasText(country.image_url)) return false;
      if (!normalizedQuery) return true;

      return [country.name, country.slug, country.region, country.iso_code]
        .some((value) => normalizeSearch(value).includes(normalizedQuery));
    });
  }, [countries, filter, query]);

  const summaryItems = useMemo(() => {
    const publishedCount = countries.filter((country) => country.is_published).length;
    const missingImageCount = countries.filter((country) => !hasText(country.image_url)).length;

    return [
      { label: "国数", value: countries.length },
      { label: "公開", value: publishedCount },
      { label: "下書き", value: countries.length - publishedCount },
      { label: "画像なし", value: missingImageCount },
    ];
  }, [countries]);

  async function deleteCountry(id: string) {
    const ok = window.confirm("この国を削除しますか？都市の country_id は未設定に戻ります。");
    if (!ok) return;

    const response = await fetch(`/api/admin/countries?id=${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error ?? "国の削除に失敗しました。");
      return;
    }

    setCountries((current) => current.filter((country) => country.id !== id));
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
        placeholder="国名・slug・地域・ISOで検索"
        style={searchInputStyle}
      />

      <div style={filterRowStyle}>
        {(["all", "published", "draft", "missing-image"] as const).map((value) => (
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

      {!status && filteredCountries.length === 0 && (
        <div style={emptyStyle}>国が見つかりません。</div>
      )}

      <div style={listStyle}>
        {filteredCountries.map((country) => (
          <div key={country.id} style={itemStyle}>
            <div>
              <div style={metaStyle}>
                {[country.region, country.iso_code, country.is_published ? "公開" : "下書き"]
                  .filter(Boolean)
                  .join(" · ")}
              </div>

              <h2 style={titleStyle}>{country.name}</h2>

              <code style={codeStyle}>/{country.slug}</code>

              <div style={badgeRowStyle}>
                <Badge label={country.is_published ? "公開" : "下書き"} tone={country.is_published ? "ok" : "missing"} />
                <Badge label={hasText(country.image_url) ? "画像あり" : "画像なし"} tone={hasText(country.image_url) ? "ok" : "missing"} />
                <Badge label={hasText(country.image_source_url) ? "画像出典あり" : "画像出典なし"} tone={hasText(country.image_source_url) ? "ok" : "missing"} />
                <Badge label={hasText(country.region) ? "地域あり" : "地域なし"} tone={hasText(country.region) ? "ok" : "missing"} />
                <Badge label={hasText(country.iso_code) ? "ISOあり" : "ISOなし"} tone={hasText(country.iso_code) ? "ok" : "missing"} />
              </div>
            </div>

            <div style={buttonRowStyle}>
              <Link href={`/admin/countries/edit/${country.id}`} style={buttonStyle}>
                編集
              </Link>

              <button
                type="button"
                onClick={() => deleteCountry(country.id)}
                style={deleteButtonStyle}
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function getFilterLabel(filter: Filter) {
  if (filter === "published") return "公開";
  if (filter === "draft") return "下書き";
  if (filter === "missing-image") return "画像なし";
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

const codeStyle: CSSProperties = {
  display: "block",
  marginTop: 10,
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
