import Link from "next/link";
import type { CSSProperties } from "react";
import { AffiliateButtonGroup } from "@/components/AffiliateButtonGroup";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import type { SupabasePublicSpot } from "@/data/supabase-public-spots";
import { getImageBackground, getOptionalHttpUrl } from "@/lib/url-fields";

type Props = {
  city: SupabasePublicCity;
  spot: SupabasePublicSpot;
};

export function SupabaseSpotDetail({ city, spot }: Props) {
  const hotelAffiliateUrl =
    spot.affiliateHotelUrl ?? spot.affiliate_hotel_url;
  const tourAffiliateUrl =
    spot.affiliateTourUrl ?? spot.affiliate_tour_url;
  const hasHotelAffiliate = Boolean(getOptionalHttpUrl(hotelAffiliateUrl));
  const hasTourAffiliate = Boolean(getOptionalHttpUrl(tourAffiliateUrl));

  return (
    <main style={pageStyle}>
      <section
        style={{
          ...heroStyle,
          backgroundImage: getImageBackground(
            spot.image_url,
            "linear-gradient(180deg, rgba(10,18,24,.10), rgba(10,18,24,.76))",
            "linear-gradient(135deg, #dfeeea, #f7efe2)"
          ),
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
                src="spot-detail"
                v={`spot_${city.slug}_${spot.slug}`}
                spotSlug={spot.slug}
                primary={hasHotelAffiliate ? "hotels" : "tours"}
                tone="dark"
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
  background: "#f8faf7",
  color: "#17202a",
};

const heroStyle: CSSProperties = {
  minHeight: "clamp(460px, 72vw, 720px)",
  display: "flex",
  alignItems: "flex-end",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "44px 16px",
};

const panelStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1080,
  margin: "0 auto",
  padding: 22,
  borderRadius: 28,
  background: "rgba(12,22,30,.54)",
  border: "1px solid rgba(255,255,255,.24)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  color: "#ffffff",
};

const backStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 18,
  color: "rgba(255,255,255,.86)",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 850,
};

const eyebrowStyle: CSSProperties = {
  marginBottom: 12,
  fontSize: 12,
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".13em",
  color: "rgba(255,255,255,.78)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(44px, 10vw, 84px)",
  lineHeight: 1,
  letterSpacing: "-.06em",
};

const leadStyle: CSSProperties = {
  margin: "14px 0 0",
  maxWidth: 720,
  fontSize: 16,
  lineHeight: 1.7,
  color: "rgba(255,255,255,.84)",
};

const heroCtaStyle: CSSProperties = {
  maxWidth: 420,
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
  fontSize: "clamp(26px, 5vw, 36px)",
  letterSpacing: "-.045em",
};

const bodyTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.8,
  color: "#607080",
};
