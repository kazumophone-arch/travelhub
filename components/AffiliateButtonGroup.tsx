"use client";

import type { CSSProperties, MouseEvent } from "react";
import type { City } from "@/data/types";
import { getImageBackground } from "@/lib/url-fields";

const CARD_ICON: Record<AffiliatePrimary, string> = {
  hotels: "🛏️",
  tours: "🚩",
};

const CARD_VIEW_LABEL: Record<AffiliatePrimary, string> = {
  hotels: "View stays",
  tours: "View tours",
};

type AffiliateCity = Pick<City, "slug" | "city">;

type AffiliatePrimary = "hotels" | "tours";
type AffiliateTone = "light" | "dark";
type AffiliateVariant =
  | "city"
  | "stay"
  | "tour"
  | "spot-tour"
  | "spot-hotel"
  | "final";

type Props = {
  city: AffiliateCity;
  src?: string;
  v?: string;
  spotSlug?: string;
  primary?: AffiliatePrimary;
  tone?: AffiliateTone;
  variant?: AffiliateVariant;
  showHotels?: boolean;
  showTours?: boolean;
  compact?: boolean;
  hideDisclosure?: boolean;
  layout?: "buttons" | "cards";
  thumbnailUrl?: string;
};

type AffiliateItem = {
  key: AffiliatePrimary;
  href: string;
  label: string;
  title: string;
  note: string;
};

type GtagEventParams = {
  affiliate_type: AffiliatePrimary;
  city_slug: string;
  spot_slug?: string;
  source: string;
  variant: AffiliateVariant;
  value: string;
  event_callback?: () => void;
  event_timeout?: number;
};

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: "affiliate_click",
      params: GtagEventParams
    ) => void;
  }
}

