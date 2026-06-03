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
            "linear-gradient(180deg, rgba(10,18,24,.12), rgba(10,18,24,.76))",
            "linear-gradient(135deg, #dfeeea, #f7efe2)"
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
                tone="dark"
                variant="city"
                showHotels={hasHotelAffiliate}
                showTours={hasTourAffiliate}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section style={shellStyle}>
        <div style={labelStyle}>Added from admin</div>
        <h2 style={sectionTitleStyle}>Published spots</h2>

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
                    "linear-gradient(180deg, rgba(10,18,24,.05), rgba(10,18,24,.76))",
                    "linear-gradient(135deg, #dfeeea, #f7efe2)"
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
  background: "#f8faf7",
  color: "#17202a",
};

const heroStyle: CSSProperties = {
  minHeight: "clamp(420px, 68vw, 680px)",
  display: "flex",
  alignItems: "flex-end",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "44px 16px",
};

const heroPanelStyle: CSSProperties = {
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

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1080,
  margin: "0 auto",
  padding: "36px 16px 72px",
};

const labelStyle: CSSProperties = {
  marginBottom: 8,
  fontSize: 12,
  color: "#9a6a2f",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".12em",
};

const sectionTitleStyle: CSSProperties = {
  margin: "0 0 16px",
  fontSize: "clamp(26px, 5vw, 36px)",
  letterSpacing: "-.045em",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 16,
};

const cardStyle: CSSProperties = {
  minHeight: 360,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 26,
  overflow: "hidden",
  color: "#ffffff",
  textDecoration: "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,.84)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
};

const panelStyle: CSSProperties = {
  margin: 12,
  padding: 16,
  borderRadius: 20,
  background: "rgba(12,22,30,.54)",
  border: "1px solid rgba(255,255,255,.24)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.06,
  letterSpacing: "-.04em",
};

const cardTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "rgba(255,255,255,.84)",
};

const emptyStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: "#fffdf8",
  border: "1px solid rgba(168,116,50,.14)",
  color: "#607080",
};
