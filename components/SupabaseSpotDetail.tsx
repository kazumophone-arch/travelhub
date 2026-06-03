import Link from "next/link";
import type { CSSProperties } from "react";
import { AffiliateButtonGroup } from "@/components/AffiliateButtonGroup";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import type { SupabasePublicSpot } from "@/data/supabase-public-spots";
import type { TrackingParams } from "@/lib/tracking-query";
import {
  getCssImagePosition,
  getImageBackground,
  getOptionalHttpUrl,
} from "@/lib/url-fields";

type Props = {
  city: SupabasePublicCity;
  spot: SupabasePublicSpot;
  tracking?: TrackingParams;
};

export function SupabaseSpotDetail({ city, spot, tracking }: Props) {
  const hotelAffiliateUrl =
    spot.affiliateHotelUrl ?? spot.affiliate_hotel_url;
  const tourAffiliateUrl =
    spot.affiliateTourUrl ?? spot.affiliate_tour_url;
  const hasHotelAffiliate = Boolean(getOptionalHttpUrl(hotelAffiliateUrl));
  const hasTourAffiliate = Boolean(getOptionalHttpUrl(tourAffiliateUrl));
  const trackingSrc = tracking?.src ?? "spot-detail";
  const trackingV = tracking?.v ?? `spot_${city.slug}_${spot.slug}`;

  return (
    <main style={pageStyle}>
      <section
        style={{
          ...heroStyle,
          backgroundImage: getImageBackground(
            spot.image_url,
            "linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.84))",
            "linear-gradient(135deg, #e8f4ff, #edf8f2)"
          ),
          backgroundPosition: getCssImagePosition(spot.imagePosition ?? spot.image_position),
        }}
      >
        <div style={panelStyle}>
          <Link href={`/c/${city.slug}`} style={backStyle}>
            ← Back to {city.city}
          </Link>

          <div style={eyebrowStyle}>{city.city}, {city.country}</div>
          <h1 style={titleStyle}>{spot.name}</h1>
          <p style={leadStyle}>
            {spot.summary || spot.description || "A TravelHub spot guide."}
          </p>
          {hasHotelAffiliate || hasTourAffiliate ? (
            <div style={heroCtaStyle}>
              <AffiliateButtonGroup
                city={city}
                src={trackingSrc}
                v={trackingV}
                spotSlug={spot.slug}
                primary={hasHotelAffiliate ? "hotels" : "tours"}
                tone="light"
                variant={hasHotelAffiliate ? "spot-hotel" : "spot-tour"}
                showHotels={hasHotelAffiliate}
                showTours={hasTourAffiliate}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section style={bodyStyle}>
        <h2 style={sectionTitleStyle}>About this spot</h2>
        <p style={bodyTextStyle}>
          {spot.description || spot.summary || "No description yet."}
        </p>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f7fbff 0%, #ffffff 52%, #f6faf8 100%)",
  color: "#17202a",
};

const heroStyle: CSSProperties = {
  minHeight: 540,
  display: "flex",
  alignItems: "flex-end",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "220px 16px 28px",
};

const panelStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1080,
  margin: "0 auto",
  padding: 22,
  borderRadius: 28,
  background: "rgba(255,255,255,.94)",
  border: "1px solid rgba(23,32,42,.1)",
  boxShadow: "0 18px 42px rgba(30,64,88,.14)",
  color: "#17202a",
};

const backStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 18,
  color: "#1769e0",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 850,
};

const eyebrowStyle: CSSProperties = {
  marginBottom: 12,
  fontSize: 12,
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: 0,
  color: "#138a72",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 44,
  lineHeight: 1.06,
  letterSpacing: 0,
};

const leadStyle: CSSProperties = {
  margin: "14px 0 0",
  maxWidth: 720,
  fontSize: 16,
  lineHeight: 1.7,
  color: "#4c5f6f",
};

const heroCtaStyle: CSSProperties = {
  maxWidth: 520,
  marginTop: 18,
};

const bodyStyle: CSSProperties = {
  width: "100%",
  maxWidth: 900,
  margin: "0 auto",
  padding: "36px 16px 72px",
};

const sectionTitleStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: 32,
  letterSpacing: 0,
};

const bodyTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.8,
  color: "#607080",
};