export function AffiliateButtonGroup({
  city,
  src = "site",
  v = "default",
  spotSlug,
  primary = "hotels",
  tone = "light",
  variant = "city",
  showHotels = true,
  showTours = true,
  compact = false,
  hideDisclosure = false,
  layout = "buttons",
  thumbnailUrl,
}: Props) {
  const encodedCity = encodeURIComponent(city.slug);
  const encodedSrc = encodeURIComponent(src);
  const encodedV = encodeURIComponent(v);
  const spotQuery = spotSlug ? `&s=${encodeURIComponent(spotSlug)}` : "";

  const hotelCopy = getHotelCopy(city, variant);
  const tourCopy = getTourCopy(city, variant);

  const items: AffiliateItem[] = [
    ...(showHotels
      ? [
          {
            key: "hotels" as const,
            href: `/out/hotels?c=${encodedCity}&src=${encodedSrc}&v=${encodedV}${spotQuery}`,
            label: "Stays",
            title: hotelCopy.title,
            note: hotelCopy.note,
          },
        ]
      : []),
    ...(showTours
      ? [
          {
            key: "tours" as const,
            href: `/out/tours?c=${encodedCity}&src=${encodedSrc}&v=${encodedV}${spotQuery}`,
            label: "Experiences",
            title: tourCopy.title,
            note: tourCopy.note,
          },
        ]
      : []),
  ];

  if (items.length === 0) {
    return null;
  }

  const orderedItems = [
    ...items.filter((item) => item.key === primary),
    ...items.filter((item) => item.key !== primary),
  ];

  if (layout === "cards") {
    return (
      <div style={cardWrapStyle}>
        {orderedItems.map((item) => (
          <a
            key={item.key}
            href={item.href}
            style={cardStyle}
            onClick={(event) =>
              handleAffiliateClick(event, {
                item,
                citySlug: city.slug,
                spotSlug,
                src,
                variant,
              })
            }
          >
            <div style={cardTextStyle}>
              <span style={cardIconStyle}>{CARD_ICON[item.key]}</span>
              <span style={cardTitleStyle}>{item.title}</span>
              <span style={cardNoteStyle}>{item.note}</span>
              <span style={cardViewLabelStyle}>{CARD_VIEW_LABEL[item.key]} →</span>
            </div>

            <div
              style={{
                ...cardThumbStyle,
                backgroundImage: getImageBackground(
                  thumbnailUrl,
                  "linear-gradient(180deg, rgba(13, 43, 82, 0) 0%, rgba(13, 43, 82, 0.18) 100%)",
                  "linear-gradient(135deg, #eadbc8 0%, #b8936e 52%, #0D2B52 100%)"
                ),
              }}
            />
          </a>
        ))}

        {hideDisclosure ? null : (
          <p style={disclosureStyle}>
            External affiliate links. TravelHub may earn a commission at no extra cost to you.
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      {orderedItems.map((item, index) => {
        const isPrimary = index === 0;
        const buttonStyle = getButtonStyle(isPrimary, tone);
        const arrowStyle = getArrowStyle(isPrimary, tone);
        const labelStyle = getLabelStyle(isPrimary, tone);
        const noteStyle = getNoteStyle(isPrimary, tone);

        return (
          <a
            key={item.key}
            href={item.href}
            style={buttonStyle}
            onClick={(event) =>
              handleAffiliateClick(event, {
                item,
                citySlug: city.slug,
                spotSlug,
                src,
                variant,
              })
            }
          >
            <div style={buttonTextStyle}>
              <span style={labelStyle}>{item.label}</span>
              <span style={titleStyle}>{item.title}</span>
              {compact ? null : <span style={noteStyle}>{item.note}</span>}
            </div>

            <span style={arrowStyle}>→</span>
          </a>
        );
      })}

      {hideDisclosure ? null : (
        <p style={disclosureStyle}>
          External affiliate links. TravelHub may earn a commission at no extra cost to you.
        </p>
      )}
    </div>
  );
}

type AffiliateClickInput = {
  item: AffiliateItem;
  citySlug: string;
  spotSlug?: string;
  src: string;
  variant: AffiliateVariant;
};

function handleAffiliateClick(
  event: MouseEvent<HTMLAnchorElement>,
  { item, citySlug, spotSlug, src, variant }: AffiliateClickInput
) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  event.preventDefault();

  const href = event.currentTarget.href;
  let didNavigate = false;

  const navigate = () => {
    if (didNavigate) return;
    didNavigate = true;
    window.location.href = href;
  };

  window.gtag("event", "affiliate_click", {
    affiliate_type: item.key,
    city_slug: citySlug,
    spot_slug: spotSlug,
    source: src,
    variant,
    value: item.href,
    event_callback: navigate,
    event_timeout: 300,
  });

  window.setTimeout(navigate, 350);
}

function getHotelCopy(city: AffiliateCity, variant: AffiliateVariant) {
  if (variant === "spot-tour" || variant === "spot-hotel") {
    return {
      title: "Find hotels nearby",
      note: "Look for stays close to this part of the city.",
    };
  }

  if (variant === "stay") {
    return {
      title: `View stays in ${city.city}`,
      note: "Choose a base after the guide gives the trip some shape.",
    };
  }

  if (variant === "tour") {
    return {
      title: `View stays in ${city.city}`,
      note: "Keep tour meeting points and daily routes in mind.",
    };
  }

  if (variant === "final") {
    return {
      title: `View stays in ${city.city}`,
      note: "Use the guide first, then choose where to stay.",
    };
  }

  return {
    title: `Find hotels in ${city.city}`,
    note: "Choose a stay once the city starts to take shape.",
  };
}

function getTourCopy(city: AffiliateCity, variant: AffiliateVariant) {
  if (variant === "spot-tour" || variant === "spot-hotel") {
    return {
      title: "Explore tours",
      note: "Look for guided context, tickets, or simple activities.",
    };
  }

  if (variant === "stay") {
    return {
      title: "Explore experiences",
      note: "Add a guided route once your stay area is clear.",
    };
  }

  if (variant === "tour") {
    return {
      title: `Explore tours in ${city.city}`,
      note: "Use a guided route when you want the day connected.",
    };
  }

  if (variant === "final") {
    return {
      title: "Explore experiences",
      note: "Turn places from the guide into an easier route.",
    };
  }

  return {
    title: `Explore tours in ${city.city}`,
    note: "Find guided context when you want the day handled.",
  };
}

function getButtonStyle(isPrimary: boolean, tone: AffiliateTone): CSSProperties {
  if (tone === "dark") {
    return isPrimary ? primaryDarkToneButtonStyle : secondaryDarkToneButtonStyle;
  }

  return isPrimary ? primaryLightToneButtonStyle : secondaryLightToneButtonStyle;
}

function getArrowStyle(isPrimary: boolean, tone: AffiliateTone): CSSProperties {
  if (isPrimary) {
    return arrowOnDarkStyle;
  }

  return tone === "dark" ? arrowOnWarmStyle : arrowOnWhiteStyle;
}

function getLabelStyle(isPrimary: boolean, tone: AffiliateTone): CSSProperties {
  const isLightSecondary = !isPrimary && tone === "light";

  return {
    ...baseLabelStyle,
    color: isPrimary ? "rgba(255, 255, 255, 0.7)" : "#BF9B30",
    opacity: isLightSecondary ? 0.9 : 1,
  };
}

function getNoteStyle(isPrimary: boolean, tone: AffiliateTone): CSSProperties {
  return {
    ...noteStyle,
    color: isPrimary
      ? "rgba(255, 255, 255, 0.78)"
      : tone === "dark"
        ? "rgba(255, 255, 255, 0.7)"
        : "#6B87A8",
  };
}

const wrapStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

const cardWrapStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const cardStyle: CSSProperties = {
  display: "flex",
  alignItems: "stretch",
  gap: 16,
  padding: 18,
  borderRadius: 10,
  background: "#FFF8E6",
  border: "1px solid #E8D080",
  textDecoration: "none",
  color: "#0D2B52",
};

const cardTextStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  flex: 1,
  minWidth: 0,
};

const cardIconStyle: CSSProperties = {
  fontSize: 20,
  lineHeight: 1,
};

const cardTitleStyle: CSSProperties = {
  fontSize: 17,
  lineHeight: 1.2,
  fontWeight: 800,
};

const cardNoteStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.5,
  color: "#6B87A8",
};

