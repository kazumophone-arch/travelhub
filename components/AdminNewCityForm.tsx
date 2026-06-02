"use client";

import { useState, type CSSProperties } from "react";
import { AdminLivePreview, hasPreviewUrl } from "@/components/AdminLivePreview";
import {
  formatValidationErrors,
  slugify,
  validateCityFields,
  validateSlug,
} from "@/lib/admin-validation";

type CityForm = {
  city: string;
  slug: string;
  country: string;
  region: string;
  summary: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageCredit: string;
  imageSourceUrl: string;
  affiliateHotelUrl: string;
  affiliateTourUrl: string;
  isPublished: boolean;
  sortRank: number;
};

type StatusKind = "info" | "success" | "error";

const initialForm: CityForm = {
  city: "",
  slug: "",
  country: "",
  region: "",
  summary: "",
  description: "",
  imageUrl: "",
  imageAlt: "",
  imageCredit: "",
  imageSourceUrl: "",
  affiliateHotelUrl: "",
  affiliateTourUrl: "",
  isPublished: false,
  sortRank: 999,
};

async function readResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || "サーバー応答を読み取れませんでした。" };
  }
}

export function AdminNewCityForm() {
  const [form, setForm] = useState<CityForm>(initialForm);
  const [status, setStatus] = useState("");
  const [statusKind, setStatusKind] = useState<StatusKind>("info");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  function setStatusMessage(message: string, kind: StatusKind = "info") {
    setStatus(message);
    setStatusKind(kind);
  }

  function update<K extends keyof CityForm>(key: K, value: CityForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "city" && !current.slug
        ? { slug: slugify(String(value)) }
        : {}),
    }));
  }

  async function createCity() {
    const validationErrors = validateCityFields(form);

    if (validationErrors.length > 0) {
      setStatusMessage(formatValidationErrors(validationErrors), "error");
      return;
    }

    setStatusMessage("都市を作成しています...");

    const response = await fetch("/api/admin/cities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await readResponse(response);

    if (!response.ok) {
      setStatusMessage(data.error ?? "都市の作成に失敗しました。", "error");
      return;
    }

    setStatusMessage("都市を作成しました。", "success");
  }

  async function uploadCityImage() {
    const slugError = validateSlug(form.slug, "都市スラッグ");

    if (slugError) {
      setStatusMessage(slugError, "error");
      return;
    }

    if (!imageFile) {
      setStatusMessage("アップロードする画像ファイルを選択してください。", "error");
      return;
    }

    setIsUploadingImage(true);
    setStatusMessage("画像をアップロードしています...");

    const uploadForm = new FormData();
    uploadForm.append("file", imageFile);
    uploadForm.append("kind", "city");
    uploadForm.append("citySlug", form.slug);

    try {
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: uploadForm,
      });

      const data = await readResponse(response);

      if (!response.ok || typeof data.publicUrl !== "string") {
        setStatusMessage(data.error ?? "画像のアップロードに失敗しました。", "error");
        return;
      }

      update("imageUrl", data.publicUrl);
      setStatusMessage(
        "画像をアップロードしました。画像URL欄を更新しました。",
        "success"
      );
    } catch {
      setStatusMessage("画像のアップロードに失敗しました。", "error");
    } finally {
      setIsUploadingImage(false);
    }
  }

  return (
    <div style={wrapStyle}>
      <section style={formStyle}>
        <label style={labelStyle}>
          都市名
          <input
            value={form.city}
            onChange={(event) => update("city", event.target.value)}
            placeholder="Rome"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          スラッグ
          <input
            value={form.slug}
            onChange={(event) => update("slug", slugify(event.target.value))}
            placeholder="rome-it"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          国
          <input
            value={form.country}
            onChange={(event) => update("country", event.target.value)}
            placeholder="Italy"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          地域
          <input
            value={form.region}
            onChange={(event) => update("region", event.target.value)}
            placeholder="Europe"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          概要
          <textarea
            value={form.summary}
            onChange={(event) => update("summary", event.target.value)}
            rows={4}
            style={textareaStyle}
          />
        </label>

        <label style={labelStyle}>
          説明
          <textarea
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            rows={5}
            style={textareaStyle}
          />
        </label>

        <label style={labelStyle}>
          画像URL（https）
          <input
            value={form.imageUrl}
            onChange={(event) => update("imageUrl", event.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </label>

        <div style={uploadWrapStyle}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            style={inputStyle}
          />

          <button
            type="button"
            onClick={uploadCityImage}
            style={buttonStyle}
            disabled={isUploadingImage}
          >
            画像をアップロード
          </button>
        </div>

        <label style={labelStyle}>
          画像代替テキスト
          <input
            value={form.imageAlt}
            onChange={(event) => update("imageAlt", event.target.value)}
            placeholder="Rome city view"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          画像クレジット
          <input
            value={form.imageCredit}
            onChange={(event) => update("imageCredit", event.target.value)}
            placeholder="Unsplash / Pexels / Wikimedia"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          画像出典URL（https）
          <input
            value={form.imageSourceUrl}
            onChange={(event) => update("imageSourceUrl", event.target.value)}
            placeholder="https://source.example/photo"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          表示順
          <input
            type="number"
            value={form.sortRank}
            onChange={(event) => update("sortRank", Number(event.target.value))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          ホテルアフィリエイトURL（https）
          <input
            value={form.affiliateHotelUrl}
            onChange={(event) => update("affiliateHotelUrl", event.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          ツアーアフィリエイトURL（https）
          <input
            value={form.affiliateTourUrl}
            onChange={(event) => update("affiliateTourUrl", event.target.value)}
            placeholder="https://..."
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

        <button type="button" onClick={createCity} style={buttonStyle}>
          都市を作成
        </button>

        {status && (
          <p style={statusKind === "error" ? errorStatusStyle : statusKind === "success" ? successStatusStyle : statusStyle}>
            {status}
          </p>
        )}
      </section>

      <AdminLivePreview
        label="ライブプレビュー"
        title={form.city || "新しい都市"}
        subtitle={form.country || "国"}
        description={form.description || form.summary}
        imageUrl={form.imageUrl}
        isPublished={form.isPublished}
        publicPath={form.slug ? `/c/${form.slug}` : ""}
        ctas={[
          {
            label: "ホテル",
            href: `/out/hotels?c=${encodeURIComponent(form.slug)}&src=admin-preview&v=city_preview`,
            isVisible: Boolean(form.slug) && hasPreviewUrl(form.affiliateHotelUrl),
          },
          {
            label: "ツアー",
            href: `/out/tours?c=${encodeURIComponent(form.slug)}&src=admin-preview&v=city_preview`,
            isVisible: Boolean(form.slug) && hasPreviewUrl(form.affiliateTourUrl),
          },
        ]}
      />
    </div>
  );
}

const wrapStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
  gap: 18,
  alignItems: "start",
};

const formStyle: CSSProperties = {
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

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  lineHeight: 1.55,
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

const uploadWrapStyle: CSSProperties = {
  display: "grid",
  gap: 9,
  marginBottom: 14,
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

const previewStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const previewLabelStyle: CSSProperties = {
  fontSize: 12,
  color: "#9a6a2f",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".12em",
};

const cardStyle: CSSProperties = {
  minHeight: 430,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 26,
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#ffffff",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,.84)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
};

const panelStyle: CSSProperties = {
  margin: 12,
  padding: 16,
  borderRadius: 20,
  background: "rgba(12,22,30,.54)",
  border: "1px solid rgba(255,255,255,.24)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const metaStyle: CSSProperties = {
  marginBottom: 7,
  fontSize: 12,
  color: "rgba(255,255,255,.76)",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".1em",
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 28,
  lineHeight: 1.04,
  letterSpacing: "-.045em",
};

const cardTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "rgba(255,255,255,.84)",
};
