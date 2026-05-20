import Link from "next/link";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";

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
  city: City;
  src?: string;
  v?: string;
  primary?: AffiliatePrimary;
  tone?: AffiliateTone;
  variant?: AffiliateVariant;
};

type AffiliateItem = {
  key: AffiliatePrimary;
  href: string;
  label: string;
  title: string;
  text: string;
};

export function AffiliateButtonGroup({
  city,
  src = "site",
  v = "default",
  primary = "hotels",
  tone = "light",
  variant = "city",
}: Props) {
  const encodedCity = encodeURIComponent(city.slug);
  const encodedSrc = encodeURIComponent(src);
  const encodedV = encodeURIComponent(v);

  const hotelCopy = getHotelCopy(city, variant);
  const tourCopy = getTourCopy(city, variant);

  const items: AffiliateItem[] = [
    {
      key: "hotels",
      href: `/out/hotels?c=${encodedCity}&src=${encodedSrc}&v=${encodedV}`,
      label: "Hotels",
      title: hotelCopy.title,
      text: hotelCopy.text,
    },
    {
      key: "tours",
      href: `/out/tours?c=${encodedCity}&src=${encodedSrc}&v=${encodedV}`,
      label: "Tours",
      title: tourCopy.title,
      text: tourCopy.text,
    },
  ];

  const orderedItems = [
    ...items.filter((item) => item.key === primary),
    ...items.filter((item) => item.key !== primary),
  ];

  return (
    <div style={wrapStyle}>
      {orderedItems.map((item, index) => {
        const isPrimary = index === 0;
        const cardStyle = getCardStyle(isPrimary, tone);
        const arrowStyle = getArrowStyle(isPrimary, tone);
        const labelStyle = getLabelStyle(isPrimary, tone);
        const textStyle = getTextStyle(isPrimary, tone);
        const trustStyle = getTrustStyle(isPrimary, tone);

        return (
          <Link key={item.key} href={item.href} style={cardStyle}>
            <div style={cardTopStyle}>
              <span style={labelStyle}>{item.label}</span>
              <span style={arrowStyle}>→</span>
            </div>

            <div style={titleStyle}>{item.title}</div>

            <p style={textStyle}>{item.text}</p>

            <div style={trustStyle}>
              External link · No extra cost · Compare details
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function getHotelCopy(city: City, variant: AffiliateVariant) {
  if (variant === "stay") {
    return {
      title: `Compare ${city.city} hotels by area`,
      text: "Use your preferred stay area as the filter before comparing options.",
    };
  }

  if (variant === "tour") {
    return {
      title: `Find a base in ${city.city}`,
      text: "Choose a stay that makes your main route and tour meeting points easier.",
    };
  }

  if (variant === "spot-tour") {
    return {
      title: `Stay near your ${city.city} route`,
      text: "Compare stays after deciding which spots you want to connect.",
    };
  }

  if (variant === "spot-hotel") {
    return {
      title: `Find stays in ${city.city}`,
      text: "Choose your hotel area after checking which places are part of your route.",
    };
  }

  if (variant === "final") {
    return {
      title: `Compare stays in ${city.city}`,
      text: "Use the guide first, then check hotels when your route is clearer.",
    };
  }

  return {
    title: `Find stays in ${city.city}`,
    text: "Compare hotel options after choosing the area that fits your route.",
  };
}

function getTourCopy(city: City, variant: AffiliateVariant) {
  if (variant === "stay") {
    return {
      title: `View ${city.city} tours`,
      text: "Use a tour when you want the sightseeing route handled after choosing your base.",
    };
  }

  if (variant === "tour") {
    return {
      title: `View ${city.city} tours`,
      text: "Use a guided route when you want nearby highlights connected for you.",
    };
  }

  if (variant === "spot-tour") {
    return {
      title: `View ${city.city} tours including this area`,
      text: "Use a tour when this spot is one of your route anchors.",
    };
  }

  if (variant === "spot-hotel") {
    return {
      title: `Add a ${city.city} tour`,
      text: "Use a guided route if you want to connect this spot with nearby highlights.",
    };
  }

  if (variant === "final") {
    return {
      title: `View ${city.city} tours`,
      text: "Turn the places you saved into a route with less planning effort.",
    };
  }

  return {
    title: `View ${city.city} tours`,
    text: "Use a guided route when you want the planning handled for you.",
  };
}

function getCardStyle(isPrimary: boolean, tone: AffiliateTone): CSSProperties {
  if (tone === "dark") {
    return isPrimary ? primaryDarkToneCardStyle : secondaryDarkToneCardStyle;
  }

  return isPrimary ? primaryLightToneCardStyle : secondaryLightToneCardStyle;
}

function getArrowStyle(isPrimary: boolean, tone: AffiliateTone): CSSProperties {
  if (tone === "dark") {
    return isPrimary ? arrowOnWhiteStyle : arrowOnDarkStyle;
  }

  return isPrimary ? arrowOnDarkStyle : arrowOnWhiteStyle;
}

function getLabelStyle(isPrimary: boolean, tone: AffiliateTone): CSSProperties {
  return {
    ...baseLabelStyle,
    opacity: isPrimary && tone === "light" ? 0.62 : 0.7,
  };
}

function getTextStyle(isPrimary: boolean, tone: AffiliateTone): CSSProperties {
  return {
    ...baseTextStyle,
    opacity: isPrimary && tone === "light" ? 0.68 : 0.72,
  };
}

function getTrustStyle(isPrimary: boolean, tone: AffiliateTone): CSSProperties {
  const isDarkPrimary = isPrimary && tone === "light";

  return {
    ...trustNoteStyle,
    color: isDarkPrimary ? "#ffffff" : "inherit",
    borderTop:
      isDarkPrimary || tone === "dark"
        ? "1px solid rgba(255, 255, 255, 0.14)"
        : "1px solid rgba(0, 0, 0, 0.08)",
    opacity: isDarkPrimary ? 0.62 : 0.58,
  };
}

const wrapStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const primaryLightToneCardStyle: CSSProperties = {
  display: "block",
  padding: 15,
  borderRadius: 22,
  background: "#171717",
  color: "#ffffff",
  textDecoration: "none",
  boxShadow: "0 18px 46px rgba(0, 0, 0, 0.16)",
};

const secondaryLightToneCardStyle: CSSProperties = {
  display: "block",
  padding: 15,
  borderRadius: 22,
  background: "rgba(255, 255, 255, 0.88)",
  color: "#17202a",
  textDecoration: "none",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 14px 34px rgba(0, 0, 0, 0.08)",
};

const primaryDarkToneCardStyle: CSSProperties = {
  display: "block",
  padding: 15,
  borderRadius: 22,
  background: "#ffffff",
  color: "#17202a",
  textDecoration: "none",
  boxShadow: "0 18px 46px rgba(0, 0, 0, 0.18)",
};

const secondaryDarkToneCardStyle: CSSProperties = {
  display: "block",
  padding: 15,
  borderRadius: 22,
  background: "rgba(255, 255, 255, 0.12)",
  color: "#ffffff",
  textDecoration: "none",
  border: "1px solid rgba(255, 255, 255, 0.16)",
};

const cardTopStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  marginBottom: 10,
};

const baseLabelStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fontWeight: 850,
};

const arrowOnDarkStyle: CSSProperties = {
  width: 26,
  height: 26,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.18)",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 850,
};

const arrowOnWhiteStyle: CSSProperties = {
  width: 26,
  height: 26,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "rgba(0, 0, 0, 0.08)",
  color: "#17202a",
  fontSize: 14,
  fontWeight: 850,
};

const titleStyle: CSSProperties = {
  fontSize: 18,
  lineHeight: 1.08,
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const baseTextStyle: CSSProperties = {
  margin: "8px 0 0",
  fontSize: 13,
  lineHeight: 1.5,
};

const trustNoteStyle: CSSProperties = {
  marginTop: 12,
  paddingTop: 10,
  fontSize: 11,
  lineHeight: 1.45,
  fontWeight: 750,
};



