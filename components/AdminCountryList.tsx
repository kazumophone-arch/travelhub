"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

type CountryRow = {
  id: string;
  name: string;
  slug: string;
  iso_code: string | null;
  region: string | null;
  is_published: boolean;
  sort_rank: number | null;
};

type Filter = "all" | "draft" | "published";

export function AdminCountryList() {
  const [countries, setCountries] = useState<CountryRow[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
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
    if (filter === "published") {
      return countries.filter((country) => country.is_published);
    }

    if (filter === "draft") {
      return countries.filter((country) => !country.is_published);
    }

    return countries;
  }, [countries, filter]);

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
