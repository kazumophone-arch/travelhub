"use client";

import { useState, type CSSProperties } from "react";
import {
  IMAGE_POSITION_OPTIONS,
  normalizeImagePosition,
  type ImagePosition,
} from "@/lib/url-fields";

type Props = {
  url: string;
  position: ImagePosition;
  onChangeUrl: (value: string) => void;
  onChangePosition: (value: ImagePosition) => void;
  uploadKind: "city" | "spot";
  citySlug: string;
  spotSlug?: string;
};

async function readResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || "サーバー応答を読み取れませんでした。" };
  }
}

export function EditableImageButton({
  url,
  position,
  onChangeUrl,
  onChangePosition,
  uploadKind,
  citySlug,
  spotSlug,
}: Props) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function upload() {
    if (!citySlug) {
      setStatus("先に都市スラッグを設定してください。");
      return;
    }

    if (uploadKind === "spot" && !spotSlug) {
      setStatus("先にスポットスラッグを設定してください。");
      return;
    }

    if (!file) {
      setStatus("画像ファイルを選択してください。");
      return;
    }

    setIsUploading(true);
    setStatus("アップロード中...");

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("kind", uploadKind);
    uploadForm.append("citySlug", citySlug);

    if (uploadKind === "spot" && spotSlug) {
      uploadForm.append("spotSlug", spotSlug);
    }

    try {
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: uploadForm,
      });

      const data = await readResponse(response);

      if (!response.ok || typeof data.publicUrl !== "string") {
        setStatus(data.error ?? "アップロードに失敗しました。");
        return;
      }

      onChangeUrl(data.publicUrl);
      setStatus("画像を更新しました。");
    } catch {
      setStatus("アップロードに失敗しました。");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div style={wrapStyle}>
      <button type="button" onClick={() => setOpen((value) => !value)} style={toggleStyle}>
        🖼 画像を変更
      </button>

      {open ? (
        <div style={panelStyle}>
          <label style={labelStyle}>
            画像URL（https）
            <input
              value={url}
              onChange={(event) => onChangeUrl(event.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            表示位置
            <select
              value={position}
              onChange={(event) => onChangePosition(normalizeImagePosition(event.target.value))}
              style={inputStyle}
            >
              {IMAGE_POSITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div style={uploadRowStyle}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              style={inputStyle}
            />
            <button type="button" onClick={upload} disabled={isUploading} style={uploadButtonStyle}>
              アップロード
            </button>
          </div>

          {status ? <p style={statusStyle}>{status}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

const wrapStyle: CSSProperties = {
  position: "absolute",
  top: 16,
  right: 16,
  zIndex: 5,
  display: "grid",
  gap: 8,
  justifyItems: "end",
};

const toggleStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  border: 0,
  background: "rgba(13, 43, 82, 0.86)",
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 850,
  cursor: "pointer",
};

const panelStyle: CSSProperties = {
  width: 280,
  display: "grid",
  gap: 10,
  padding: 14,
  borderRadius: 16,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.12)",
  boxShadow: "0 18px 40px rgba(13,43,82,.22)",
  color: "#17202a",
  textAlign: "left",
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 6,
  fontSize: 11,
  fontWeight: 850,
  color: "#607080",
  letterSpacing: ".06em",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "9px 10px",
  borderRadius: 12,
  border: "1px solid rgba(23,32,42,.12)",
  background: "#f8faf7",
  color: "#17202a",
  fontSize: 13,
  boxSizing: "border-box",
};

const uploadRowStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

const uploadButtonStyle: CSSProperties = {
  padding: "9px 12px",
  borderRadius: 999,
  border: 0,
  background: "#138a72",
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 850,
  cursor: "pointer",
};

const statusStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: "#607080",
};
