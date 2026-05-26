"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { City } from "@/data/types";

type LooseCity = City & Record<string, any>;

type EditableCard = {
  id: string;
  kind: "city" | "spot";
  title: string;
  meta: string;
  text: string;
  imageSeed: string;
  href: string;
};

type Props = {
  cities: City[];
};

const STORAGE_KEY = "travelhub-admin-card-drafts-v1";

function toText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : fallback;
}

function getCityText(city: LooseCity) {
  return (
    toText(city.summary) ||
    toText(city.description) ||
    toText(city.reason) ||
    `Open the ${city.city} guide.`
  );
}

function getSpotText(spot: Record<string, any>, city: LooseCity) {
  return (
    toText(spot.summary) ||
    toText(spot.description) ||
    `Open this spot from the ${city.city} guide.`
  );
}

function makeBaseCards(cities: City[]): EditableCard[] {
  const cards: EditableCard[] = [];

  for (const rawCity of cities) {
    const city = rawCity as LooseCity;

    cards.push({
      id: `city:${city.slug}`,
      kind: "city",
      title: city.city,
      meta: city.country,
      text: getCityText(city),
      imageSeed: `city-${city.slug}`,
      href: `/c/${city.slug}`,
    });

    if (Array.isArray(city.spotDetails)) {
      city.spotDetails.slice(0, 12).forEach((spot: Record<string, any>, index: number) => {
        const spotSlug = toText(spot.slug, `spot-${index}`);
        const spotName = toText(spot.name, `Spot ${index + 1}`);

        cards.push({
          id: `spot:${city.slug}:${spotSlug}`,
          kind: "spot",
          title: spotName,
          meta: `${city.city}, ${city.country}`,
          text: getSpotText(spot, city),
          imageSeed: `spot-${city.slug}-${spotSlug}`,
          href: `/c/${city.slug}/spot/${spotSlug}`,
        });
      });
    } else if (Array.isArray(city.stops)) {
      city.stops.slice(0, 6).forEach((stop: string, index: number) => {
        cards.push({
          id: `spot:${city.slug}:stop-${index}`,
          kind: "spot",
          title: stop,
          meta: `${city.city}, ${city.country}`,
          text: `Start with ${stop} when planning ${city.city}.`,
          imageSeed: `spot-${city.slug}-${stop}-${index}`,
          href: `/c/${city.slug}`,
        });
      });
    }
  }

  return cards;
}

