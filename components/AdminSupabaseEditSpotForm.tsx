"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  AdminContentGuidance,
  AdminFieldHint,
  AdminInlineButton,
  AdminUrlTestLink,
  buildSpotDescription,
} from "@/components/AdminContentTools";
import { AdminTagSelector } from "@/components/AdminTagSelector";
import { AdminSpotInlineEditor } from "@/components/AdminSpotInlineEditor";
import editorStyles from "@/components/AdminEditor.module.css";
import {
  formatValidationErrors,
  slugify,
  validateSlug,
  validateSpotFields,
} from "@/lib/admin-validation";
import {
  IMAGE_POSITION_OPTIONS,
  normalizeImagePosition,
  type ImagePosition,
} from "@/lib/url-fields";

type Props = {
  id: string;
};

type CityOption = {
  id: string;
  slug: string;
  city: string;
  country: string;
  is_published: boolean;
};

type SpotForm = {
  id: string;
  cityId: string;
  name: string;
  slug: string;
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
};

type StatusKind = "info" | "success" | "error";

const emptyForm: SpotForm = {
  id: "",
  cityId: "",
  name: "",
  slug: "",
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

function getSpotPublishReadinessNotes(form: SpotForm) {
  if (!form.isPublished) return [];

  const notes: string[] = [];

  if (!hasText(form.summary)) {
    notes.push("概要が未入力です。公開カードや一覧で内容が弱くなります。");
  }

  if (!hasText(form.description)) {
    notes.push("説明が未入力です。スポットページ本文の情報が不足します。");
  }

  if (!hasText(form.imageUrl)) {
    notes.push("画像URLが未入力です。公開ページは代替背景で表示されます。");
  }

  if (!hasText(form.affiliateHotelUrl) && !hasText(form.affiliateTourUrl)) {
    notes.push("ホテル/ツアーURLが未入力です。スポットCTAは表示されませんが、この状態でも公開できます。");
  }

  return notes;
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

export function AdminSupabaseEditSpotForm({ id }: Props) {
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [form, setForm] = useState<SpotForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [status, setStatus] = useState("読み込み中...");
  const [statusKind, setStatusKind] = useState<StatusKind>("info");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const selectedCity = cityOptions.find((city) => city.id === form.cityId);
  const selectedCitySlug = selectedCity?.slug ?? "";
  const publishReadinessNotes = getSpotPublishReadinessNotes(form);

  function setStatusMessage(message: string, kind: StatusKind = "info") {
    setStatus(message);
    setStatusKind(kind);
  }

  useEffect(() => {
    async function loadSpot() {
      const [spotResponse, citiesResponse] = await Promise.all([
        fetch(`/api/admin/spots?id=${id}`),
        fetch("/api/admin/cities"),
      ]);

      const data = await readResponse(spotResponse);
      const citiesData = await readResponse(citiesResponse);
      const nextCities = ((citiesData.cities ?? []) as CityOption[])
        .map((city) => ({
          ...city,
          id: String(city.id ?? "").trim(),
        }))
        .filter((city) => city.id);

      if (citiesResponse.ok) {
        setCityOptions(nextCities);
      }

      const response = spotResponse;

      if (!response.ok) {
        setStatusMessage(data.error ?? "スポットの読み込みに失敗しました。", "error");
        return;
      }

      const spot = data.spot;
      const cityId = String(spot.city_id ?? "").trim();
      const spotTagIds = Array.isArray(data.tagIds)
        ? data.tagIds.map((tagId: unknown) => String(tagId ?? "").trim()).filter(Boolean)
        : [];

      setForm({
        id: spot.id,
        cityId,
        name: spot.name ?? "",
        slug: spot.slug ?? "",
        summary: spot.summary ?? "",
        description: spot.description ?? "",
        imageUrl: spot.image_url ?? "",
        imagePosition: normalizeImagePosition(spot.image_position),
        imageAlt: spot.image_alt ?? "",
        imageCredit: spot.image_credit ?? "",
        imageSourceUrl: spot.image_source_url ?? "",
        affiliateHotelUrl: spot.affiliate_hotel_url ?? "",
        affiliateTourUrl: spot.affiliate_tour_url ?? "",
        tagIds: spotTagIds,
        isPublished: Boolean(spot.is_published),
      });

      setStatusMessage(
        cityId
          ? ""
          : "このスポットは city_id が未設定です。移行を完了するため都市を選択してください。",
        cityId ? "info" : "error"
      );
    }

    loadSpot();
  }, [id]);

  function updateCity(cityId: string) {
    setForm((current) => ({
      ...current,
      cityId: String(cityId ?? "").trim(),
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

  async function save() {
    const cityId = String(form.cityId ?? "").trim();

    if (!cityId) {
      setStatusMessage("都市を選択してください。", "error");
      return;
    }

    const payload = {
      ...form,
      cityId,
    };
    const validationErrors = validateSpotFields(payload);

    if (validationErrors.length > 0) {
      setStatusMessage(formatValidationErrors(validationErrors), "error");
      return;
    }

    setStatusMessage("保存しています...");

    const response = await fetch("/api/admin/spots", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await readResponse(response);

    if (!response.ok) {
      setStatusMessage(data.error ?? "スポットの保存に失敗しました。", "error");
      return;
    }

    setStatusMessage("スポットを保存しました。", "success");
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

  if (status === "読み込み中...") {
    return <div style={emptyStyle}>読み込み中...</div>;
  }

  const publicPath =
    selectedCitySlug && form.slug ? `/c/${selectedCitySlug}/spot/${form.slug}` : "";

  return (
    <div className={editorStyles.root}>
      <div className={editorStyles.toolbar}>
        <span className={editorStyles.toolbarTitle}>{form.name || "スポット"} を編集</span>
        <label className={editorStyles.publishToggle}>
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(event) => update("isPublished", event.target.checked)}
          />
          公開
        </label>
        {publicPath ? (
          <Link href={publicPath} target="_blank" rel="noreferrer" className={editorStyles.ghostButton}>
            公開ページを開く
          </Link>
        ) : null}
        {form.cityId ? (
          <Link href={`/admin/cities/edit/${form.cityId}`} className={editorStyles.ghostButton}>
            都市の編集へ
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => setSettingsOpen((value) => !value)}
          className={editorStyles.ghostButton}
        >
          {settingsOpen ? "詳細設定を閉じる" : "詳細設定"}
        </button>
        <button type="button" onClick={save} className={editorStyles.primaryButton}>
          保存
        </button>
        {status ? (
          <span
            className={
              statusKind === "error"
                ? `${editorStyles.status} ${editorStyles.statusError}`
                : editorStyles.status
            }
          >
            {status}
          </span>
        ) : null}
        <p className={editorStyles.toolbarHint}>
          下のページ上で、点線の枠をクリックするとスポット名・概要・説明文を直接編集できます。画像はヒーロー右上の「画像を変更」から。都市の選択・スラッグ・アフィリエイトURL・タグなどは「詳細設定」から編集します。
        </p>
      </div>

      <div className={editorStyles.stage}>
        <AdminSpotInlineEditor
          spotId={form.id}
          cityId={form.cityId}
          citySlug={selectedCitySlug}
          name={form.name}
          slug={form.slug}
          summary={form.summary}
          description={form.description}
          imageUrl={form.imageUrl}
          imagePosition={form.imagePosition}
          affiliateHotelUrl={form.affiliateHotelUrl}
          affiliateTourUrl={form.affiliateTourUrl}
          onChangeName={(value) => update("name", value)}
          onChangeSummary={(value) => update("summary", value)}
          onChangeDescription={(value) => update("description", value)}
          onChangeImageUrl={(value) => update("imageUrl", value)}
          onChangeImagePosition={(value) => update("imagePosition", value)}
        />
      </div>

      {settingsOpen ? (
        <section className={editorStyles.settings}>
          <h2 className={editorStyles.settingsTitle}>詳細設定</h2>
          <AdminContentGuidance kind="spot" />

          <label style={labelStyle}>
            都市
            <select
              value={form.cityId}
              onChange={(event) => updateCity(event.target.value)}
              style={inputStyle}
            >
              <option value="" disabled>
                都市を選択
              </option>
              {cityOptions.map((city) => (
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
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          スラッグ
          <input
            value={form.slug}
            onChange={(event) => update("slug", slugify(event.target.value))}
            style={inputStyle}
          />
          <AdminInlineButton onClick={generateSlugFromSpot}>
            スポット名から生成
          </AdminInlineButton>
        </label>
        <AdminFieldHint>
          英小文字・数字・ハイフンのみ。既存スラッグを変えると公開URLも変わります。
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

        <AdminTagSelector
          selectedTagIds={form.tagIds}
          onChange={(tagIds) => update("tagIds", tagIds)}
          helperText="スポットの整理用タグです。公開ページや検索にはまだ使われません。"
        />

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
          このスポットに直接対応するホテルURLがある場合だけ入力します。未入力の場合、公開スポットページのホテルCTAは表示されません。
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
          このスポットに直接対応するツアーURLがある場合だけ入力します。未入力の場合、公開スポットページのツアーCTAは表示されません。
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

        <PublishReadinessPanel notes={publishReadinessNotes} />

        <div style={buttonRowStyle}>
          <button type="button" onClick={save} style={buttonStyle}>
            保存
          </button>

          <Link href="/admin/spots" style={secondaryButtonStyle}>
            戻る
          </Link>
        </div>

        {status && (
          <p style={statusKind === "error" ? errorStatusStyle : statusKind === "success" ? successStatusStyle : statusStyle}>
            {status}
          </p>
        )}
        </section>
      ) : null}
    </div>
  );
}

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

