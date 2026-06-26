"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  AdminFieldHint,
  AdminInlineButton,
  AdminUrlTestLink,
  buildCityDescription,
} from "@/components/AdminContentTools";
import { AdminTagSelector } from "@/components/AdminTagSelector";
import { AdminCityHeroPreview } from "@/components/AdminCityHeroPreview";
import layoutStyles from "@/components/AdminCityHeroPreview.module.css";
import {
  formatValidationErrors,
  MONTH_NAMES,
  slugify,
  validateCityFields,
  validateSlug,
} from "@/lib/admin-validation";
import {
  IMAGE_POSITION_OPTIONS,
  normalizeImagePosition,
  type ImagePosition,
} from "@/lib/url-fields";

type Props = {
  id: string;
};

type CityForm = {
  id: string;
  city: string;
  slug: string;
  countryId: string;
  country: string;
  region: string;
  summary: string;
  description: string;
  imageUrl: string;
  imagePosition: ImagePosition;
  imageAlt: string;
  imageCredit: string;
  imageSourceUrl: string;
  affiliateHotelUrl: string;
  affiliateTourUrl: string;
  tagIds: string[];
  isPublished: boolean;
  sortRank: number;
  isFeatured: boolean;
  featuredRank: number | null;
  bestMonths: string[];
  seasonNote: string;
};

type CountryOption = {
  id: string;
  name: string;
  slug: string;
  region: string | null;
  is_published: boolean;
};

type CityApiRow = Record<string, unknown>;
type StatusKind = "info" | "success" | "error";

const emptyForm: CityForm = {
  id: "",
  city: "",
  slug: "",
  countryId: "",
  country: "",
  region: "",
  summary: "",
  description: "",
  imageUrl: "",
  imagePosition: "center",
  imageAlt: "",
  imageCredit: "",
  imageSourceUrl: "",
  affiliateHotelUrl: "",
  affiliateTourUrl: "",
  tagIds: [],
  isPublished: false,
  sortRank: 999,
  isFeatured: false,
  featuredRank: null,
  bestMonths: [],
  seasonNote: "",
};

async function readResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || "サーバー応答を読み取れませんでした。" };
  }
}

function hasText(value: string) {
  return value.trim().length > 0;
}

function getCityPublishReadinessNotes(form: CityForm) {
  if (!form.isPublished) return [];

  const notes: string[] = [];

  if (!hasText(form.summary)) {
    notes.push("概要が未入力です。公開カードや一覧で内容が弱くなります。");
  }

  if (!hasText(form.description)) {
    notes.push("説明が未入力です。都市ページ本文の情報が不足します。");
  }

  if (!hasText(form.imageUrl)) {
    notes.push("画像URLが未入力です。公開ページは代替背景で表示されます。");
  }

  if (!hasText(form.affiliateHotelUrl) && !hasText(form.affiliateTourUrl)) {
    notes.push("ホテル/ツアーURLが未入力です。都市ページのCTAは表示されません。");
  }

  return notes;
}

function FormSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section style={sectionStyle}>
      <div style={sectionHeadingStyle}>{title}</div>
      {hint ? <p style={sectionHintStyle}>{hint}</p> : null}
      {children}
    </section>
  );
}

