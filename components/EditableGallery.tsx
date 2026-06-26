"use client";

import { useState, type CSSProperties } from "react";
import type { GalleryImage } from "@/lib/url-fields";

type Props = {
  buttonLabel?: string;
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  uploadKind: "city" | "spot";
  citySlug: string;
  spotSlug?: string;
  tone?: "light" | "dark";
};

async function readResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || "サーバー応答を読み取れませんでした。" };
  }
}

export function EditableGallery({
  buttonLabel = "🖼 ギャラリーを編集",
  images,
  onChange,
  uploadKind,
  citySlug,
  spotSlug,
  tone = "light",
}: Props) {
  const [open, setOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");

  function addImage(url: string) {
    if (!url.trim()) return;

    onChange([...images, { url: url.trim(), position: "center", alt: "", credit: "" }]);
    setUrlInput("");
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;

    const next = [...images];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
  }

  async function uploadAndAdd() {
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

      addImage(data.publicUrl);
      setFile(null);
      setStatus("画像を追加しました。");
    } catch {
      setStatus("アップロードに失敗しました。");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div style={wrapStyle}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={tone === "dark" ? toggleDarkStyle : toggleStyle}
      >
        {buttonLabel} ({images.length})
      </button>

      {open ? (
        <div style={panelStyle}>
          {images.length > 0 ? (
            <div style={listStyle}>
              {images.map((image, index) => (
                <div key={`${image.url}-${index}`} style={itemStyle}>
                  <div style={{ ...thumbStyle, backgroundImage: `url(${JSON.stringify(image.url)})` }} />
                  <div style={itemActionsStyle}>
                    <button type="button" onClick={() => moveImage(index, -1)} style={smallButtonStyle} disabled={index === 0}>
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 1)}
                      style={smallButtonStyle}
                      disabled={index === images.length - 1}
                    >
                      ↓
                    </button>
                    <button type="button" onClick={() => removeImage(index)} style={removeButtonStyle}>
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={hintStyle}>まだ追加された画像はありません。</p>
          )}

          <label style={labelStyle}>
            画像URLを追加（https）
            <div style={addRowStyle}>
              <input
                value={urlInput}
                onChange={(event) => setUrlInput(event.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
              <button type="button" onClick={() => addImage(urlInput)} style={smallButtonStyle}>
                追加
              </button>
            </div>
          </label>

          <label style={labelStyle}>
            画像をアップロードして追加
            <div style={addRowStyle}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                style={inputStyle}
              />
              <button type="button" onClick={uploadAndAdd} disabled={isUploading} style={smallButtonStyle}>
                追加
              </button>
            </div>
          </label>

          {status ? <p style={hintStyle}>{status}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

const wrapStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "start",
};

const toggleStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid rgba(23,32,42,.16)",
  background: "#ffffff",
  color: "#138a72",
  fontSize: 12,
  fontWeight: 850,
  cursor: "pointer",
};

const toggleDarkStyle: CSSProperties = {
  ...toggleStyle,
  border: "1px solid rgba(255,255,255,.4)",
  background: "rgba(13, 43, 82, 0.86)",
  color: "#ffffff",
};

const panelStyle: CSSProperties = {
  width: "min(360px, 100%)",
  display: "grid",
  gap: 12,
  padding: 14,
  borderRadius: 16,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.12)",
  boxShadow: "0 18px 40px rgba(13,43,82,.18)",
  color: "#17202a",
  textAlign: "left",
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

const itemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const thumbStyle: CSSProperties = {
  width: 56,
  height: 42,
  borderRadius: 8,
  backgroundSize: "cover",
  backgroundPosition: "center",
  flexShrink: 0,
  border: "1px solid rgba(23,32,42,.1)",
};

const itemActionsStyle: CSSProperties = {
  display: "flex",
  gap: 6,
};

const smallButtonStyle: CSSProperties = {
  padding: "6px 9px",
  borderRadius: 999,
  border: "1px solid rgba(23,32,42,.12)",
  background: "#f8faf7",
  color: "#17202a",
  fontSize: 11,
  fontWeight: 850,
  cursor: "pointer",
};

const removeButtonStyle: CSSProperties = {
  ...smallButtonStyle,
  color: "#9a3d2f",
  borderColor: "rgba(154,61,47,.18)",
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 6,
  fontSize: 11,
  fontWeight: 850,
  color: "#607080",
  letterSpacing: ".06em",
};

const addRowStyle: CSSProperties = {
  display: "flex",
  gap: 6,
};

const inputStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: "9px 10px",
  borderRadius: 12,
  border: "1px solid rgba(23,32,42,.12)",
  background: "#f8faf7",
  color: "#17202a",
  fontSize: 12,
  boxSizing: "border-box",
};

const hintStyle: CSSProperties = {
  margin: 0,
  fontSize: 11,
  lineHeight: 1.55,
  color: "#8d6139",
};