const cardViewLabelStyle: CSSProperties = {
  marginTop: "auto",
  fontSize: 12,
  fontWeight: 850,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "#BF9B30",
};

const cardThumbStyle: CSSProperties = {
  flexShrink: 0,
  width: 110,
  borderRadius: 8,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const baseButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  minHeight: 52,
  padding: "10px 12px 10px 14px",
  borderRadius: 6,
  textDecoration: "none",
  border: "1px solid transparent",
};

const primaryLightToneButtonStyle: CSSProperties = {
  ...baseButtonStyle,
  background: "#BF9B30",
  color: "#FFFFFF",
  borderColor: "#BF9B30",
  boxShadow: "0 8px 18px rgba(191, 155, 48, 0.22)",
};

const secondaryLightToneButtonStyle: CSSProperties = {
  ...baseButtonStyle,
  background: "#F0F4FA",
  color: "#0D2B52",
  borderColor: "#D8E2F0",
};

const primaryDarkToneButtonStyle: CSSProperties = {
  ...baseButtonStyle,
  background: "#BF9B30",
  color: "#FFFFFF",
  borderColor: "#BF9B30",
  boxShadow: "0 8px 18px rgba(0, 0, 0, 0.12)",
};

const secondaryDarkToneButtonStyle: CSSProperties = {
  ...baseButtonStyle,
  background: "rgba(255, 255, 255, 0.96)",
  color: "#0D2B52",
  borderColor: "#D8E2F0",
};

const buttonTextStyle: CSSProperties = {
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: 3,
};

const baseLabelStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: 0,
  textTransform: "uppercase",
  fontWeight: 850,
};

const arrowOnDarkStyle: CSSProperties = {
  width: 30,
  height: 30,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.22)",
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: 850,
};

const arrowOnWarmStyle: CSSProperties = {
  width: 30,
  height: 30,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "rgba(191, 155, 48, 0.16)",
  color: "#0D2B52",
  fontSize: 14,
  fontWeight: 850,
};

const arrowOnWhiteStyle: CSSProperties = {
  width: 30,
  height: 30,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "#F0F4FA",
  color: "#0D2B52",
  fontSize: 14,
  fontWeight: 850,
};

const titleStyle: CSSProperties = {
  fontSize: 15,
  lineHeight: 1.18,
  letterSpacing: 0,
  fontWeight: 850,
};

const noteStyle: CSSProperties = {
  fontSize: 12,
  lineHeight: 1.35,
  fontWeight: 650,
};

const disclosureStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "inherit",
  fontSize: 11,
  lineHeight: 1.45,
  opacity: 0.6,
};