function getPreviewImage(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/1000/700`;
}

function mergeDrafts(baseCards: EditableCard[], drafts: Record<string, EditableCard>) {
  return baseCards.map((card) => drafts[card.id] ?? card);
}

export function AdminCardEditor({ cities }: Props) {
  const baseCards = useMemo(() => makeBaseCards(cities), [cities]);

  const [drafts, setDrafts] = useState<Record<string, EditableCard>>({});
  const [selectedId, setSelectedId] = useState(baseCards[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | "city" | "spot">("all");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setDrafts(JSON.parse(saved));
      }
    } catch {
      setDrafts({});
    }
  }, []);

  useEffect(() => {
    if (!selectedId && baseCards[0]) {
      setSelectedId(baseCards[0].id);
    }
  }, [baseCards, selectedId]);

  const cards = useMemo(() => mergeDrafts(baseCards, drafts), [baseCards, drafts]);

  const filteredCards = cards.filter((card) => {
    const matchesKind = kind === "all" || card.kind === kind;
    const search = query.trim().toLowerCase();

    if (!matchesKind) return false;

    if (!search) return true;

    return [card.title, card.meta, card.text, card.href]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });

  const selectedCard =
    cards.find((card) => card.id === selectedId) ?? filteredCards[0] ?? cards[0];

  function updateSelectedCard(update: Partial<EditableCard>) {
    if (!selectedCard) return;

    const nextCard = {
      ...selectedCard,
      ...update,
    };

    setDrafts((current) => ({
      ...current,
      [nextCard.id]: nextCard,
    }));
  }

  function saveDrafts() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  }

  function resetSelected() {
    if (!selectedCard) return;

    setDrafts((current) => {
      const next = { ...current };
      delete next[selectedCard.id];
      return next;
    });
  }

  function resetAll() {
    setDrafts({});
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function copyJson() {
    navigator.clipboard.writeText(JSON.stringify(drafts, null, 2));
  }

  if (!selectedCard) {
    return (
      <div style={emptyStyle}>
        No editable cards were found. Check the city data source.
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      <section style={topBarStyle}>
        <div>
          <div style={eyebrowStyle}>Card editor</div>
          <h1 style={titleStyle}>Edit travel cards</h1>
          <p style={leadStyle}>
            Edit card copy and image seeds as local drafts. This does not change production data yet.
          </p>
        </div>

        <Link href="/admin" style={backStyle}>
          Back to admin
        </Link>
      </section>

      <section style={toolbarStyle}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search cards..."
          style={searchStyle}
        />

        <div style={filterRowStyle}>
          {(["all", "city", "spot"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setKind(value)}
              style={kind === value ? activeFilterStyle : filterStyle}
            >
              {value}
            </button>
          ))}
        </div>
      </section>

      <section style={layoutStyle}>
        <aside style={listStyle}>
          <div style={listHeaderStyle}>
            <span>{filteredCards.length} cards</span>
          </div>

          <div style={scrollListStyle}>
            {filteredCards.map((card) => {
              const isActive = card.id === selectedCard.id;
              const isDraft = Boolean(drafts[card.id]);

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setSelectedId(card.id)}
                  style={isActive ? activeListItemStyle : listItemStyle}
                >
                  <span style={itemKindStyle}>{card.kind}</span>
                  <strong style={itemTitleStyle}>{card.title}</strong>
                  <span style={itemMetaStyle}>{card.meta}</span>
                  {isDraft && <span style={draftBadgeStyle}>Draft</span>}
                </button>
              );
            })}
          </div>
        </aside>

        <section style={editorStyle}>
          <div style={formStyle}>
            <label style={labelStyle}>
              Title
              <input
                value={selectedCard.title}
                onChange={(event) => updateSelectedCard({ title: event.target.value })}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Meta
              <input
                value={selectedCard.meta}
                onChange={(event) => updateSelectedCard({ meta: event.target.value })}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Text
              <textarea
                value={selectedCard.text}
                onChange={(event) => updateSelectedCard({ text: event.target.value })}
                rows={5}
                style={textareaStyle}
              />
            </label>

            <label style={labelStyle}>
              Image seed
              <input
                value={selectedCard.imageSeed}
                onChange={(event) => updateSelectedCard({ imageSeed: event.target.value })}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Link
              <input
                value={selectedCard.href}
                onChange={(event) => updateSelectedCard({ href: event.target.value })}
                style={inputStyle}
              />
            </label>

            <div style={buttonRowStyle}>
              <button type="button" onClick={saveDrafts} style={primaryButtonStyle}>
                Save draft
              </button>

              <button type="button" onClick={resetSelected} style={secondaryButtonStyle}>
                Reset card
              </button>

              <button type="button" onClick={copyJson} style={secondaryButtonStyle}>
                Copy JSON
              </button>

              <button type="button" onClick={resetAll} style={dangerButtonStyle}>
                Reset all
              </button>
            </div>
          </div>

          <div style={previewWrapStyle}>
            <div style={previewLabelStyle}>Preview</div>

            <a href={selectedCard.href} style={previewCardStyle}>
              <div
                style={{
                  ...previewImageStyle,
                  backgroundImage: `linear-gradient(180deg, rgba(10, 18, 24, 0.04) 0%, rgba(10, 18, 24, 0.28) 45%, rgba(10, 18, 24, 0.76) 100%), url("${getPreviewImage(
                    selectedCard.imageSeed
                  )}")`,
                }}
              >
                <div style={previewBadgeStyle}>{selectedCard.meta}</div>

                <div style={previewPanelStyle}>
                  <div style={previewMetaStyle}>{selectedCard.kind} card</div>
                  <h2 style={previewTitleStyle}>{selectedCard.title}</h2>
                  <p style={previewTextStyle}>{selectedCard.text}</p>
                </div>
              </div>
            </a>
          </div>
        </section>
      </section>
    </div>
  );
}