function PublishReadinessPanel({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;

  return (
    <div style={publishReadinessStyle}>
      <div style={publishReadinessTitleStyle}>公開前チェック</div>
      <ul style={publishReadinessListStyle}>
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}

export function AdminEditCityForm({ id }: Props) {
  const [form, setForm] = useState<CityForm>(emptyForm);
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [status, setStatus] = useState("読み込み中...");
  const [statusKind, setStatusKind] = useState<StatusKind>("info");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const publishReadinessNotes = getCityPublishReadinessNotes(form);

  function setStatusMessage(message: string, kind: StatusKind = "info") {
    setStatus(message);
    setStatusKind(kind);
  }

  useEffect(() => {
    async function loadCity() {
      setStatusMessage("読み込み中...");

      const [response, countriesResponse] = await Promise.all([
        fetch(`/api/admin/cities?id=${id}`),
        fetch("/api/admin/countries"),
      ]);
      const data = await readResponse(response);
      const countriesData = await readResponse(countriesResponse);
      const nextCountries = ((countriesData.countries ?? []) as CountryOption[])
        .map((country) => ({
          ...country,
          id: String(country.id ?? "").trim(),
          name: String(country.name ?? "").trim(),
        }))
        .filter((country) => country.id && country.name);

      if (countriesResponse.ok) {
        setCountryOptions(nextCountries);
      }

      if (!response.ok) {
        setStatusMessage(data.error ?? "都市の読み込みに失敗しました。", "error");
        return;
      }

      const cityData = data.city as CityApiRow | null;
      const cityTagIds = Array.isArray(data.tagIds)
        ? data.tagIds.map((tagId: unknown) => String(tagId ?? "").trim()).filter(Boolean)
        : [];

      if (!cityData) {
        setStatusMessage("都市が見つかりません。", "error");
        return;
      }

      const existingCountry = String(cityData.country ?? "");
      const existingCountryId = String(cityData.country_id ?? "").trim();
      const matchedCountry =
        nextCountries.find((country) => country.id === existingCountryId) ??
        nextCountries.find(
          (country) =>
            country.name.trim().toLowerCase() ===
            existingCountry.trim().toLowerCase()
        );

      setForm({
        id: String(cityData.id ?? ""),
        city: String(cityData.city ?? ""),
        slug: String(cityData.slug ?? ""),
        countryId: existingCountryId || matchedCountry?.id || "",
        country: matchedCountry?.name ?? existingCountry,
        region: String(cityData.region ?? matchedCountry?.region ?? ""),
        summary: String(cityData.summary ?? ""),
        description: String(cityData.description ?? ""),
        imageUrl: String(cityData.image_url ?? ""),
        imagePosition: normalizeImagePosition(cityData.image_position),
        imageAlt: String(cityData.image_alt ?? ""),
        imageCredit: String(cityData.image_credit ?? ""),
        imageSourceUrl: String(cityData.image_source_url ?? ""),
        affiliateHotelUrl: String(cityData.affiliate_hotel_url ?? ""),
        affiliateTourUrl: String(cityData.affiliate_tour_url ?? ""),
        tagIds: cityTagIds,
        isPublished: Boolean(cityData.is_published),
        sortRank: Number(cityData.sort_rank ?? 999),
        isFeatured: Boolean(cityData.is_featured),
        featuredRank:
          cityData.featured_rank === null || cityData.featured_rank === undefined
            ? null
            : Number(cityData.featured_rank),
        bestMonths: Array.isArray(cityData.best_months)
          ? (cityData.best_months as unknown[]).map((month) => String(month ?? "").trim()).filter(Boolean)
          : [],
        seasonNote: String(cityData.season_note ?? ""),
      });

      setStatusMessage("");
    }

    loadCity();
  }, [id]);

  function update<K extends keyof CityForm>(key: K, value: CityForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "city" && !current.slug
        ? { slug: slugify(String(value)) }
        : {}),
    }));
  }

  function updateCountry(countryId: string) {
    const nextCountryId = String(countryId ?? "").trim();
    const selectedCountry = countryOptions.find((country) => country.id === nextCountryId);

    setForm((current) => ({
      ...current,
      countryId: nextCountryId,
      country: selectedCountry?.name ?? current.country,
      region: current.region || selectedCountry?.region || "",
    }));
  }

  function updateManualCountry(country: string) {
    setForm((current) => ({
      ...current,
      countryId: "",
      country,
    }));
  }

  function generateSlugFromCity() {
    update("slug", slugify(form.city));
  }

  function toggleBestMonth(month: string) {
    setForm((current) => ({
      ...current,
      bestMonths: current.bestMonths.includes(month)
        ? current.bestMonths.filter((existing) => existing !== month)
        : [...current.bestMonths, month],
    }));
  }

  function insertDescriptionTemplate() {
    if (
      form.description &&
      !window.confirm("現在の説明文をテンプレートで上書きしますか？")
    ) {
      return;
    }

    update("description", buildCityDescription(form.city, form.country));
  }

  async function saveCity() {
    const validationErrors = validateCityFields(form);

    if (validationErrors.length > 0) {
      setStatusMessage(formatValidationErrors(validationErrors), "error");
      return;
    }

    setStatusMessage("保存しています...");

    const response = await fetch("/api/admin/cities", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await readResponse(response);

    if (!response.ok) {
      setStatusMessage(data.error ?? "都市の保存に失敗しました。", "error");
      return;
    }

    setStatusMessage("都市を保存しました。", "success");
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

  if (status === "読み込み中...") {
    return <div style={emptyStyle}>読み込み中...</div>;
  }

  const publicPath = form.slug ? `/c/${form.slug}` : "";

  return (
    <div className={layoutStyles.editLayout}>
      <section style={formStyle}>
        <FormSection
          title="Page identity"
          hint="都市の基本情報と公開状態です。右側プレビュー全体の元データになります。"
        >
          <label style={labelStyle}>
            都市名
            <input value={form.city} onChange={(event) => update("city", event.target.value)} style={inputStyle} />
          </label>

          <label style={labelStyle}>
            スラッグ
            <input value={form.slug} onChange={(event) => update("slug", slugify(event.target.value))} style={inputStyle} />
            <AdminInlineButton onClick={generateSlugFromCity}>
              都市名から生成
            </AdminInlineButton>
          </label>
          <AdminFieldHint>
            英小文字・数字・ハイフンのみ。既存スラッグを変えると公開URLも変わります。
          </AdminFieldHint>

          <label style={labelStyle}>
            国
            <select
              value={form.countryId}
              onChange={(event) => updateCountry(event.target.value)}
              style={inputStyle}
            >
              <option value="">国を選択</option>
              {countryOptions.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                  {country.is_published ? "" : " — 下書き"}
                </option>
              ))}
            </select>
          </label>
          <AdminFieldHint>
            国管理のデータを選ぶと、互換性のため国名にも同じ名前を保存します。
          </AdminFieldHint>

          <label style={labelStyle}>
            国名
            <input value={form.country} onChange={(event) => updateManualCountry(event.target.value)} style={inputStyle} />
          </label>

          <label style={labelStyle}>
            地域
            <input value={form.region} onChange={(event) => update("region", event.target.value)} style={inputStyle} />
          </label>

          <label style={checkStyle}>
            <input type="checkbox" checked={form.isPublished} onChange={(event) => update("isPublished", event.target.checked)} />
            公開
          </label>

          {publicPath ? (
            <Link href={publicPath} target="_blank" rel="noreferrer" style={inlinePublicLinkStyle}>
              公開ページを開く →
            </Link>
          ) : null}
        </FormSection>

        <FormSection
          title="Hero"
          hint="右側プレビュー上部のヒーロー（画像・タイトル・リード文）に反映されます。"
        >
          <label style={labelStyle}>
            概要（ヒーローのリード文）
            <textarea value={form.summary} onChange={(event) => update("summary", event.target.value)} rows={4} style={textareaStyle} />
          </label>

          <label style={labelStyle}>
            画像URL（https）
            <input value={form.imageUrl} onChange={(event) => update("imageUrl", event.target.value)} placeholder="https://..." style={inputStyle} />
          </label>
          <AdminFieldHint>
            公開ページとプレビューで使う画像URLです。https の実URLを入れてください。
          </AdminFieldHint>
          <AdminUrlTestLink url={form.imageUrl} />

          <label style={labelStyle}>
            画像の表示位置
            <select
              value={form.imagePosition}
              onChange={(event) =>
                update("imagePosition", normalizeImagePosition(event.target.value))
              }
              style={inputStyle}
            >
              {IMAGE_POSITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <AdminFieldHint>
            画像が切れる場合に、どの位置を優先して表示するかを選びます。
          </AdminFieldHint>

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
            <input value={form.imageAlt} onChange={(event) => update("imageAlt", event.target.value)} style={inputStyle} />
          </label>

          <label style={labelStyle}>
            画像クレジット
            <input value={form.imageCredit} onChange={(event) => update("imageCredit", event.target.value)} style={inputStyle} />
          </label>

          <label style={labelStyle}>
            画像出典URL（https）
            <input value={form.imageSourceUrl} onChange={(event) => update("imageSourceUrl", event.target.value)} placeholder="https://source.example/photo" style={inputStyle} />
          </label>
          <AdminFieldHint>
            写真提供元やライセンス確認用のURLです。
          </AdminFieldHint>
          <AdminUrlTestLink url={form.imageSourceUrl} />
        </FormSection>

        <FormSection
          title="Where to Stay"
          hint="ホテルURLを入力すると、プレビューのホテルCTAが「表示予定」になります。"
        >
          <label style={labelStyle}>
            ホテルアフィリエイトURL（https）
            <input value={form.affiliateHotelUrl} onChange={(event) => update("affiliateHotelUrl", event.target.value)} placeholder="https://..." style={inputStyle} />
          </label>
          <AdminFieldHint>
            都市ページのホテルCTAで使う候補URLです。スポット側URLがある場合はそちらが優先されます。
          </AdminFieldHint>
          <AdminUrlTestLink url={form.affiliateHotelUrl} />
        </FormSection>

        <FormSection
          title="Experiences"
          hint="ツアーURLを入力すると、プレビューのツアーCTAが「表示予定」になります。"
        >
          <label style={labelStyle}>
            ツアーアフィリエイトURL（https）
            <input value={form.affiliateTourUrl} onChange={(event) => update("affiliateTourUrl", event.target.value)} placeholder="https://..." style={inputStyle} />
          </label>
          <AdminFieldHint>
            都市ページのツアーCTAで使う候補URLです。スポット側URLがある場合はそちらが優先されます。
          </AdminFieldHint>
          <AdminUrlTestLink url={form.affiliateTourUrl} />
        </FormSection>

        <FormSection
          title="Explore next / Supporting copy"
          hint="現在のプレビューには直接表示されない補足情報です（説明は概要が空欄のときのみヒーローのリード文として使われます）。"
        >
          <label style={labelStyle}>
            説明
            <textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={5} style={textareaStyle} />
            <AdminInlineButton onClick={insertDescriptionTemplate}>
              説明文テンプレートを挿入
            </AdminInlineButton>
          </label>
          <AdminFieldHint>
            公開ページ向けの英語説明文。空欄なら概要が使われます。
          </AdminFieldHint>

          <label style={labelStyle}>
            表示順
            <input type="number" value={form.sortRank} onChange={(event) => update("sortRank", Number(event.target.value))} style={inputStyle} />
          </label>

          <label style={checkStyle}>
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(event) => update("isFeatured", event.target.checked)}
            />
            ホームのヒーローに表示（注目都市）
          </label>

          <label style={labelStyle}>
            注目順（小さいほど先に表示、空欄可）
            <input
              type="number"
              value={form.featuredRank ?? ""}
              onChange={(event) =>
                update(
                  "featuredRank",
                  event.target.value === "" ? null : Number(event.target.value)
                )
              }
              style={inputStyle}
            />
          </label>
          <AdminFieldHint>
            ホームページのヒーロー回転に出す都市と順番を決めます。注目都市が0件の場合は表示順の上位3件が使われます。
          </AdminFieldHint>

          <div style={labelStyle}>
            おすすめの月（複数選択可）
            <div style={monthGridStyle}>
              {MONTH_NAMES.map((month) => {
                const isSelected = form.bestMonths.includes(month);

                return (
                  <button
                    key={month}
                    type="button"
                    onClick={() => toggleBestMonth(month)}
                    style={isSelected ? monthOptionSelectedStyle : monthOptionStyle}
                    aria-pressed={isSelected}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          </div>
          <AdminFieldHint>
            ホームページの「Good to visit in [月]」セクションは、ここで選んだ月に現在の月が含まれる都市のみ表示します。
          </AdminFieldHint>

          <label style={labelStyle}>
            季節のひとことメモ（おすすめの月の理由）
            <textarea
              value={form.seasonNote}
              onChange={(event) => update("seasonNote", event.target.value)}
              rows={3}
              style={textareaStyle}
              placeholder="例: Cherry blossoms peak in late March, quiet temples in November."
            />
          </label>
          <AdminFieldHint>
            ホームページの季節カードに表示される説明文です。未入力の場合は説明文を表示しません。
          </AdminFieldHint>

          <AdminTagSelector
            selectedTagIds={form.tagIds}
            onChange={(tagIds) => update("tagIds", tagIds)}
            helperText="都市の整理用タグです。公開ページや検索にはまだ使われません。"
          />
        </FormSection>

        <PublishReadinessPanel notes={publishReadinessNotes} />

        <div style={buttonRowStyle}>
          <button type="button" onClick={saveCity} style={buttonStyle}>
            保存
          </button>

          <Link href="/admin/cities" style={secondaryButtonStyle}>
            戻る
          </Link>
        </div>

        {status && (
          <p style={statusKind === "error" ? errorStatusStyle : statusKind === "success" ? successStatusStyle : statusStyle}>
            {status}
          </p>
        )}
      </section>
      <div className={layoutStyles.previewColumn}>
        <AdminCityHeroPreview
          title={form.city}
          country={form.country}
          imageUrl={form.imageUrl}
          imagePosition={form.imagePosition}
          isPublished={form.isPublished}
          publicPath={publicPath}
          ctas={[
            {
              label: "Find hotels",
              href: `/out/hotels?c=${encodeURIComponent(form.slug)}&src=admin-preview&v=city_preview`,
              isVisible: Boolean(form.slug),
            },
            {
              label: "Explore tours",
              href: `/out/tours?c=${encodeURIComponent(form.slug)}&src=admin-preview&v=city_preview`,
              isVisible: Boolean(form.slug),
            },
            {
              label: "Get an eSIM",
              href: "https://www.airalo.com/",
              isVisible: true,
            },
          ]}
        />
      </div>
    </div>
  );
}

const formStyle: CSSProperties = {
  padding: 18,
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
};

const sectionStyle: CSSProperties = {
  marginBottom: 24,
  paddingBottom: 20,
  borderBottom: "1px solid rgba(23,32,42,.08)",
};

const sectionHeadingStyle: CSSProperties = {
  marginBottom: 6,
  fontSize: 15,
  fontWeight: 850,
  color: "#17202a",
  letterSpacing: "-.01em",
};

const sectionHintStyle: CSSProperties = {
  margin: "0 0 14px",
  fontSize: 12,
  lineHeight: 1.55,
  color: "#8d6139",
};

const inlinePublicLinkStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  marginBottom: 4,
  color: "#138a72",
  fontSize: 12,
  fontWeight: 850,
  textDecoration: "none",
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

const monthGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 90px), 1fr))",
  gap: 6,
};

const monthOptionStyle: CSSProperties = {
  padding: "8px 9px",
  borderRadius: 12,
  border: "1px solid rgba(23,32,42,.08)",
  background: "#f8faf7",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 750,
  textAlign: "center",
  cursor: "pointer",
};

const monthOptionSelectedStyle: CSSProperties = {
  ...monthOptionStyle,
  border: "1px solid rgba(19,138,114,.3)",
  background: "#e8f7ef",
  color: "#126b43",
};

const publishReadinessStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  marginBottom: 16,
  padding: 12,
  borderRadius: 18,
  background: "#fffdf8",
  border: "1px solid rgba(168,116,50,.18)",
  color: "#607080",
};

const publishReadinessTitleStyle: CSSProperties = {
  color: "#9a6a2f",
  fontSize: 12,
  fontWeight: 850,
};

const publishReadinessListStyle: CSSProperties = {
  display: "grid",
  gap: 5,
  margin: 0,
  paddingLeft: 18,
  fontSize: 12,
  lineHeight: 1.55,
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: 9,
  flexWrap: "wrap",
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
