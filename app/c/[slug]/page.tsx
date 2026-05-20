import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import type { City } from "@/data/types";
import { cities } from "@/data/cities";
import { TravelVisual } from "@/components/TravelVisual";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AffiliateButtonGroup } from "@/components/AffiliateButtonGroup";

type StayArea = {
  name: string;
  bestFor: string;
  reason: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = cities[slug];

  if (!city) {
    return {
      title: "City not found | TravelHub",
      description: "This TravelHub city page could not be found.",
    };
  }

  const title = `${city.city}, ${city.country} | TravelHub`;
  const description =
    city.description ??
    `Explore ${city.city}, featured spots, where to stay, and travel planning links.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://travelhub-murex.vercel.app/c/${city.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CityPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const src = typeof sp?.src === "string" ? sp.src : "city";
  const v = typeof sp?.v === "string" ? sp.v : `city_${slug}`;

  const city = cities[slug];
  if (!city) return notFound();

  const spotCards =
    city.spotDetails && city.spotDetails.length > 0
      ? city.spotDetails.filter((spot) => spot.isPublished !== false)
      : city.stops.map((stop, index) => ({
          slug:
            stop
              .toLowerCase()
              .replaceAll(" ", "-")
              .replace(/[^a-z0-9-]/g, "") || `spot-${index + 1}`,
          name: stop,
          summary: "A featured place from this city.",
          highlights: ["Featured spot"],
          bestFor: [],
          tags: [index === 0 ? "First stop" : "Travel spot"],
          imageUrl: undefined,
          imageAlt: undefined,
          imageCredit: undefined,
        }));

  const stayAreas = getStayAreas(city);
  const topStyles = city.travelStyles?.slice(0, 4) ?? [];
  const bestMonths = city.months?.slice(0, 5) ?? [];
  const themes = city.themes?.slice(0, 4) ?? [];

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Cities", href: "/cities" },
            { label: `${city.city}, ${city.country}` },
          ]}
        />

        <section style={heroStyle}>
          <div style={heroTextStyle}>
            <div style={eyebrowStyle}>Travel planning guide</div>

            <h1 style={titleStyle}>
              {city.city}, {city.country}
            </h1>

            <p style={subtitleStyle}>{getCityIntro(city)}</p>

            <div style={heroChipWrapStyle}>
              {(topStyles.length > 0 ? topStyles : ["First-time visitors"])
                .slice(0, 3)
                .map((style) => (
                  <span key={style} style={heroChipStyle}>
                    {style}
                  </span>
                ))}

              {(bestMonths.length > 0 ? bestMonths : ["Seasonal timing"])
                .slice(0, 2)
                .map((month) => (
                  <span key={month} style={heroChipStyle}>
                    {month}
                  </span>
                ))}
            </div>
          </div>

          <aside style={heroActionCardStyle}>
            <div style={smallLabelStyle}>Plan with less guessing</div>
            <h2 style={heroActionTitleStyle}>
              Compare stays and tours after choosing your route.
            </h2>
            <p style={heroActionTextStyle}>
              Start with the city highlights, then use the links when you know
              what kind of trip fits you.
            </p>

            <AffiliateButtonGroup city={city} src={src} v={v} variant="city" />
          </aside>
        </section>

        <section style={decisionGridStyle}>
          <article style={decisionCardStyle}>
            <div style={smallLabelStyle}>Why visit</div>
            <h2 style={sectionTitleStyle}>Why {city.city} works</h2>
            <p style={bodyTextStyle}>{getWhyVisitText(city)}</p>
          </article>

          <article style={decisionCardStyle}>
            <div style={smallLabelStyle}>Best for</div>
            <h2 style={sectionTitleStyle}>Who this trip fits</h2>
            <div style={tagWrapStyle}>
              {(topStyles.length > 0
                ? topStyles
                : ["First-time visitors", "City walks", "Sightseeing"]
              ).map((style) => (
                <span key={style} style={tagStyle}>
                  {style}
                </span>
              ))}
            </div>
          </article>

          <article style={decisionCardStyle}>
            <div style={smallLabelStyle}>Best months</div>
            <h2 style={sectionTitleStyle}>When to consider going</h2>
            <div style={tagWrapStyle}>
              {(bestMonths.length > 0
                ? bestMonths
                : ["Spring", "Autumn", "Flexible timing"]
              ).map((month) => (
                <span key={month} style={tagStyle}>
                  {month}
                </span>
              ))}
            </div>
          </article>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Where to stay</div>
              <h2 style={largeSectionTitleStyle}>
                Choose an area before comparing hotels.
              </h2>
            </div>
          </div>

          <p style={sectionLeadStyle}>
            Hotel links work best after the stay area is clear. Use these areas
            as a quick decision guide before comparing options.
          </p>

          <div style={stayGridStyle}>
            {stayAreas.map((area) => (
              <article key={area.name} style={stayCardStyle}>
                <div style={stayAreaStyle}>{area.name}</div>
                <h3 style={stayTitleStyle}>{area.bestFor}</h3>
                <p style={stayTextStyle}>{area.reason}</p>
              </article>
            ))}
          </div>

          <div style={reasonCtaStyle}>
            <div>
              <div style={smallLabelStyle}>Planning to stay in {city.city}?</div>
              <h3 style={ctaTitleStyle}>
                Pick an area that fits your route, then compare hotel options.
              </h3>
            </div>

            <AffiliateButtonGroup city={city} src={src} v={`stay_${v}`} variant="stay" />
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Featured spots</div>
              <h2 style={largeSectionTitleStyle}>Start with these places.</h2>
            </div>
            <span style={countStyle}>{spotCards.length} spots</span>
          </div>

          <div style={spotGridStyle}>
            {spotCards.map((spot, index) => {
              const canOpenSpot =
                city.spotDetails?.some((item) => item.slug === spot.slug) ??
                false;

              const content = (
                <>
                  <TravelVisual
                    imageUrl={spot.imageUrl}
                    imageAlt={spot.imageAlt ?? spot.name}
                    imageCredit={spot.imageCredit}
                    fallback={visualForIndex(index)}
                    style={spotVisualStyle}
                  >
                    <div style={spotNumberBadgeStyle}>{index + 1}</div>
                  </TravelVisual>

                  <div style={spotBodyStyle}>
                    <div style={spotMetaStyle}>
                      {canOpenSpot ? "Spot guide" : "City highlight"}
                    </div>

                    <h3 style={spotTitleStyle}>{spot.name}</h3>

                    <p style={spotTextStyle}>{spot.summary}</p>

                    <div style={tagWrapStyle}>
                      {(spot.tags && spot.tags.length > 0
                        ? spot.tags
                        : spot.highlights
                      )
                        .slice(0, 3)
                        .map((tag) => (
                          <span key={tag} style={smallTagStyle}>
                            {tag}
                          </span>
                        ))}
                    </div>

                    <div style={openTextStyle}>
                      {canOpenSpot ? "Open spot guide" : "Use city guide"}
                    </div>
                  </div>
                </>
              );

              if (!canOpenSpot) {
                return (
                  <article key={`${spot.slug}-${index}`} style={spotCardStyle}>
                    {content}
                  </article>
                );
              }

              return (
                <Link
                  key={`${spot.slug}-${index}`}
                  href={`/c/${slug}/spot/${spot.slug}?src=${encodeURIComponent(
                    src
                  )}&v=${encodeURIComponent(v)}`}
                  style={spotCardLinkStyle}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={tourCtaStyle}>
            <div>
              <div style={smallLabelStyle}>Tours worth considering</div>
              <h2 style={largeSectionTitleStyle}>
                Use a tour when you want the route handled for you.
              </h2>
              <p style={sectionLeadStyle}>{getTourText(city)}</p>
            </div>

            <AffiliateButtonGroup city={city} src={src} v={`tour_${v}`} primary="tours" variant="tour" />
          </div>
        </section>

        <section style={finalCtaStyle}>
          <div>
            <div style={smallLabelStyle}>Ready to plan?</div>
            <h2 style={finalCtaTitleStyle}>
              Turn {city.city} from an idea into a trip plan.
            </h2>
            <p style={finalCtaTextStyle}>
              You have the key places, timing, stay-area logic, and planning
              links in one place.
            </p>
          </div>

          <AffiliateButtonGroup city={city} src={src} v={`final_${v}`} tone="dark" variant="final" />
        </section>

        <p style={noteStyle}>
          Some links may be affiliate links. We may earn a commission if you book
          through them, at no extra cost to you.
        </p>
      </section>
    </main>
  );
}

function getCityIntro(city: City) {
  return (
    city.description ??
    `Explore ${city.city} through featured spots, seasonal context, where-to-stay guidance, and quick travel planning links.`
  );
}

function getWhyVisitText(city: City) {
  const themes = city.themes?.slice(0, 3).join(", ");
  const styles = city.travelStyles?.slice(0, 3).join(", ");
  const stops = city.stops.slice(0, 3).join(", ");

  if (themes && styles) {
    return `${city.city} works well for ${styles.toLowerCase()} trips, especially if you want ${themes.toLowerCase()} experiences. Start with ${stops}.`;
  }

  if (themes) {
    return `${city.city} is a strong pick for ${themes.toLowerCase()} travel. Start with ${stops}.`;
  }

  return `${city.city} is easiest to plan when you begin with a few clear anchors: ${stops}.`;
}

function getStayAreas(city: City): StayArea[] {
  const areas: Record<string, StayArea[]> = {
    "rome-it": [
      {
        name: "Historic Center",
        bestFor: "Best for first-time visitors",
        reason:
          "Stay here if you want the easiest access to major sights and want to reduce transport decisions.",
      },
      {
        name: "Trastevere",
        bestFor: "Best for restaurants and evening walks",
        reason:
          "A good fit if you care about atmosphere, food, and a more local-feeling night out.",
      },
      {
        name: "Near Termini",
        bestFor: "Best for budget and train access",
        reason:
          "Useful if you want simpler airport or train connections and usually more practical hotel options.",
      },
    ],
    "venice-it": [
      {
        name: "San Marco",
        bestFor: "Best for first-time sightseeing",
        reason:
          "Choose this area if you want to stay close to the most iconic sights and reduce walking time.",
      },
      {
        name: "Dorsoduro",
        bestFor: "Best for a calmer atmosphere",
        reason:
          "A useful base if you want galleries, canals, and a slightly less crowded evening feel.",
      },
      {
        name: "Cannaregio",
        bestFor: "Best for value and local routes",
        reason:
          "Good for travelers who want easier access from the station and a less polished tourist feel.",
      },
    ],
    "kyoto-jp": [
      {
        name: "Downtown Kyoto",
        bestFor: "Best for food and transport",
        reason:
          "A practical base if you want easy transit, restaurants, shopping, and access to multiple areas.",
      },
      {
        name: "Higashiyama",
        bestFor: "Best for classic Kyoto atmosphere",
        reason:
          "Choose this if temples, old streets, and scenic walks are the main reason for the trip.",
      },
      {
        name: "Arashiyama",
        bestFor: "Best for nature-focused stays",
        reason:
          "Works well if bamboo paths, riverside scenery, and a slower pace matter more than nightlife.",
      },
    ],
    "paris-fr": [
      {
        name: "Saint-Germain",
        bestFor: "Best for first-time visitors",
        reason:
          "A balanced area for classic Paris streets, cafes, museums, and central walking routes.",
      },
      {
        name: "Le Marais",
        bestFor: "Best for food, shops, and atmosphere",
        reason:
          "Good if you want a lively base with strong walking access and plenty to do nearby.",
      },
      {
        name: "Near the Opera",
        bestFor: "Best for transport and shopping",
        reason:
          "Useful if you want practical connections, department stores, and easy movement around the city.",
      },
    ],
    "barcelona-es": [
      {
        name: "Eixample",
        bestFor: "Best for first-time visitors",
        reason:
          "A practical base for architecture, restaurants, and easy access across the city grid.",
      },
      {
        name: "Gothic Quarter",
        bestFor: "Best for old streets and nightlife",
        reason:
          "Choose this if atmosphere, walkability, and historic lanes are the main appeal.",
      },
      {
        name: "Gracia",
        bestFor: "Best for a local-feeling stay",
        reason:
          "Good for travelers who want neighborhood plazas, cafes, and a less central hotel feel.",
      },
    ],
    "amsterdam-nl": [
      {
        name: "Canal Belt",
        bestFor: "Best for first-time visitors",
        reason:
          "Stay here if canals, museums, and scenic walking routes are the core of your trip.",
      },
      {
        name: "Jordaan",
        bestFor: "Best for atmosphere and cafes",
        reason:
          "A strong fit for slower walks, small streets, local shops, and a quieter evening base.",
      },
      {
        name: "Museum Quarter",
        bestFor: "Best for museums and calm stays",
        reason:
          "Useful if you want major museums nearby and a slightly more spacious neighborhood feel.",
      },
    ],
  };

  return (
    areas[city.slug] ?? [
      {
        name: "Central area",
        bestFor: "Best for first-time visitors",
        reason:
          "Choose a central base if you want to reduce transport decisions and stay close to the main route.",
      },
      {
        name: "Station area",
        bestFor: "Best for practical travel",
        reason:
          "Useful if you care about airport, train, or day-trip access more than atmosphere.",
      },
      {
        name: "Old town or scenic area",
        bestFor: "Best for atmosphere",
        reason:
          "A good fit if the main goal is walking, views, historic streets, and evening atmosphere.",
      },
    ]
  );
}

function getTourText(city: City) {
  const firstSpot = city.stops[0];

  return `If ${firstSpot} is one of your main reasons to visit, a guided route or city experience can reduce planning effort and connect nearby sights more efficiently.`;
}

function visualForIndex(index: number) {
  const visuals = [
    "linear-gradient(135deg, #d9a76f 0%, #b86b4b 44%, #3b2f2f 100%)",
    "linear-gradient(135deg, #9cc9d7 0%, #e7c389 46%, #8b5f4d 100%)",
    "linear-gradient(135deg, #c7d4df 0%, #d3b58d 44%, #4b4b58 100%)",
  ];

  return visuals[index % visuals.length];
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  overflowX: "hidden",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  background:
    "radial-gradient(circle at 12% 0%, rgba(255, 221, 180, 0.72), transparent 30%), radial-gradient(circle at 88% 4%, rgba(175, 205, 255, 0.58), transparent 28%), linear-gradient(180deg, #fbf7f0 0%, #ffffff 44%, #eef4f8 100%)",
  color: "#171717",
};

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1040,
  margin: "0 auto",
  padding: "34px 16px 48px",
};

const heroStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.35fr) minmax(min(100%, 300px), 0.65fr)",
  gap: 18,
  alignItems: "stretch",
  marginBottom: 22,
};

const heroTextStyle: CSSProperties = {
  minWidth: 0,
  padding: "16px 0",
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  opacity: 0.58,
  marginBottom: 12,
};

const titleStyle: CSSProperties = {
  margin: "0 0 14px",
  maxWidth: 760,
  fontSize: "clamp(42px, 11vw, 78px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 700,
  fontSize: "clamp(15px, 4vw, 17px)",
  lineHeight: 1.72,
  opacity: 0.72,
};

const heroChipWrapStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 18,
};

const heroChipStyle: CSSProperties = {
  padding: "8px 11px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.72)",
  border: "1px solid rgba(0, 0, 0, 0.07)",
  fontSize: 12,
  fontWeight: 800,
};

const heroActionCardStyle: CSSProperties = {
  padding: 18,
  borderRadius: 30,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 24px 74px rgba(0, 0, 0, 0.1)",
  alignSelf: "start",
};

const smallLabelStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  opacity: 0.5,
  marginBottom: 7,
};

const heroActionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.08,
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const heroActionTextStyle: CSSProperties = {
  margin: "10px 0 16px",
  fontSize: 14,
  lineHeight: 1.55,
  opacity: 0.68,
};

const decisionGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 14,
  marginBottom: 34,
};

const decisionCardStyle: CSSProperties = {
  padding: 18,
  borderRadius: 26,
  background: "rgba(255, 255, 255, 0.76)",
  border: "1px solid rgba(0, 0, 0, 0.07)",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.06)",
};

const sectionStyle: CSSProperties = {
  marginTop: 36,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-end",
  marginBottom: 16,
  flexWrap: "wrap",
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.08,
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const largeSectionTitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 720,
  fontSize: "clamp(26px, 6vw, 36px)",
  lineHeight: 1.04,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const bodyTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 14,
  lineHeight: 1.68,
  opacity: 0.7,
};

const sectionLeadStyle: CSSProperties = {
  margin: "0 0 16px",
  maxWidth: 720,
  fontSize: 14,
  lineHeight: 1.7,
  opacity: 0.68,
};

const tagWrapStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const tagStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 999,
  background: "rgba(0, 0, 0, 0.055)",
  fontSize: 12,
  fontWeight: 800,
};

const smallTagStyle: CSSProperties = {
  padding: "7px 9px",
  borderRadius: 999,
  background: "rgba(0, 0, 0, 0.055)",
  fontSize: 12,
  fontWeight: 750,
};

const stayGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 14,
};

const stayCardStyle: CSSProperties = {
  padding: 18,
  borderRadius: 26,
  background: "rgba(255, 255, 255, 0.78)",
  border: "1px solid rgba(0, 0, 0, 0.07)",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.06)",
};

const stayAreaStyle: CSSProperties = {
  marginBottom: 8,
  fontSize: 13,
  fontWeight: 850,
  opacity: 0.62,
};

const stayTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 22,
  lineHeight: 1.08,
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const stayTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 14,
  lineHeight: 1.6,
  opacity: 0.68,
};

const reasonCtaStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(min(100%, 300px), 0.7fr)",
  gap: 16,
  alignItems: "center",
  marginTop: 16,
  padding: 18,
  borderRadius: 28,
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 20px 58px rgba(0, 0, 0, 0.08)",
};

const ctaTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.08,
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const countStyle: CSSProperties = {
  fontSize: 13,
  opacity: 0.6,
  whiteSpace: "nowrap",
};

const spotGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
  gap: 16,
};

const spotCardStyle: CSSProperties = {
  display: "block",
  borderRadius: 28,
  overflow: "hidden",
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 20px 58px rgba(0, 0, 0, 0.08)",
};

const spotCardLinkStyle: CSSProperties = {
  ...spotCardStyle,
  color: "inherit",
  textDecoration: "none",
};

const spotVisualStyle: CSSProperties = {
  height: "clamp(150px, 42vw, 190px)",
  position: "relative",
};

const spotNumberBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  width: 34,
  height: 34,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.82)",
  backdropFilter: "blur(14px)",
  fontSize: 13,
  fontWeight: 850,
  zIndex: 2,
};

const spotBodyStyle: CSSProperties = {
  padding: 18,
};

const spotMetaStyle: CSSProperties = {
  marginBottom: 8,
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  opacity: 0.46,
  fontWeight: 850,
};

const spotTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(22px, 6vw, 26px)",
  lineHeight: 1.05,
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const spotTextStyle: CSSProperties = {
  margin: "8px 0 14px",
  fontSize: 14,
  lineHeight: 1.55,
  opacity: 0.66,
};

const openTextStyle: CSSProperties = {
  marginTop: 14,
  fontSize: 13,
  fontWeight: 850,
  opacity: 0.76,
};

const tourCtaStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(min(100%, 300px), 0.7fr)",
  gap: 16,
  alignItems: "center",
  padding: 22,
  borderRadius: 30,
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 24px 74px rgba(0, 0, 0, 0.1)",
};

const finalCtaStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(min(100%, 300px), 0.7fr)",
  gap: 16,
  alignItems: "center",
  marginTop: 34,
  padding: 22,
  borderRadius: 32,
  background: "rgba(23, 23, 23, 0.94)",
  color: "#ffffff",
  boxShadow: "0 26px 80px rgba(0, 0, 0, 0.18)",
};

const finalCtaTitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 680,
  fontSize: "clamp(28px, 7vw, 40px)",
  lineHeight: 1.04,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const finalCtaTextStyle: CSSProperties = {
  margin: "10px 0 0",
  maxWidth: 620,
  fontSize: 14,
  lineHeight: 1.65,
  opacity: 0.72,
};

const noteStyle: CSSProperties = {
  margin: "28px auto 0",
  maxWidth: 560,
  textAlign: "center",
  fontSize: 12,
  lineHeight: 1.6,
  opacity: 0.52,
};


