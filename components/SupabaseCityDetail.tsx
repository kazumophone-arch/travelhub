import Link from "next/link";
import type { CSSProperties } from "react";
import { AffiliateButtonGroup } from "@/components/AffiliateButtonGroup";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import { getPublishedSupabaseSpotsForCity } from "@/data/supabase-public-spots";
import type { TrackingParams } from "@/lib/tracking-query";
import { getImageBackground, getOptionalHttpUrl } from "@/lib/url-fields";

type Props = {
  city: SupabasePublicCity;
  tracking?: TrackingParams;
};

type Spot = {
  id: string;
  city_id: string | null;
  name: string;
  slug: string;
  summary: string;
  image_url: string;
};

export async function SupabaseCityDetail({ city, tracking }: Props) {
  const spots = (await getPublishedSupabaseSpotsForCity(city.slug)) as Spot[];
  const hasHotelAffiliate = Boolean(getOptionalHttpUrl(city.affiliate_hotel_url));
  const hasTourAffiliate = Boolean(getOptionalHttpUrl(city.affiliate_tour_url));
  const trackingSrc = tracking?.src ?? "city-detail";
  const trackingV = tracking?.v ?? `city_${city.slug}`;
  const spotTrackingQuery = getTrackingQuery(tracking);

  return (
    <main style={pageStyle}>
      <section
        style={{
          ...heroStyle,
          backgroundImage: getImageBackground(
            city.image_url,
            "linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.84))",
            "linear-gradient(135deg, #e8f4ff, #edf8f2)"
          ),
        }}
      >
        <div style={heroPanelStyle}>
          <div style={eyebrowStyle}>{city.country}</div>
          <h1 style={titleStyle}>{city.city}</h1>
          <p style={leadStyle}>
            {city.summary || city.description || "A TravelHub city guide."}
          </p>
          {hasHotelAffiliate || hasTourAffiliate ? (
            <div style={heroCtaStyle}>
              <AffiliateButtonGroup
                city={city}
                src={trackingSrc}
                v={trackingV}
                primary={hasHotelAffiliate ? "hotels" : "tours"}
                tone="light"
                variant="city"
                showHotels={hasHotelAffiliate}
                showTours={hasTourAffiliate}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section style={shellStyle}>
        <div style={labelStyle}>Explore next</div>
        <h2 style={sectionTitleStyle}>Popular spots in {city.city}</h2>

        {spots.length === 0 ? (
          <div style={emptyStyle}>No published spots yet.</div>
        ) : (
          <div style={gridStyle}>
            {spots.map((spot) => (
              <Link
                key={spot.id}
                href={`/c/${city.slug}/spot/${spot.slug}${spotTrackingQuery}`}
                style={{
                  ...cardStyle,
                  backgroundImage: getImageBackground(
                    spot.image_url,
                    "linear-gradient(180deg, rgba(255,255,255,0), rgba(23,32,42,.08))",
                    "linear-gradient(135deg, #e8f4ff, #edf8f2)"
                  ),
                }}
              >
                <div style={badgeStyle}>{city.city}</div>

                <div style={panelStyle}>
                  <h3 style={cardTitleStyle}>{spot.name}</h3>
                  <p style={cardTextStyle}>{spot.summary || "No summary yet."}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function getTrackingQuery(tracking: TrackingParams | undefined) {
  const query = new URLSearchParams();

  if (tracking?.src) {
    query.set("src", tracking.src);
  }

  if (tracking?.v) {
    query.set("v", tracking.v);
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f7fbff 0%, #ffffff 52%, #f6faf8 100%)",
  color: "#17202a",
};

const heroStyle: CSSProperties = {
  minHeight: 520,
  display: "flex",
  alignItems: "flex-end",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "220px 16px 28px",
};

const heroPanelStyle: CSSProperties = {
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

const eyebrowStyle: CSSProperties = {
  marginBottom: 12,
  fontSize: 12,
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: 0,
  color: "#1769e0",
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

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1080,
  margin: "0 auto",
  padding: "36px 16px 72px",
};

const labelStyle: CSSProperties = {
  marginBottom: 8,
  fontSize: 12,
  color: "#138a72",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: 0,
};

const sectionTitleStyle: CSSProperties = {
  margin: "0 0 16px",
  fontSize: 32,
  letterSpacing: 0,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 16,
};

const cardStyle: CSSProperties = {
  minHeight: 410,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 26,
  overflow: "hidden",
  color: "#17202a",
  textDecoration: "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "#edf8f2",
  border: "1px solid rgba(23,32,42,.1)",
  boxShadow: "0 12px 28px rgba(30,64,88,.12)",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
};

const panelStyle: CSSProperties = {
  margin: 0,
  padding: 18,
  borderRadius: "0 0 26px 26px",
  background: "#ffffff",
  borderTop: "1px solid rgba(23,32,42,.08)",
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.12,
  letterSpacing: 0,
  color: "#17202a",
};

const cardTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "#4c5f6f",
};

const emptyStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: "#fffdf8",
  border: "1px solid rgba(168,116,50,.14)",
  color: "#607080",
};
