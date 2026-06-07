"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

type AdminTag = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_rank: number | null;
};

type TagsResponse = {
  tags?: AdminTag[];
  error?: string;
};

type AdminTagSelectorProps = {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  label?: string;
  helperText?: string;
};

export function AdminTagSelector({
  selectedTagIds,
  onChange,
  label = "管理タグ",
  helperText = "公開ページにはまだ表示されません。データ整理用のタグです。",
}: AdminTagSelectorProps) {
  const [tags, setTags] = useState<AdminTag[]>([]);
  const [status, setStatus] = useState("タグを読み込み中...");
  const selectedSet = new Set(selectedTagIds);
  const selectedTags = tags.filter((tag) => selectedSet.has(tag.id));
  const unknownSelectedCount = status
    ? 0
    : selectedTagIds.filter((tagId) => !tags.some((tag) => tag.id === tagId))
        .length;

  useEffect(() => {
    async function loadTags() {
      try {
        const response = await fetch("/api/admin/tags?active=true");
        const data = (await response.json()) as TagsResponse;

        if (!response.ok) {
          setStatus(data.error ?? "タグの読み込みに失敗しました。");
          return;
        }

        setTags(data.tags ?? []);
        setStatus("");
      } catch {
        setStatus("タグの読み込みに失敗しました。");
      }
    }

    loadTags();
  }, []);

  function toggleTag(tagId: string) {
    if (selectedSet.has(tagId)) {
      onChange(selectedTagIds.filter((currentTagId) => currentTagId !== tagId));
      return;
    }

    onChange([...selectedTagIds, tagId]);
  }

  return (
    <section style={wrapStyle}>
      <div style={headerStyle}>
        <div>
          <div style={labelStyle}>{label}</div>
          <p style={helperStyle}>{helperText}</p>
        </div>

        <Link href="/admin/tags" style={manageLinkStyle}>
          タグ管理
        </Link>
      </div>

      {status ? <div style={noteStyle}>{status}</div> : null}

      {!status && tags.length === 0 ? (
        <div style={noteStyle}>
          有効なタグがまだありません。タグ管理で作成してから選択できます。
        </div>
      ) : null}

      {tags.length > 0 ? (
        <div style={optionGridStyle}>
          {tags.map((tag) => {
            const isSelected = selectedSet.has(tag.id);

            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                style={isSelected ? selectedOptionStyle : optionStyle}
                aria-pressed={isSelected}
              >
                <span style={optionNameStyle}>{tag.name}</span>
                <code style={optionSlugStyle}>{tag.slug}</code>
              </button>
            );
          })}
        </div>
      ) : null}

      <div style={selectedWrapStyle}>
        <div style={selectedTitleStyle}>選択中</div>
        {!status && selectedTags.length === 0 && unknownSelectedCount === 0 ? (
          <div style={emptySelectedStyle}>タグは未選択です。</div>
        ) : null}

        {selectedTags.length > 0 ? (
          <div style={chipRowStyle}>
            {selectedTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                style={chipStyle}
                aria-label={`${tag.name} を解除`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        ) : null}

        {!status && unknownSelectedCount > 0 ? (
          <div style={archivedNoteStyle}>
            アーカイブ済み、または現在選択できないタグが {unknownSelectedCount} 件あります。
          </div>
        ) : null}
      </div>
    </section>
  );
}

const wrapStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  marginBottom: 16,
  padding: 14,
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
};

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 10,
};

const labelStyle: CSSProperties = {
  color: "#17202a",
  fontSize: 13,
  fontWeight: 850,
};

const helperStyle: CSSProperties = {
  margin: "5px 0 0",
  color: "#607080",
  fontSize: 12,
  lineHeight: 1.55,
};

const manageLinkStyle: CSSProperties = {
  flex: "0 0 auto",
  padding: "7px 10px",
  borderRadius: 999,
  background: "#f7efe2",
  color: "#9a6a2f",
  border: "1px solid rgba(168,116,50,.18)",
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 850,
};

const noteStyle: CSSProperties = {
  padding: 12,
  borderRadius: 14,
  background: "#f8faf7",
  color: "#607080",
  fontSize: 12,
  lineHeight: 1.55,
};

const optionGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
  gap: 8,
};

const optionStyle: CSSProperties = {
  display: "grid",
  gap: 4,
  minHeight: 58,
  padding: "9px 10px",
  borderRadius: 14,
  border: "1px solid rgba(23,32,42,.08)",
  background: "#f8faf7",
  color: "#17202a",
  textAlign: "left",
  cursor: "pointer",
};

const selectedOptionStyle: CSSProperties = {
  ...optionStyle,
  border: "1px solid rgba(19,138,114,.3)",
  background: "#e8f7ef",
};

const optionNameStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 850,
};

const optionSlugStyle: CSSProperties = {
  color: "#607080",
  fontSize: 11,
  overflowWrap: "anywhere",
};

const selectedWrapStyle: CSSProperties = {
  display: "grid",
  gap: 7,
};

const selectedTitleStyle: CSSProperties = {
  color: "#607080",
  fontSize: 12,
  fontWeight: 850,
};

const emptySelectedStyle: CSSProperties = {
  color: "#607080",
  fontSize: 12,
};

const chipRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
};

const chipStyle: CSSProperties = {
  padding: "6px 9px",
  borderRadius: 999,
  border: "1px solid rgba(19,138,114,.2)",
  background: "#e8f7ef",
  color: "#126b43",
  fontSize: 12,
  fontWeight: 850,
  cursor: "pointer",
};

const archivedNoteStyle: CSSProperties = {
  padding: 10,
  borderRadius: 14,
  background: "#fff4df",
  color: "#9a5b12",
  border: "1px solid rgba(154,91,18,.16)",
  fontSize: 12,
  lineHeight: 1.55,
};
