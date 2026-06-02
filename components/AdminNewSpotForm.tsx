"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  AdminContentGuidance,
  AdminFieldHint,
  AdminInlineButton,
  AdminUrlTestLink,
  buildSpotDescription,
} from "@/components/AdminContentTools";
import { AdminLivePreview, hasPreviewUrl } from "@/components/AdminLivePreview";
import {
  formatValidationErrors,
  slugify,
  validateSlug,
  validateSpotFields,
} from "@/lib/admin-validation";

type CityOption = {
  id: string;
  slug: string;
  city: string;
  country: string;
  is_published: boolean;
};

type SpotForm = {
  cityId: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageCredit: string;
  imageSourceUrl: string;
  affiliateHotelUrl: string;
  affiliateTourUrl: string;
  isPublished: boolean;
};

type StatusKind = "info" | "success" | "error";

const initialForm: SpotForm = {
  cityId: "",
  name: "",
  slug: "",
  summary: "",
  description: "",
  imageUrl: "",
  imageAlt: "",
  imageCredit: "",
  imageSourceUrl: "",
  affiliateHotelUrl: "",
  affiliateTourUrl: "",
  isPublished: false,
};

async function readResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || "サーバー応答を読み取れませんでした。" };
  }
}

export function AdminNewSpotForm() {
  const [cities, setCities] = useState<CityOption[]>([]);
  const [form, setForm] = useState<SpotForm>(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [status, setStatus] = useState("都市を読み込み中...");
  const [statusKind, setStatusKind] = useState<StatusKind>("info");
  const selectedCity = cities.find((city) => city.id === form.cityId);
  const selectedCitySlug = selectedCity?.slug ?? "";

  function setStatusMessage(message: string, kind: StatusKind = "info") {
    setStatus(message);
    setStatusKind(kind);
  }

  useEffect(() => {
    async function loadCities() {
      const response = await fetch("/api/admin/cities");
      const data = await response.json();

      if (!response.ok) {
        setStatusMessage(data.error ?? "都市の読み込みに失敗しました。", "error");
        return;
      }

      const nextCities = data.cities ?? [];
      setCities(nextCities);

      setForm((current) => ({
        ...current,
        cityId: current.cityId || nextCities[0]?.id || "",
      }));

      setStatusMessage("");
    }

    loadCities();
  }, []);

  function updateCity(cityId: string) {
    setForm((current) => ({
      ...current,
      cityId,
    }));
  }

  function update<K extends keyof SpotForm>(key: K, value: SpotForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "name" && !current.slug
        ? { slug: slugify(String(value)) }
        : {}),
    }));
  }

  function generateSlugFromSpot() {
    update("slug", slugify(form.name));
  }

  function insertDescriptionTemplate() {
    if (
      form.description &&
      !window.confirm("現在の説明文をテンプレートで上書きしますか？")
    ) {
      return;
    }

    update(
      "description",
      buildSpotDescription(
        form.name,
        selectedCity?.city ?? "",
        selectedCity?.country ?? ""
      )
    );
  }

  async function createInSupabase() {
    const validationErrors = validateSpotFields(form);

    if (validationErrors.length > 0) {
      setStatusMessage(formatValidationErrors(validationErrors), "error");
      return;
    }

    setStatusMessage("スポットを作成しています...");

    const response = await fetch("/api/admin/spots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await readResponse(response);

    if (!response.ok) {
      setStatusMessage(data.error ?? "スポットの作成に失敗しました。", "error");
      return;
    }

    setStatusMessage("スポットを作成しました。", "success");
  }

  async function uploadSpotImage() {
    if (!selectedCitySlug) {
      setStatusMessage("画像をアップロードする前に都市を選択してください。", "error");
      return;
    }

    const slugError = validateSlug(form.slug, "スポットスラッグ");

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
    uploadForm.append("kind", "spot");
    uploadForm.append("citySlug", selectedCitySlug);
    uploadForm.append("spotSlug", form.slug);

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
        <AdminContentGuidance kind="spot" />

        {cities.length === 0 && !status ? (
          <div style={emptyStyle}>
            都市が見つかりません。先に都市を作成してください。
          </div>
        ) : null}

        <label style={labelStyle}>
          都市
          <select
            value={form.cityId}
            onChange={(event) => updateCity(event.target.value)}
            style={inputStyle}
          >
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.city}, {city.country}
                {city.is_published ? "" : " — 下書き"}
              </option>
            ))}
          </select>
        </label>

        <label style={labelStyle}>
          スポット名
          <input
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Trevi Fountain"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          スラッグ
          <input
            value={form.slug}
            onChange={(event) => update("slug", slugify(event.target.value))}
            placeholder="trevi-fountain"
            style={inputStyle}
          />
          <AdminInlineButton onClick={generateSlugFromSpot}>
            スポット名から生成
          </AdminInlineButton>
        </label>
        <AdminFieldHint>
          英小文字・数字・ハイフンのみ。同じ都市内で重複しないようにします。
        </AdminFieldHint>

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
          <AdminInlineButton onClick={insertDescriptionTemplate}>
            説明文テンプレートを挿入
          </AdminInlineButton>
        </label>
        <AdminFieldHint>
          公開ページ向けの英語説明文。空欄なら概要が使われます。
        </AdminFieldHint>

        <label style={labelStyle}>
          画像URL（https）
          <input
            value={form.imageUrl}
            onChange={(event) => update("imageUrl", event.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </label>
        <AdminFieldHint>
          スポット詳細ページとプレビューで使う画像URLです。
        </AdminFieldHint>
        <AdminUrlTestLink url={form.imageUrl} />

        <div style={uploadWrapStyle}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            style={inputStyle}
          />
          <button
            type="button"
            onClick={uploadSpotImage}
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
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          画像クレジット
          <input
            value={form.imageCredit}
            onChange={(event) => update("imageCredit", event.target.value)}
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
        <AdminFieldHint>
          写真提供元やライセンス確認用のURLです。
        </AdminFieldHint>
        <AdminUrlTestLink url={form.imageSourceUrl} />

        <label style={labelStyle}>
          ホテルアフィリエイトURL（https）
          <input
            value={form.affiliateHotelUrl}
            onChange={(event) => update("affiliateHotelUrl", event.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </label>
        <AdminFieldHint>
          スポット詳細のホテルCTAで優先されるURLです。未入力なら都市側URLが使われる場合があります。
        </AdminFieldHint>
        <AdminUrlTestLink url={form.affiliateHotelUrl} />

        <label style={labelStyle}>
          ツアーアフィリエイトURL（https）
          <input
            value={form.affiliateTourUrl}
            onChange={(event) => update("affiliateTourUrl", event.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </label>
        <AdminFieldHint>
          スポット詳細のツアーCTAで優先されるURLです。未入力なら都市側URLが使われる場合があります。
        </AdminFieldHint>
        <AdminUrlTestLink url={form.affiliateTourUrl} />

        <label style={checkStyle}>
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(event) => update("isPublished", event.target.checked)}
          />
          公開
        </label>

        <button
          type="button"
          onClick={createInSupabase}
          style={buttonStyle}
          disabled={cities.length === 0}
        >
          Supabase に作成
        </button>

        {status && (
          <p style={statusKind === "error" ? errorStatusStyle : statusKind === "success" ? successStatusStyle : statusStyle}>
            {status}
          </p>
        )}
      </section>

      <AdminLivePreview
        label="ライブプレビュー"
        title={form.name || "新しいスポット"}
        subtitle={selectedCity ? `${selectedCity.city}, ${selectedCity.country}` : "都市"}
        description={form.description || form.summary}
        imageUrl={form.imageUrl}
        isPublished={form.isPublished}
        publicPath={selectedCitySlug && form.slug ? `/c/${selectedCitySlug}/spot/${form.slug}` : ""}
        ctas={[
          {
            label: "ホテル",
            href: `/out/hotels?c=${encodeURIComponent(selectedCitySlug)}&s=${encodeURIComponent(form.slug)}&src=admin-preview&v=spot_preview`,
            isVisible:
              Boolean(selectedCitySlug && form.slug) &&
              hasPreviewUrl(form.affiliateHotelUrl),
          },
          {
            label: "ツアー",
            href: `/out/tours?c=${encodeURIComponent(selectedCitySlug)}&s=${encodeURIComponent(form.slug)}&src=admin-preview&v=spot_preview`,
            isVisible:
              Boolean(selectedCitySlug && form.slug) &&
              hasPreviewUrl(form.affiliateTourUrl),
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

const emptyStyle: CSSProperties = {
  marginBottom: 14,
  padding: 14,
  borderRadius: 18,
  background: "#fffdf8",
  border: "1px solid rgba(168,116,50,.14)",
  color: "#607080",
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