const wrapStyle: CSSProperties = {
  width: "100%",
};

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

const toolbarStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  marginBottom: 18,
};

const searchStyle: CSSProperties = {
  flex: "1 1 280px",
  minWidth: 0,
  padding: "13px 14px",
  borderRadius: 18,
  border: "1px solid rgba(23, 32, 42, 0.08)",
  background: "#ffffff",
  color: "#17202a",
  fontSize: 15,
  outline: "none",
};

const filterRowStyle: CSSProperties = {
  display: "flex",
  gap: 8,
};

const filterStyle: CSSProperties = {
  padding: "9px 12px",
  borderRadius: 999,
  border: "1px solid rgba(23, 32, 42, 0.08)",
  background: "#ffffff",
  color: "#607080",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
};

const activeFilterStyle: CSSProperties = {
  ...filterStyle,
  background: "#f7efe2",
  border: "1px solid rgba(168, 116, 50, 0.18)",
  color: "#9a6a2f",
};

const layoutStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(240px, 320px) minmax(0, 1fr)",
  gap: 18,
  alignItems: "start",
};

const listStyle: CSSProperties = {
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  boxShadow: "0 7px 20px rgba(30, 64, 88, 0.05)",
  overflow: "hidden",
};

const listHeaderStyle: CSSProperties = {
  padding: 14,
  borderBottom: "1px solid rgba(23, 32, 42, 0.08)",
  fontSize: 13,
  color: "#607080",
  fontWeight: 850,
};

const scrollListStyle: CSSProperties = {
  maxHeight: 680,
  overflowY: "auto",
};

const listItemStyle: CSSProperties = {
  width: "100%",
  display: "grid",
  gap: 5,
  padding: 14,
  textAlign: "left",
  border: 0,
  borderBottom: "1px solid rgba(23, 32, 42, 0.06)",
  background: "#ffffff",
  cursor: "pointer",
};

const activeListItemStyle: CSSProperties = {
  ...listItemStyle,
  background: "#fffdf8",
};

const itemKindStyle: CSSProperties = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#9a6a2f",
  fontWeight: 850,
};

const itemTitleStyle: CSSProperties = {
  fontSize: 15,
  color: "#17202a",
};

const itemMetaStyle: CSSProperties = {
  fontSize: 12,
  color: "#607080",
};

const draftBadgeStyle: CSSProperties = {
  width: "fit-content",
  padding: "4px 7px",
  borderRadius: 999,
  background: "#eef8f5",
  color: "#138a72",
  fontSize: 11,
  fontWeight: 850,
};

const editorStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(min(100%, 340px), 0.75fr)",
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

const dangerButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  color: "#9a3d2f",
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
  display: "block",
  color: "inherit",
  textDecoration: "none",
};

const previewImageStyle: CSSProperties = {
  minHeight: 430,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 26,
  overflow: "hidden",
  backgroundColor: "#17202a",
  backgroundSize: "cover",
  backgroundPosition: "center",
  border: "1px solid rgba(255, 255, 255, 0.22)",
  boxShadow: "0 14px 36px rgba(30, 64, 88, 0.16)",
};

const previewBadgeStyle: CSSProperties = {
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

const previewPanelStyle: CSSProperties = {
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

const previewMetaStyle: CSSProperties = {
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

const emptyStyle: CSSProperties = {
  padding: 20,
  borderRadius: 22,
  background: "#fffdf8",
  border: "1px solid rgba(168, 116, 50, 0.14)",
  color: "#607080",
};

