"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import {
  AdminFieldHint,
  AdminInlineButton,
  AdminUrlTestLink,
} from "@/components/AdminContentTools";
import {
  formatValidationErrors,
  slugify,
  validateCountryFields,
} from "@/lib/admin-validation";

type Props = {
  id?: string;
};

type CountryForm = {
  id: string;
  name: string;
  slug: string;
  isoCode: string;
  region: string;
  imageUrl: string;
  imageSourceUrl: string;
  isPublished: boolean;
  sortRank: string;
};

type CountryApiRow = Record<string, unknown>;
type StatusKind = "info" | "success" | "error";

const emptyForm: CountryForm = {
  id: "",
  name: "",
  slug: "",
  isoCode: "",
  region: "",
  imageUrl: "",
  imageSourceUrl: "",
  isPublished: true,
  sortRank: "",
};

async function readResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || "サーバー応答を読み取れませんでした。" };
  }
}

export function AdminCountryForm({ id }: Props) {
  const isEditing = Boolean(id);
  const [form, setForm] = useState<CountryForm>(emptyForm);
  const [status, setStatus] = useState(isEditing ? "読み込み中..." : "");
  const [statusKind, setStatusKind] = useState<StatusKind>("info");

  function setStatusMessage(message: string, kind: StatusKind = "info") {
    setStatus(message);
    setStatusKind(kind);
  }

  useEffect(() => {
    if (!id) return;

    async function loadCountry() {
      setStatusMessage("読み込み中...");

      const response = await fetch(`/api/admin/countries?id=${id}`);
      const data = await readResponse(response);

      if (!response.ok) {
        setStatusMessage(data.error ?? "国の読み込みに失敗しました。", "error");
        return;
      }

      const country = data.country as CountryApiRow | null;

      if (!country) {
        setStatusMessage("国が見つかりません。", "error");
        return;
      }

      setForm({
        id: String(country.id ?? ""),
        name: String(country.name ?? ""),
        slug: String(country.slug ?? ""),
        isoCode: String(country.iso_code ?? ""),
        region: String(country.region ?? ""),
        imageUrl: String(country.image_url ?? ""),
        imageSourceUrl: String(country.image_source_url ?? ""),
        isPublished: Boolean(country.is_published),
        sortRank:
          country.sort_rank === null || country.sort_rank === undefined
            ? ""
            : String(country.sort_rank),
      });

      setStatusMessage("");
    }

    loadCountry();
  }, [id]);

  function update<K extends keyof CountryForm>(key: K, value: CountryForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "name" && !current.slug
        ? { slug: slugify(String(value)) }
        : {}),
    }));
  }

  function generateSlugFromName() {
    update("slug", slugify(form.name));
  }

  async function saveCountry() {
    const validationErrors = validateCountryFields(form);

    if (validationErrors.length > 0) {
      setStatusMessage(formatValidationErrors(validationErrors), "error");
      return;
    }

    setStatusMessage(isEditing ? "保存しています..." : "国を作成しています...");

    const response = await fetch("/api/admin/countries", {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await readResponse(response);

    if (!response.ok) {
      setStatusMessage(data.error ?? "国の保存に失敗しました。", "error");
      return;
    }

    if (!isEditing && data.country?.id) {
      setForm((current) => ({
        ...current,
        id: String(data.country.id),
      }));
    }

    setStatusMessage(isEditing ? "国を保存しました。" : "国を作成しました。", "success");
  }

  if (status === "読み込み中...") {
    return <div style={emptyStyle}>読み込み中...</div>;
  }

  return (
    <section style={formStyle}>
      <label style={labelStyle}>
        国名
        <input
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          placeholder="Japan"
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        スラッグ
        <input
          value={form.slug}
          onChange={(event) => update("slug", slugify(event.target.value))}
          placeholder="japan"
          style={inputStyle}
        />
        <AdminInlineButton onClick={generateSlugFromName}>
          国名から生成
        </AdminInlineButton>
      </label>
      <AdminFieldHint>
        英小文字・数字・ハイフンのみ。例: United States → united-states
      </AdminFieldHint>

      <label style={labelStyle}>
        ISOコード
        <input
          value={form.isoCode}
          onChange={(event) => update("isoCode", event.target.value)}
          placeholder="JP"
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        地域
        <input
          value={form.region}
          onChange={(event) => update("region", event.target.value)}
          placeholder="Asia"
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        画像URL
        <input
          value={form.imageUrl}
          onChange={(event) => update("imageUrl", event.target.value)}
          placeholder="https://..."
          style={inputStyle}
        />
      </label>
      <AdminUrlTestLink url={form.imageUrl} />

      <label style={labelStyle}>
        画像出典URL
        <input
          value={form.imageSourceUrl}
          onChange={(event) => update("imageSourceUrl", event.target.value)}
          placeholder="https://source.example/photo"
          style={inputStyle}
        />
      </label>
      <AdminUrlTestLink url={form.imageSourceUrl} />

      <label style={labelStyle}>
        表示順
        <input
          value={form.sortRank}
          onChange={(event) => update("sortRank", event.target.value)}
          inputMode="numeric"
          style={inputStyle}
        />
      </label>

      <label style={checkStyle}>
        <input
          type="checkbox"
          checked={form.isPublished}
          onChange={(event) => update("isPublished", event.target.checked)}
        />
        公開
      </label>

      <div style={buttonRowStyle}>
        <button type="button" onClick={saveCountry} style={buttonStyle}>
          {isEditing ? "保存" : "国を作成"}
        </button>

        <Link href="/admin/countries" style={secondaryButtonStyle}>
          戻る
        </Link>
      </div>

      {status && (
        <p
          style={
            statusKind === "error"
              ? errorStatusStyle
              : statusKind === "success"
                ? successStatusStyle
                : statusStyle
          }
        >
          {status}
        </p>
      )}
    </section>
  );
}

const formStyle: CSSProperties = {
  maxWidth: 720,
  padding: 18,
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 7,
  marginBottom: 14,
  fontSize: 12,
  color: "#607080",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".08em",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 13px",
  borderRadius: 16,
  border: "1px solid rgba(23,32,42,.08)",
  background: "#f8faf7",
  color: "#17202a",
  fontSize: 14,
};

const checkStyle: CSSProperties = {
  display: "flex",
  gap: 9,
  alignItems: "center",
  marginBottom: 16,
  color: "#607080",
  fontSize: 13,
  fontWeight: 750,
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: 9,
  flexWrap: "wrap",
};

const buttonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 999,
  border: 0,
  background: "#138a72",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
};

const secondaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "#ffffff",
  color: "#607080",
  border: "1px solid rgba(23,32,42,.08)",
  textDecoration: "none",
};

const statusStyle: CSSProperties = {
  marginTop: 12,
  color: "#138a72",
  fontSize: 13,
  fontWeight: 850,
};

const successStatusStyle: CSSProperties = statusStyle;

const errorStatusStyle: CSSProperties = {
  ...statusStyle,
  color: "#9a3d2f",
};

const emptyStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: "#fffdf8",
  color: "#607080",
};
