"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { City } from "@/data/types";

type LooseCity = City & Record<string, any>;

type SpotDraft = {
  id: string;
  citySlug: string;
  cityName: string;
  country: string;
  name: string;
  slug: string;
  summary: string;
  categories: string[];
  imageSeed: string;
  canOpen: boolean;
};

type Props = {
  cities: City[];
};

const STORAGE_KEY = "travelhub-admin-new-spot-drafts-v1";

function makeId() {
  return `spot-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getImageUrl(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/1000/700`;
}

function escapeTs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function makeTsSnippet(draft: SpotDraft) {
  return `{
  name: "${escapeTs(draft.name)}",
  slug: "${draft.slug}",
  summary: "${escapeTs(draft.summary)}",
}`;
}

export function AdminSpotCreator({ cities }: Props) {
  const cityList = useMemo(
    () =>
      cities
        .map((city) => city as LooseCity)
        .filter((city) => city.slug && city.city)
        .sort((a, b) => String(a.city).localeCompare(String(b.city))),
    [cities]
  );

  const firstCity = cityList[0];

  const [draftId, setDraftId] = useState(makeId);
  const [citySlug, setCitySlug] = useState(firstCity?.slug ?? "");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [imageSeed, setImageSeed] = useState("");
  const [canOpen, setCanOpen] = useState(true);
  const [drafts, setDrafts] = useState<SpotDraft[]>([]);
  const [publishStatus, setPublishStatus] = useState("");
  const [publishedHref, setPublishedHref] = useState("");

  const selectedCity =
    cityList.find((city) => city.slug === citySlug) ?? firstCity;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setDrafts(JSON.parse(saved));
      }
    } catch {
      setDrafts([]);
    }
  }, []);

  useEffect(() => {
    if (!citySlug && firstCity?.slug) {
      setCitySlug(firstCity.slug);
    }
  }, [citySlug, firstCity]);

  useEffect(() => {
    if (!slug && name.trim()) {
      setSlug(slugify(name));
    }
  }, [name, slug]);

  const categories = categoryInput
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const safeSlug = slugify(slug || name || "new-spot");
  const safeImageSeed =
    imageSeed.trim() || `spot-${selectedCity?.slug ?? "city"}-${safeSlug}`;

  const currentDraft: SpotDraft = {
    id: draftId,
    citySlug: selectedCity?.slug ?? "",
    cityName: selectedCity?.city ?? "",
    country: selectedCity?.country ?? "",
    name: name.trim() || "New spot",
    slug: safeSlug,
    summary:
      summary.trim() || "Add a short reason why this spot is worth visiting.",
    categories,
    imageSeed: safeImageSeed,
    canOpen,
  };

  function persistDrafts(nextDrafts: SpotDraft[]) {
    setDrafts(nextDrafts);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDrafts));
  }

  function saveDraft() {
    const exists = drafts.some((draft) => draft.id === currentDraft.id);
    const nextDrafts = exists
      ? drafts.map((draft) =>
          draft.id === currentDraft.id ? currentDraft : draft
        )
      : [currentDraft, ...drafts];

    persistDrafts(nextDrafts);
    setPublishStatus("Entry saved in this browser.");
  }

  async function publishToLocalData() {
    setPublishStatus("Publishing...");

    try {
      const response = await fetch("/api/admin/spots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentDraft),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to publish spot.");
      }

      saveDraft();
      setPublishStatus("Exported to the legacy data file.");
      setPublishedHref(`/c/${currentDraft.citySlug}/spot/${currentDraft.slug}`);
    } catch (error) {
      setPublishStatus(
        error instanceof Error ? error.message : "Failed to publish spot."
      );
    }
  }

  function loadDraft(draft: SpotDraft) {
    setDraftId(draft.id);
    setCitySlug(draft.citySlug);
    setName(draft.name);
    setSlug(draft.slug);
    setSummary(draft.summary);
    setCategoryInput(draft.categories.join(", "));
    setImageSeed(draft.imageSeed);
    setCanOpen(draft.canOpen);
    setPublishStatus("");
    setPublishedHref("");
  }

  function newDraft() {
    setDraftId(makeId());
    setName("");
    setSlug("");
    setSummary("");
    setCategoryInput("");
    setImageSeed("");
    setCanOpen(true);
    setPublishStatus("");
    setPublishedHref("");
  }

  function deleteDraft(id: string) {
    const nextDrafts = drafts.filter((draft) => draft.id !== id);
    persistDrafts(nextDrafts);

    if (id === draftId) {
      newDraft();
    }
  }

  function copyJson() {
    navigator.clipboard.writeText(JSON.stringify(currentDraft, null, 2));
    setPublishStatus("Entry data copied.");
  }

  function copyTsSnippet() {
    navigator.clipboard.writeText(makeTsSnippet(currentDraft));
    setPublishStatus("TypeScript snippet copied.");
  }

  if (!selectedCity) {
    return (
      <div style={emptyStyle}>
        No cities were found. Add city data before creating spots.
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      <section style={topBarStyle}>
        <div>
          <div style={eyebrowStyle}>Spot creator</div>
          <h1 style={titleStyle}>Create a new spot</h1>
          <p style={leadStyle}>
            Compose legacy spot entries, preview the card, and export them for
            the old static-data workflow. Use the Supabase spot admin for current publishing.
          </p>
        </div>

        <Link href="/admin" style={backStyle}>
          Back to admin
        </Link>
      </section>

      <section style={layoutStyle}>
        <aside style={draftListStyle}>
          <div style={draftHeaderStyle}>
            <span>{drafts.length} saved entries</span>
            <button type="button" onClick={newDraft} style={smallButtonStyle}>
              New
            </button>
          </div>

          <div style={draftScrollStyle}>
            {drafts.length === 0 ? (
              <div style={emptyListStyle}>No saved entries yet.</div>
            ) : (
              drafts.map((draft) => (
                <div key={draft.id} style={draftItemWrapStyle}>
                  <button
                    type="button"
                    onClick={() => loadDraft(draft)}
                    style={
                      draft.id === draftId ? activeDraftItemStyle : draftItemStyle
                    }
                  >
                    <span style={draftCityStyle}>{draft.cityName}</span>
                    <strong style={draftTitleStyle}>{draft.name}</strong>
                    <span style={draftMetaStyle}>/{draft.slug}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteDraft(draft.id)}
                    style={deleteMiniStyle}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </aside>

        <section style={formWrapStyle}>
          <div style={formStyle}>
            <label style={labelStyle}>
              City
              <select
                value={citySlug}
                onChange={(event) => {
                  setCitySlug(event.target.value);
                  setImageSeed("");
                }}
                style={inputStyle}
              >
                {cityList.map((city) => (
                  <option key={city.slug} value={city.slug}>
                    {city.city}, {city.country}
                  </option>
                ))}
              </select>
            </label>

            <label style={labelStyle}>
              Spot name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Trevi Fountain"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Slug
              <input
                value={slug}
                onChange={(event) => setSlug(slugify(event.target.value))}
                placeholder="trevi-fountain"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Summary
              <textarea
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="A short, useful description for the card."
                rows={5}
                style={textareaStyle}
              />
            </label>

            <label style={labelStyle}>
              Categories
              <input
                value={categoryInput}
                onChange={(event) => setCategoryInput(event.target.value)}
                placeholder="Landmark, Historic, Photo spot"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Image seed
              <input
                value={imageSeed}
                onChange={(event) => setImageSeed(event.target.value)}
                placeholder="spot-rome-it-trevi-fountain"
                style={inputStyle}
              />
            </label>

            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                checked={canOpen}
                onChange={(event) => setCanOpen(event.target.checked)}
              />
              Create as openable spot detail page
            </label>

            <div style={buttonRowStyle}>
              <button type="button" onClick={publishToLocalData} style={primaryButtonStyle}>
                Export legacy entry
              </button>

              <button type="button" onClick={saveDraft} style={secondaryButtonStyle}>
                Save entry
              </button>

              <button type="button" onClick={copyJson} style={secondaryButtonStyle}>
                Copy entry data
              </button>

              <button type="button" onClick={copyTsSnippet} style={secondaryButtonStyle}>
                Copy TS snippet
              </button>
            </div>

            {publishStatus && <div style={statusStyle}>{publishStatus}</div>}

            {publishedHref && (
              <Link href={publishedHref} style={viewPublishedStyle}>
                View published spot →
              </Link>
            )}
          </div>

          <section style={previewWrapStyle}>
            <div style={previewLabelStyle}>Preview</div>

            <div
              style={{
                ...previewCardStyle,
                backgroundImage: `linear-gradient(180deg, rgba(10, 18, 24, 0.04) 0%, rgba(10, 18, 24, 0.28) 45%, rgba(10, 18, 24, 0.76) 100%), url("${getImageUrl(
                  currentDraft.imageSeed
                )}")`,
              }}
            >
              <div style={badgeStyle}>
                {currentDraft.cityName}, {currentDraft.country}
              </div>

              <div style={panelStyle}>
                <div style={metaStyle}>Spot preview</div>
                <h2 style={previewTitleStyle}>{currentDraft.name}</h2>
                <p style={previewTextStyle}>{currentDraft.summary}</p>

                {currentDraft.categories.length > 0 && (
                  <div style={chipRowStyle}>
                    {currentDraft.categories.slice(0, 3).map((tag) => (
                      <span key={tag} style={chipStyle}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={outputBoxStyle}>
              <div style={outputTitleStyle}>Generated path</div>
              <code style={codeStyle}>
                /c/{currentDraft.citySlug}/spot/{currentDraft.slug}
              </code>
            </div>

            <div style={outputBoxStyle}>
              <div style={outputTitleStyle}>TS snippet</div>
              <pre style={preStyle}>{makeTsSnippet(currentDraft)}</pre>
            </div>
          </section>
        </section>
      </section>
    </div>
  );
}

const wrapStyle: CSSProperties = { width: "100%" };

const topBarStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: 18,
  flexWrap: "wrap",
  marginBottom: 22,
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "#f7efe2",
  border: "1px solid rgba(168, 116, 50, 0.16)",
  color: "#9a6a2f",
  fontSize: 12,
  letterSpacing: "0.13em",
  textTransform: "uppercase",
  fontWeight: 850,
};

const titleStyle: CSSProperties = {
  margin: "0 0 10px",
  fontSize: "clamp(36px, 8vw, 58px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const leadStyle: CSSProperties = {
  margin: 0,
  maxWidth: 720,
  fontSize: 15,
  lineHeight: 1.75,
  color: "#607080",
};

const backStyle: CSSProperties = {
  display: "inline-flex",
  padding: "10px 14px",
  borderRadius: 999,
  background: "#eef8f5",
  border: "1px solid rgba(19, 138, 114, 0.14)",
  color: "#138a72",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
};

const layoutStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(240px, 320px) minmax(0, 1fr)",
  gap: 18,
  alignItems: "start",
};

const draftListStyle: CSSProperties = {
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  boxShadow: "0 7px 20px rgba(30, 64, 88, 0.05)",
  overflow: "hidden",
};

const draftHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  alignItems: "center",
  padding: 14,
  borderBottom: "1px solid rgba(23, 32, 42, 0.08)",
  fontSize: 13,
  color: "#607080",
  fontWeight: 850,
};

const draftScrollStyle: CSSProperties = {
  maxHeight: 720,
  overflowY: "auto",
};

const emptyListStyle: CSSProperties = {
  padding: 14,
  color: "#607080",
  fontSize: 13,
};

const draftItemWrapStyle: CSSProperties = {
  borderBottom: "1px solid rgba(23, 32, 42, 0.06)",
};

const draftItemStyle: CSSProperties = {
  width: "100%",
  display: "grid",
  gap: 5,
  padding: 14,
  textAlign: "left",
  border: 0,
  background: "#ffffff",
  cursor: "pointer",
};

const activeDraftItemStyle: CSSProperties = {
  ...draftItemStyle,
  background: "#fffdf8",
};

const deleteMiniStyle: CSSProperties = {
  margin: "0 14px 12px",
  padding: "6px 9px",
  borderRadius: 999,
  border: "1px solid rgba(154, 61, 47, 0.16)",
  background: "#ffffff",
  color: "#9a3d2f",
  fontSize: 12,
  fontWeight: 850,
  cursor: "pointer",
};

const draftCityStyle: CSSProperties = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#9a6a2f",
  fontWeight: 850,
};

const draftTitleStyle: CSSProperties = {
  fontSize: 15,
  color: "#17202a",
};

const draftMetaStyle: CSSProperties = {
  fontSize: 12,
  color: "#607080",
};

const smallButtonStyle: CSSProperties = {
  padding: "7px 9px",
  borderRadius: 999,
  border: "1px solid rgba(19, 138, 114, 0.14)",
  background: "#eef8f5",
  color: "#138a72",
  fontSize: 12,
  fontWeight: 850,
  cursor: "pointer",
};

const formWrapStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(min(100%, 360px), 0.75fr)",
  gap: 18,
  alignItems: "start",
};

const formStyle: CSSProperties = {
  padding: 18,
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  boxShadow: "0 7px 20px rgba(30, 64, 88, 0.05)",
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 7,
  marginBottom: 14,
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#607080",
  fontWeight: 850,
};

const inputStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  padding: "12px 13px",
  borderRadius: 16,
  border: "1px solid rgba(23, 32, 42, 0.08)",
  background: "#f8faf7",
  color: "#17202a",
  fontSize: 14,
  outline: "none",
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  lineHeight: 1.55,
};

const checkboxLabelStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 9,
  marginTop: 6,
  fontSize: 13,
  color: "#607080",
  fontWeight: 750,
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 9,
  marginTop: 16,
};

const primaryButtonStyle: CSSProperties = {
  padding: "10px 13px",
  borderRadius: 999,
  border: "1px solid rgba(19, 138, 114, 0.18)",
  background: "#138a72",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
};

const secondaryButtonStyle: CSSProperties = {
  padding: "10px 13px",
  borderRadius: 999,
  border: "1px solid rgba(23, 32, 42, 0.08)",
  background: "#ffffff",
  color: "#607080",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
};

const statusStyle: CSSProperties = {
  marginTop: 12,
  padding: "10px 12px",
  borderRadius: 16,
  background: "#eef8f5",
  border: "1px solid rgba(19, 138, 114, 0.14)",
  color: "#138a72",
  fontSize: 13,
  fontWeight: 850,
};

const previewWrapStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const previewLabelStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#9a6a2f",
  fontWeight: 850,
};

