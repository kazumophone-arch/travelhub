"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { slugify } from "@/lib/admin-validation";

type AdminTag = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_rank: number | null;
  created_at: string;
  updated_at: string;
};

type TagFormState = {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  sortRank: string;
};

type TagResponse = {
  tag?: AdminTag;
  tags?: AdminTag[];
  error?: string;
};

type Filter = "all" | "active" | "archived";

const emptyForm: TagFormState = {
  id: "",
  name: "",
  slug: "",
  description: "",
  isActive: true,
  sortRank: "",
};

export function AdminTagManager() {
  const [tags, setTags] = useState<AdminTag[]>([]);
  const [form, setForm] = useState<TagFormState>(emptyForm);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("読み込み中...");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadTags() {
      try {
        const response = await fetch("/api/admin/tags");
        const data = (await response.json()) as TagResponse;

        if (!response.ok) {
          setStatus(data.error ?? "タグの読み込みに失敗しました。");
          return;
        }

        setTags(sortTags(data.tags ?? []));
        setStatus("");
      } catch {
        setStatus("タグの読み込みに失敗しました。");
      }
    }

    loadTags();
  }, []);

  const filteredTags = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);

    return tags.filter((tag) => {
      if (filter === "active" && !tag.is_active) return false;
      if (filter === "archived" && tag.is_active) return false;
      if (!normalizedQuery) return true;

      return [tag.name, tag.slug, tag.description].some((value) =>
        normalizeSearch(value).includes(normalizedQuery)
      );
    });
  }, [filter, query, tags]);

  const summaryItems = useMemo(() => {
    const activeCount = tags.filter((tag) => tag.is_active).length;

    return [
      { label: "タグ数", value: tags.length },
      { label: "有効", value: activeCount },
      { label: "アーカイブ", value: tags.length - activeCount },
    ];
  }, [tags]);

  const isEditing = Boolean(form.id);

  function updateForm(field: keyof TagFormState, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleNameChange(value: string) {
    setForm((current) => ({
      ...current,
      name: value,
      slug: current.slug ? current.slug : slugify(value),
    }));
  }

  function editTag(tag: AdminTag) {
    setForm({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      description: tag.description ?? "",
      isActive: tag.is_active,
      sortRank: tag.sort_rank === null ? "" : String(tag.sort_rank),
    });
    setStatus("");
  }

  function resetForm() {
    setForm(emptyForm);
  }

  async function submitTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus("");

    const method = isEditing ? "PATCH" : "POST";
    const response = await fetch("/api/admin/tags", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const data = (await response.json()) as TagResponse;

    setIsSaving(false);

    if (!response.ok || !data.tag) {
      setStatus(data.error ?? "タグの保存に失敗しました。");
      return;
    }

    const savedTag = data.tag;

    setTags((current) => upsertTag(current, savedTag));
    resetForm();
    setStatus("タグを保存しました。");
  }

  async function archiveTag(tag: AdminTag) {
    const ok = window.confirm("このタグをアーカイブしますか？");
    if (!ok) return;

    const response = await fetch(
      `/api/admin/tags?id=${encodeURIComponent(tag.id)}`,
      { method: "DELETE" }
    );
    const data = (await response.json()) as TagResponse;

    if (!response.ok || !data.tag) {
      setStatus(data.error ?? "タグのアーカイブに失敗しました。");
      return;
    }

    const archivedTag = data.tag;

    setTags((current) => upsertTag(current, archivedTag));
    if (form.id === tag.id) resetForm();
    setStatus("タグをアーカイブしました。");
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

      <form onSubmit={submitTag} style={formStyle}>
        <div>
          <div style={formTitleStyle}>
            {isEditing ? "タグを編集" : "新しいタグ"}
          </div>
          <p style={formTextStyle}>
            V1では管理用データとして保存します。公開ページにはまだ表示されません。
          </p>
        </div>

        <label style={fieldStyle}>
          <span style={labelStyle}>タグ名</span>
          <input
            value={form.name}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="Historic streets"
            style={inputStyle}
            required
          />
        </label>

        <label style={fieldStyle}>
          <span style={labelStyle}>スラッグ</span>
          <input
            value={form.slug}
            onChange={(event) => updateForm("slug", event.target.value)}
            placeholder="historic-streets"
            style={inputStyle}
            required
          />
        </label>

        <label style={fieldStyle}>
          <span style={labelStyle}>説明</span>
          <textarea
            value={form.description}
            onChange={(event) => updateForm("description", event.target.value)}
            placeholder="管理用メモやタグの意味"
            style={textareaStyle}
            rows={3}
          />
        </label>

        <label style={fieldStyle}>
          <span style={labelStyle}>表示順</span>
          <input
            type="number"
            value={form.sortRank}
            onChange={(event) => updateForm("sortRank", event.target.value)}
            placeholder="10"
            style={inputStyle}
          />
        </label>

        <label style={checkboxStyle}>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => updateForm("isActive", event.target.checked)}
          />
          <span>有効なタグとして扱う</span>
        </label>

        <div style={buttonRowStyle}>
          <button type="submit" disabled={isSaving} style={primaryButtonStyle}>
            {isSaving ? "保存中..." : isEditing ? "更新する" : "作成する"}
          </button>

          {isEditing ? (
            <button type="button" onClick={resetForm} style={secondaryButtonStyle}>
              キャンセル
            </button>
          ) : null}
        </div>
      </form>

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="タグ名・slug・説明で検索"
        style={searchInputStyle}
      />

      <div style={filterRowStyle}>
        {(["all", "active", "archived"] as const).map((value) => (
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

      {!status && filteredTags.length === 0 && (
        <div style={emptyStyle}>タグが見つかりません。</div>
      )}

      <div style={listStyle}>
        {filteredTags.map((tag) => (
          <div key={tag.id} style={itemStyle}>
            <div>
              <div style={metaStyle}>
                {tag.is_active ? "有効" : "アーカイブ"}
                {tag.sort_rank === null ? "" : ` · 表示順 ${tag.sort_rank}`}
              </div>

              <h2 style={titleStyle}>{tag.name}</h2>

              {tag.description ? (
                <p style={textStyle}>{tag.description}</p>
              ) : (
                <p style={textStyle}>説明はまだありません。</p>
              )}

              <code style={codeStyle}>{tag.slug}</code>

              <div style={badgeRowStyle}>
                <Badge
                  label={tag.is_active ? "有効" : "アーカイブ"}
                  tone={tag.is_active ? "ok" : "missing"}
                />
                <Badge label="公開未使用" tone="neutral" />
              </div>
            </div>

            <div style={buttonRowStyle}>
              <button type="button" onClick={() => editTag(tag)} style={buttonStyle}>
                編集
              </button>

              {tag.is_active ? (
                <button
                  type="button"
                  onClick={() => archiveTag(tag)}
                  style={deleteButtonStyle}
                >
                  アーカイブ
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function upsertTag(tags: AdminTag[], tag: AdminTag) {
  const next = tags.some((current) => current.id === tag.id)
    ? tags.map((current) => (current.id === tag.id ? tag : current))
    : [tag, ...tags];

  return sortTags(next);
}

function sortTags(tags: AdminTag[]) {
  return [...tags].sort((a, b) => {
    if (a.is_active !== b.is_active) return a.is_active ? -1 : 1;

    const rankA = a.sort_rank ?? Number.MAX_SAFE_INTEGER;
    const rankB = b.sort_rank ?? Number.MAX_SAFE_INTEGER;

    if (rankA !== rankB) return rankA - rankB;

    return a.name.localeCompare(b.name);
  });
}

function getFilterLabel(filter: Filter) {
  if (filter === "active") return "有効";
  if (filter === "archived") return "アーカイブ";
  return "すべて";
}

function Badge({
  label,
  tone,
}: {
  label: string;
  tone: "ok" | "missing" | "neutral";
}) {
  return <span style={getBadgeStyle(tone)}>{label}</span>;
}

function getBadgeStyle(tone: "ok" | "missing" | "neutral"): CSSProperties {
  if (tone === "ok") return { ...badgeStyle, ...okBadgeStyle };
  if (tone === "missing") return { ...badgeStyle, ...missingBadgeStyle };
  return { ...badgeStyle, ...neutralBadgeStyle };
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

const formStyle: CSSProperties = {
  display: "grid",
  gap: 14,
  marginBottom: 18,
  padding: 18,
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
  boxShadow: "0 8px 24px rgba(30,64,88,.05)",
};

const formTitleStyle: CSSProperties = {
  marginBottom: 6,
  fontSize: 22,
  fontWeight: 900,
};

const formTextStyle: CSSProperties = {
  margin: 0,
  color: "#607080",
  fontSize: 14,
  lineHeight: 1.6,
};

const fieldStyle: CSSProperties = {
  display: "grid",
  gap: 6,
};

const labelStyle: CSSProperties = {
  color: "#17202a",
  fontSize: 13,
  fontWeight: 850,
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 13px",
  borderRadius: 16,
  border: "1px solid rgba(23,32,42,.1)",
  background: "#ffffff",
  color: "#17202a",
  fontSize: 14,
  outline: "none",
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  minHeight: 94,
  resize: "vertical",
};

const checkboxStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#17202a",
  fontSize: 13,
  fontWeight: 850,
};

const searchInputStyle: CSSProperties = {
  ...inputStyle,
  marginBottom: 12,
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
  letterSpacing: 0,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  letterSpacing: 0,
};

const textStyle: CSSProperties = {
  margin: "8px 0 10px",
  fontSize: 14,
  lineHeight: 1.6,
  color: "#607080",
};

const codeStyle: CSSProperties = {
  display: "block",
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
  border: "1px solid rgba(19,138,114,.16)",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
};

const primaryButtonStyle: CSSProperties = {
  ...buttonStyle,
};

const secondaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "#ffffff",
  color: "#138a72",
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

const emptyStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: "#fffdf8",
  border: "1px solid rgba(168,116,50,.14)",
  color: "#607080",
};