const previewCardStyle: CSSProperties = {
  position: "relative",
  minHeight: 430,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 26,
  overflow: "hidden",
  color: "#ffffff",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "#17202a",
  border: "1px solid rgba(255, 255, 255, 0.22)",
  boxShadow: "0 14px 36px rgba(30, 64, 88, 0.16)",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  zIndex: 3,
  maxWidth: "calc(100% - 28px)",
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(255, 255, 255, 0.28)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const panelStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  margin: 12,
  padding: 16,
  borderRadius: 20,
  background: "rgba(12, 22, 30, 0.54)",
  border: "1px solid rgba(255, 255, 255, 0.24)",
  boxShadow: "0 10px 26px rgba(0, 0, 0, 0.14)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const metaStyle: CSSProperties = {
  marginBottom: 7,
  fontSize: 12,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(255, 255, 255, 0.76)",
  fontWeight: 850,
};

const previewTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(24px, 5.8vw, 30px)",
  lineHeight: 1.04,
  letterSpacing: "-0.045em",
  color: "#ffffff",
  fontWeight: 850,
  textShadow: "0 1px 10px rgba(0, 0, 0, 0.26)",
};

const previewTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "rgba(255, 255, 255, 0.84)",
};

const chipRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 7,
  marginTop: 14,
};

const chipStyle: CSSProperties = {
  padding: "7px 9px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.16)",
  color: "#ffffff",
  border: "1px solid rgba(255, 255, 255, 0.22)",
  fontSize: 12,
  fontWeight: 800,
};

const outputBoxStyle: CSSProperties = {
  padding: 14,
  borderRadius: 20,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
};

const outputTitleStyle: CSSProperties = {
  marginBottom: 8,
  fontSize: 12,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#9a6a2f",
  fontWeight: 850,
};

const codeStyle: CSSProperties = {
  display: "block",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  fontSize: 13,
  color: "#17202a",
};

const preStyle: CSSProperties = {
  margin: 0,
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
  fontSize: 12,
  lineHeight: 1.5,
  color: "#17202a",
};

const emptyStyle: CSSProperties = {
  padding: 20,
  borderRadius: 22,
  background: "#fffdf8",
  border: "1px solid rgba(168, 116, 50, 0.14)",
  color: "#607080",
};

const viewPublishedStyle: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  marginTop: 10,
  padding: "10px 13px",
  borderRadius: 999,
  background: "#17202a",
  border: "1px solid rgba(23, 32, 42, 0.12)",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
};
