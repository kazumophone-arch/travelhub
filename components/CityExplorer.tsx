"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { TravelDiscoveryTools } from "@/components/TravelDiscoveryTools";

type Props = {
  cities: City[];
};

type DiscoverySpot = {
  citySlug: string;
  cityName: string;
  country: string;
  slug: string;
  name: string;
  summary: string;
  tags: string[];
  canOpen: boolean;
};

type SpotSearchResult = {
  citySlug: string;
  cityName: string;
  country: string;
  slug: string;
  name: string;
  summary: string;
  highlights: string[];
  tags: string[];
};

const europeCountries = new Set([
  "Italy",
  "France",
  "Spain",
  "Czech Republic",
  "Croatia",
  "Austria",
  "United Kingdom",
  "Netherlands",
]);

const asiaCountries = new Set([
  "Japan",
  "South Korea",
  "China",
  "Thailand",
  "Singapore",
]);

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const moodCards = [
  {
    label: "Romantic",
    title: "Romantic escapes",
    text: "Canals, sunsets, old streets, and atmospheric city walks.",
  },
  {
    label: "Family",
    title: "Family-friendly",
    text: "Easy-to-understand destinations for relaxed trip planning.",
  },
  {
    label: "Solo",
    title: "Solo travel picks",
    text: "Walkable cities and iconic spots that work well alone.",
  },
  {
    label: "World Heritage",
    title: "World Heritage",
    text: "Historic centers, old towns, temples, and cultural routes.",
  },
  {
    label: "Scenic",
    title: "Scenic views",
    text: "Beautiful skylines, canals, beaches, rivers, and sunset moments.",
  },
  {
    label: "Old Town",
    title: "Old town walks",
    text: "Compact cities with old streets, plazas, bridges, and architecture.",
  },
];

const preferredOrder = [
  "World Heritage",
  "Spring",
  "Summer",
  "Autumn",
  "Winter",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "Couples",
  "Family",
  "Solo",
  "Friends",
  "Weekend",
  "Luxury",
  "Budget",
  "Europe",
  "Asia",
  "Old Town",
  "Scenic",
  "Beach",
  "Nature",
  "Food",
  "Italy",
  "France",
  "Spain",
  "Japan",
  "United Kingdom",
  "Netherlands",
];

function getCurrentMonth() {
  return monthNames[new Date().getMonth()];
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replaceAll("&", "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "spot"
  );
}

function getCityCategories(city: City) {
  const categories = new Set<string>();

  if (europeCountries.has(city.country)) categories.add("Europe");
  if (asiaCountries.has(city.country)) categories.add("Asia");

  categories.add(city.country);

  city.seasons?.forEach((season) => categories.add(season));
  city.months?.forEach((month) => categories.add(month));
  city.travelStyles?.forEach((style) => categories.add(style));
  city.themes?.forEach((theme) => categories.add(theme));
  city.categories?.forEach((category) => categories.add(category));

  const oldTownWords = ["Old Town", "Historic", "Center", "Castle", "Temple"];
  if (
    city.stops.some((spot) =>
      oldTownWords.some((word) => spot.includes(word))
    )
  ) {
    categories.add("Old Town");
  }

  const scenicWords = ["Sunset", "View", "Lagoon", "River", "Canal", "Beach"];
  if (
    city.stops.some((spot) =>
      scenicWords.some((word) => spot.includes(word))
    )
  ) {
    categories.add("Scenic");
  }

  return Array.from(categories);
}

function getCityReason(city: City) {
  const categories = getCityCategories(city);

  if (categories.includes("Romantic")) return "For romantic city walks";
  if (categories.includes("Family")) return "Easy pick for family trips";
  if (categories.includes("Solo")) return "Walkable pick for solo travel";
  if (categories.includes("World Heritage")) return "Historic and cultural route";
  if (categories.includes("Scenic")) return "For scenic views and atmosphere";
  if (categories.includes("Old Town")) return "Best for old town wandering";

  return `Start with ${city.stops[0]}`;
}

function visualForCity(slug: string) {
  const visuals: Record<string, string> = {
    "rome-it":
      "linear-gradient(135deg, #d9a76f 0%, #b86b4b 42%, #3b2f2f 100%)",
    "venice-it":
      "linear-gradient(135deg, #9cc9d7 0%, #e7c389 46%, #8b5f4d 100%)",
    "florence-it":
      "linear-gradient(135deg, #d7a65f 0%, #b65f4a 48%, #2e2a32 100%)",
    "prague-cz":
      "linear-gradient(135deg, #d7b06f 0%, #6f8da8 46%, #2e3543 100%)",
    "dubrovnik-hr":
      "linear-gradient(135deg, #d58b5a 0%, #2f8da8 48%, #183747 100%)",
    "vienna-at":
      "linear-gradient(135deg, #e1c8a4 0%, #b98e65 48%, #42352f 100%)",
    "edinburgh-uk":
      "linear-gradient(135deg, #8e99a8 0%, #5c6675 46%, #252a33 100%)",
    "paris-fr":
      "linear-gradient(135deg, #c7d4df 0%, #d3b58d 44%, #4b4b58 100%)",
    "barcelona-es":
      "linear-gradient(135deg, #f0b45f 0%, #d95850 45%, #2e6f89 100%)",
    "kyoto-jp":
      "linear-gradient(135deg, #c6a96b 0%, #8da36f 48%, #2f3a2f 100%)",
    "amsterdam-nl":
      "linear-gradient(135deg, #8eb6c7 0%, #d9a35f 45%, #38465a 100%)",
  };

  return (
    visuals[slug] ??
    "linear-gradient(135deg, #e5c7a5 0%, #9fb8c9 48%, #30394a 100%)"
  );
}

function visualForIndex(index: number) {
  const visuals = [
    "linear-gradient(135deg, #d9a76f 0%, #b86b4b 44%, #3b2f2f 100%)",
    "linear-gradient(135deg, #9cc9d7 0%, #e7c389 46%, #8b5f4d 100%)",
    "linear-gradient(135deg, #c7d4df 0%, #d3b58d 44%, #4b4b58 100%)",
    "linear-gradient(135deg, #f0b45f 0%, #d95850 45%, #2e6f89 100%)",
  ];

  return visuals[index % visuals.length];
}

function getDiscoverySpots(cities: City[]) {
  const spots: DiscoverySpot[] = [];

  cities.forEach((city) => {
    if (city.spotDetails && city.spotDetails.length > 0) {
      city.spotDetails.forEach((spot) => {
        if (spot.isPublished === false) return;

        spots.push({
          citySlug: city.slug,
          cityName: city.city,
          country: city.country,
          slug: spot.slug,
          name: spot.name,
          summary: spot.summary,
          tags: spot.tags ?? [],
          canOpen: true,
        });
      });

      return;
    }

    city.stops.forEach((stop, index) => {
      spots.push({
        citySlug: city.slug,
        cityName: city.city,
        country: city.country,
        slug: slugify(stop),
        name: stop,
        summary: `A featured place from ${city.city}.`,
        tags: [index === 0 ? "Featured" : "Travel spot"],
        canOpen: false,
      });
    });
  });

  return spots.slice(0, 12);
}

function getSpotSearchResults(cities: City[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return [];

  const results: SpotSearchResult[] = [];

  cities.forEach((city) => {
    const cityCategories = getCityCategories(city);

    if (city.spotDetails && city.spotDetails.length > 0) {
      city.spotDetails.forEach((spot) => {
        if (spot.isPublished === false) return;

        const searchableText = [
          spot.name,
          spot.summary,
          ...spot.highlights,
          ...spot.bestFor,
          ...(spot.tags ?? []),
          city.city,
          city.country,
          ...cityCategories,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(normalizedQuery)) return;

        results.push({
          citySlug: city.slug,
          cityName: city.city,
          country: city.country,
          slug: spot.slug,
          name: spot.name,
          summary: spot.summary,
          highlights: spot.highlights,
          tags: spot.tags ?? [],
        });
      });

      return;
    }

    city.stops.forEach((stop, index) => {
      const searchableText = [stop, city.city, city.country, ...cityCategories]
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(normalizedQuery)) return;

      results.push({
        citySlug: city.slug,
        cityName: city.city,
        country: city.country,
        slug: slugify(stop),
        name: stop,
        summary: `A featured place from ${city.city}.`,
        highlights: [index === 0 ? "Featured spot" : "Travel spot"],
        tags: [index === 0 ? "Featured" : "Travel spot"],
      });
    });
  });

  return results.slice(0, 8);
}

export function CityExplorer({ cities }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const shouldRestore =
      sessionStorage.getItem("travelhubRestoreHomeScroll") === "1";

    if (!shouldRestore) return;

    const savedY = Number(sessionStorage.getItem("travelhubHomeScrollY") ?? "0");

    requestAnimationFrame(() => {
      window.scrollTo({
        top: savedY,
        behavior: "auto",
      });
    });

    sessionStorage.removeItem("travelhubRestoreHomeScroll");
  }, []);

  function rememberHomeScroll() {
    sessionStorage.setItem("travelhubHomeScrollY", String(window.scrollY));
  }

  const currentMonth = getCurrentMonth();
  const isSearching = query.trim().length > 0;

  const categories = useMemo(() => {
    const set = new Set<string>();

    cities.forEach((city) => {
      getCityCategories(city).forEach((category) => set.add(category));
    });

    const ordered = preferredOrder.filter((category) => set.has(category));
    const rest = Array.from(set)
      .filter((category) => !preferredOrder.includes(category))
      .sort();

    return ["All", ...ordered, ...rest];
  }, [cities]);

  const monthlyCities = cities.filter((city) => city.months?.includes(currentMonth));
  const thisMonthCities =
    monthlyCities.length > 0
      ? monthlyCities.slice(0, 6)
      : cities
          .filter((city) => {
            const categories = getCityCategories(city);
            return (
              categories.includes("Scenic") ||
              categories.includes("World Heritage") ||
              categories.includes("Old Town")
            );
          })
          .slice(0, 6);

  const discoverySpots = useMemo(() => {
    return getDiscoverySpots(cities);
  }, [cities]);

  const spotSearchResults = useMemo(() => {
    return getSpotSearchResults(cities, query);
  }, [cities, query]);

  const moodPreviewCities = useMemo(() => {
    const isMoodSelected = moodCards.some((mood) => mood.label === activeCategory);

    if (!isMoodSelected) return [];

    return cities
      .filter((city) => getCityCategories(city).includes(activeCategory))
      .slice(0, 3);
  }, [cities, activeCategory]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCities = cities.filter((city) => {
    const cityCategories = getCityCategories(city);

    const matchesCategory =
      activeCategory === "All" || cityCategories.includes(activeCategory);

    const searchableText = [
      city.city,
      city.country,
      ...city.stops,
      ...cityCategories,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      normalizedQuery === "" || searchableText.includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  function handleMoodClick(label: string) {
    setQuery("");

    setActiveCategory((current) => {
      if (current === label) return "All";
      return label;
    });
  }

  function handleSurpriseMe() {
    if (cities.length === 0) return;

    rememberHomeScroll();

    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    window.location.href = `/c/${randomCity.slug}?src=home&v=surprise_${randomCity.slug}`;
  }

  return (
    <main
      style={pageStyle}
      onClickCapture={(event) => {
        const target = event.target;

        if (!(target instanceof Element)) return;

        const anchor = target.closest("a");
        const href = anchor?.getAttribute("href");

        if (href?.startsWith("/c/")) {
          rememberHomeScroll();
        }
      }}
    >
      <section style={shellStyle}>
        <header style={navStyle}>
          <Link href="/" style={logoStyle}>
            TravelHub
          </Link>

          <div style={navPillStyle}>Short-video travel links</div>
        </header>

        <section style={heroStyle}>
          <div style={heroTextStyle}>
            <div style={eyebrowStyle}>Discover travel links by mood</div>

            <h1 style={heroTitleStyle}>
              Find the kind of trip you actually want.
            </h1>

            <p style={heroSubtitleStyle}>
              Browse by month, mood, city, or spot. Then jump straight to hotel,
              tour, and travel links when a place feels right.
            </p>

            <div style={searchBoxStyle}>
              <span style={searchIconStyle}>⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search city, country, season, or spot..."
                style={searchInputStyle}
              />
            </div>

            <div style={heroActionsStyle}>
              <button
                type="button"
                onClick={handleSurpriseMe}
                style={primaryHeroButtonStyle}
              >
                Surprise me
              </button>

              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory((current) =>
                    current === currentMonth ? "All" : currentMonth
                  );
                }}
                style={secondaryHeroButtonStyle}
              >
                Best in {currentMonth}
              </button>
            </div>
          </div>

          <div style={heroPreviewStyle}>
            <div style={heroImageStyle}>
              <div style={floatingCardStyle}>
                <div style={floatingSmallTextStyle}>This month</div>
                <div style={floatingTitleStyle}>
                  {thisMonthCities[0]?.city ?? "Rome"},{" "}
                  {thisMonthCities[0]?.country ?? "Italy"}
                </div>
                <div style={floatingSubStyle}>
                  {currentMonth} · Cities · Spots · Links
                </div>
              </div>
            </div>
          </div>
        </section>

        {isSearching && (
          <section style={feedSectionStyle}>
            <div style={sectionHeaderStyle}>
              <div>
                <div style={smallLabelStyle}>Search results</div>
                <h2 style={sectionTitleStyle}>Matching spots</h2>
              </div>
              <span style={mutedTextStyle}>
                {spotSearchResults.length} spot results
              </span>
            </div>

            {spotSearchResults.length === 0 ? (
              <div style={searchEmptyStyle}>
                No matching spots found. Try a city, mood, season, or broader
                keyword.
              </div>
            ) : (
              <div style={searchResultGridStyle}>
                {spotSearchResults.map((spot, index) => (
                  <Link
                    key={`${spot.citySlug}-${spot.slug}-${index}`}
                    href={`/c/${spot.citySlug}/spot/${spot.slug}?src=home&v=search_${spot.citySlug}_${spot.slug}`}
                    style={searchResultCardStyle}
                  >
                    <div
                      style={{
                        ...searchResultVisualStyle,
                        background: visualForIndex(index),
                      }}
                    >
                      <div style={visualBadgeStyle}>{spot.cityName}</div>
                    </div>

                    <div style={searchResultBodyStyle}>
                      <div style={searchResultMetaStyle}>
                        {spot.cityName}, {spot.country}
                      </div>

                      <h3 style={searchResultTitleStyle}>{spot.name}</h3>

                      <p style={searchResultTextStyle}>{spot.summary}</p>

                      <div style={chipRowStyle}>
                        {(spot.tags.length > 0
                          ? spot.tags
                          : spot.highlights
                        )
                          .slice(0, 3)
                          .map((tag, tagIndex) => (
                            <span
                              key={`${tag}-${tagIndex}`}
                              style={smallChipStyle}
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        <TravelDiscoveryTools cities={cities} />

        <section style={feedSectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>This month</div>
              <h2 style={sectionTitleStyle}>Best places in {currentMonth}</h2>
            </div>
            <span style={mutedTextStyle}>Seasonal picks</span>
          </div>

          <div style={horizontalRailStyle}>
            {thisMonthCities.map((city, index) => (
              <Link
                key={`${city.slug}-month-${index}`}
                href={`/c/${city.slug}?src=home&v=this_month_${city.slug}`}
                style={largeRailCardStyle}
              >
                <div
                  style={{
                    ...largeRailVisualStyle,
                    background: visualForCity(city.slug),
                  }}
                >
                  <div style={visualBadgeStyle}>{currentMonth}</div>
                </div>

                <div style={railCardBodyStyle}>
                  <h3 style={railCardTitleStyle}>{city.city}</h3>
                  <p style={railCardCountryStyle}>{city.country}</p>
                  <p style={railCardReasonStyle}>{getCityReason(city)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={feedSectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Explore by spot</div>
              <h2 style={sectionTitleStyle}>Start from a place, not a city</h2>
            </div>
            <span style={mutedTextStyle}>Spot-led discovery</span>
          </div>

          <div style={horizontalRailStyle}>
            {discoverySpots.map((spot, index) => {
              const href = spot.canOpen
                ? `/c/${spot.citySlug}/spot/${spot.slug}?src=home&v=spot_${spot.citySlug}_${spot.slug}`
                : `/c/${spot.citySlug}?src=home&v=spot_preview_${spot.citySlug}`;

              return (
                <Link
                  key={`${spot.citySlug}-${spot.slug}-${index}`}
                  href={href}
                  style={spotDiscoveryCardStyle}
                >
                  <div
                    style={{
                      ...spotDiscoveryVisualStyle,
                      background: visualForIndex(index),
                    }}
                  >
                    <div style={visualBadgeStyle}>{spot.cityName}</div>
                  </div>

                  <div style={spotDiscoveryBodyStyle}>
                    <h3 style={spotDiscoveryTitleStyle}>{spot.name}</h3>
                    <p style={spotDiscoveryMetaStyle}>
                      {spot.cityName}, {spot.country}
                    </p>
                    <p style={spotDiscoveryTextStyle}>{spot.summary}</p>

                    <div style={chipRowStyle}>
                      {(spot.tags.length > 0 ? spot.tags : ["Featured"])
                        .slice(0, 2)
                        .map((tag, tagIndex) => (
                          <span
                            key={`${tag}-${tagIndex}`}
                            style={smallChipStyle}
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section style={feedSectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Travel mood</div>
              <h2 style={sectionTitleStyle}>Choose how you want to travel</h2>
            </div>
            <span style={mutedTextStyle}>Tap again to clear</span>
          </div>

          <div style={moodGridStyle}>
            {moodCards.map((mood) => {
              const isActive = activeCategory === mood.label;

              return (
                <button
                  key={mood.label}
                  type="button"
                  onClick={() => handleMoodClick(mood.label)}
                  style={isActive ? activeMoodCardStyle : moodCardStyle}
                >
                  <div style={moodTitleStyle}>{mood.title}</div>
                  <div style={moodTextStyle}>{mood.text}</div>
                  <div style={moodActionStyle}>
                    {isActive ? "Selected" : "Explore"}
                  </div>
                </button>
              );
            })}
          </div>

          {moodPreviewCities.length > 0 && (
            <div style={moodResultBoxStyle}>
              <div style={moodResultHeaderStyle}>
                <div>
                  <div style={smallLabelStyle}>Selected mood</div>
                  <h3 style={moodResultTitleStyle}>Best for {activeCategory}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveCategory("All")}
                  style={clearMoodButtonStyle}
                >
                  Clear
                </button>
              </div>

              <div style={moodResultGridStyle}>
                {moodPreviewCities.map((city, index) => (
                  <Link
                    key={`${city.slug}-mood-result-${index}`}
                    href={`/c/${city.slug}?src=home&v=mood_${activeCategory}_${city.slug}`}
                    style={moodResultCardStyle}
                  >
                    <div>
                      <div style={moodResultCityStyle}>{city.city}</div>
                      <div style={moodResultMetaStyle}>
                        {city.country} · {city.stops[0]}
                      </div>
                    </div>

                    <div style={moodResultArrowStyle}>→</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        <section style={contentStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>All destinations</div>
              <h2 style={sectionTitleStyle}>Choose a city</h2>
            </div>
            <span style={mutedTextStyle}>
              {filteredCities.length} / {cities.length} cities
            </span>
          </div>

          <div style={categoryWrapStyle}>
            {categories.map((category) => {
              const isActive = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setActiveCategory((current) =>
                      current === category ? "All" : category
                    )
                  }
                  style={isActive ? activeCategoryStyle : categoryButtonStyle}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {filteredCities.length === 0 ? (
            <div style={emptyStyle}>
              No cities found. Try another keyword or category.
            </div>
          ) : (
            <section style={destinationGridStyle}>
              {filteredCities.map((city, index) => (
                <Link
                  key={`${city.slug}-grid-${index}`}
                  href={`/c/${city.slug}?src=home&v=home_${city.slug}`}
                  style={destinationCardStyle}
                >
                  <div
                    style={{
                      ...destinationVisualStyle,
                      background: visualForCity(city.slug),
                    }}
                  >
                    <div style={countryBadgeStyle}>{city.country}</div>
                  </div>

                  <div style={destinationBodyStyle}>
                    <div style={destinationTopStyle}>
                      <div style={destinationTextStyle}>
                        <h3 style={destinationTitleStyle}>{city.city}</h3>
                        <p style={destinationCountryStyle}>{city.country}</p>
                      </div>

                      <div style={arrowStyle}>→</div>
                    </div>

                    <p style={destinationReasonStyle}>{getCityReason(city)}</p>

                    <div style={spotsStyle}>
                      <span>{city.stops[0]}</span>
                      <span>{city.stops[1]}</span>
                      <span>{city.stops[2]}</span>
                    </div>

                    <div style={actionRowStyle}>
                      <span style={primaryMiniStyle}>Hotels</span>
                      <span style={secondaryMiniStyle}>Tours</span>
                    </div>
                  </div>
                </Link>
              ))}
            </section>
          )}

          <p style={disclosureStyle}>
            Some links may be affiliate links. We may earn a commission if you
            book through them, at no extra cost to you.
          </p>
        </section>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  overflowX: "hidden",
  background:
    "radial-gradient(circle at 12% 0%, rgba(255, 221, 180, 0.72), transparent 30%), radial-gradient(circle at 88% 4%, rgba(175, 205, 255, 0.58), transparent 28%), linear-gradient(180deg, #fbf7f0 0%, #ffffff 44%, #eef4f8 100%)",
  color: "#0D2B52",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

const shellStyle: CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: "18px 16px 48px",
};

const navStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 28,
};

const logoStyle: CSSProperties = {
  color: "inherit",
  textDecoration: "none",
  fontSize: 18,
  fontWeight: 850,
  letterSpacing: "-0.035em",
};

const navPillStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.72)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  fontSize: 12,
  fontWeight: 650,
  opacity: 0.78,
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
};

const heroStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
  gap: 24,
  alignItems: "center",
  marginBottom: 38,
};

const heroTextStyle: CSSProperties = {
  padding: "20px 0",
  minWidth: 0,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  opacity: 0.58,
  marginBottom: 14,
};

const heroTitleStyle: CSSProperties = {
  margin: "0 0 18px",
  maxWidth: 760,
  fontSize: "clamp(36px, 10vw, 78px)",
  lineHeight: 1.02,
  letterSpacing: "-0.04em",
  fontWeight: 850,
  overflowWrap: "break-word",
};

const heroSubtitleStyle: CSSProperties = {
  margin: "0 0 24px",
  maxWidth: 580,
  fontSize: "clamp(15px, 4vw, 17px)",
  lineHeight: 1.65,
  opacity: 0.72,
};

const searchBoxStyle: CSSProperties = {
  maxWidth: 590,
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "7px 8px 7px 16px",
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.88)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 22px 60px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(18px)",
};

const searchIconStyle: CSSProperties = {
  fontSize: 22,
  opacity: 0.5,
  flexShrink: 0,
};

const searchInputStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  padding: "15px 8px",
  border: 0,
  outline: "none",
  background: "transparent",
  fontSize: 16,
  color: "#0D2B52",
};

const heroActionsStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 14,
};

const primaryHeroButtonStyle: CSSProperties = {
  border: 0,
  padding: "13px 16px",
  borderRadius: 999,
  background: "#0D2B52",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 850,
  cursor: "pointer",
  boxShadow: "0 14px 34px rgba(0, 0, 0, 0.16)",
};

const secondaryHeroButtonStyle: CSSProperties = {
  border: "1px solid rgba(0, 0, 0, 0.1)",
  padding: "13px 16px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.78)",
  color: "#0D2B52",
  fontSize: 14,
  fontWeight: 800,
  cursor: "pointer",
};

const heroPreviewStyle: CSSProperties = {
  position: "relative",
  minWidth: 0,
};

const heroImageStyle: CSSProperties = {
  minHeight: "clamp(250px, 68vw, 420px)",
  borderRadius: 32,
  background:
    "linear-gradient(135deg, #d9a76f 0%, #b86b4b 42%, #3b2f2f 100%)",
  boxShadow: "0 30px 80px rgba(0, 0, 0, 0.2)",
  position: "relative",
  overflow: "hidden",
};

const floatingCardStyle: CSSProperties = {
  position: "absolute",
  left: 18,
  right: 18,
  bottom: 18,
  padding: 16,
  borderRadius: 22,
  background: "rgba(255, 255, 255, 0.82)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.16)",
};

const floatingSmallTextStyle: CSSProperties = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  opacity: 0.55,
  marginBottom: 8,
};

const floatingTitleStyle: CSSProperties = {
  fontSize: "clamp(22px, 7vw, 28px)",
  fontWeight: 850,
  letterSpacing: "-0.035em",
};

const floatingSubStyle: CSSProperties = {
  marginTop: 6,
  fontSize: 13,
  opacity: 0.65,
  fontWeight: 650,
};

const feedSectionStyle: CSSProperties = {
  marginBottom: 40,
};

const contentStyle: CSSProperties = {
  marginTop: 10,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-end",
  marginBottom: 16,
  flexWrap: "wrap",
};

const smallLabelStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  opacity: 0.5,
  marginBottom: 6,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(24px, 6vw, 30px)",
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const mutedTextStyle: CSSProperties = {
  fontSize: 13,
  opacity: 0.6,
  whiteSpace: "nowrap",
};

const horizontalRailStyle: CSSProperties = {
  display: "flex",
  gap: 14,
  overflowX: "auto",
  padding: "2px 2px 16px",
  scrollSnapType: "x mandatory",
};

const largeRailCardStyle: CSSProperties = {
  display: "block",
  minWidth: "min(78vw, 340px)",
  maxWidth: 360,
  borderRadius: 30,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 24px 70px rgba(0, 0, 0, 0.1)",
  color: "inherit",
  textDecoration: "none",
  overflow: "hidden",
  scrollSnapAlign: "start",
};

const largeRailVisualStyle: CSSProperties = {
  height: 210,
  position: "relative",
};

const visualBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  padding: "8px 11px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.78)",
  backdropFilter: "blur(12px)",
  fontSize: 12,
  fontWeight: 800,
};

const railCardBodyStyle: CSSProperties = {
  padding: 18,
};

const railCardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 25,
  lineHeight: 1.05,
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const railCardCountryStyle: CSSProperties = {
  margin: "7px 0 0",
  fontSize: 14,
  opacity: 0.62,
};

const railCardReasonStyle: CSSProperties = {
  margin: "12px 0 0",
  fontSize: 14,
  lineHeight: 1.45,
  opacity: 0.72,
};

const searchEmptyStyle: CSSProperties = {
  padding: 20,
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.78)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  fontSize: 14,
  lineHeight: 1.6,
  opacity: 0.72,
};

const searchResultGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 14,
};

const searchResultCardStyle: CSSProperties = {
  display: "block",
  borderRadius: 28,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 20px 58px rgba(0, 0, 0, 0.08)",
  color: "inherit",
  textDecoration: "none",
  overflow: "hidden",
};

const searchResultVisualStyle: CSSProperties = {
  height: 150,
  position: "relative",
};

const searchResultBodyStyle: CSSProperties = {
  padding: 17,
};

const searchResultMetaStyle: CSSProperties = {
  marginBottom: 7,
  fontSize: 13,
  opacity: 0.62,
  fontWeight: 650,
};

const searchResultTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 23,
  lineHeight: 1.05,
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const searchResultTextStyle: CSSProperties = {
  margin: "10px 0 14px",
  fontSize: 13,
  lineHeight: 1.5,
  opacity: 0.7,
};

const spotDiscoveryCardStyle: CSSProperties = {
  display: "block",
  minWidth: "min(76vw, 310px)",
  maxWidth: 330,
  borderRadius: 28,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 20px 58px rgba(0, 0, 0, 0.08)",
  color: "inherit",
  textDecoration: "none",
  overflow: "hidden",
  scrollSnapAlign: "start",
};

const spotDiscoveryVisualStyle: CSSProperties = {
  height: 155,
  position: "relative",
};

const spotDiscoveryBodyStyle: CSSProperties = {
  padding: 17,
};

const spotDiscoveryTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 22,
  lineHeight: 1.05,
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const spotDiscoveryMetaStyle: CSSProperties = {
  margin: "7px 0 0",
  fontSize: 13,
  opacity: 0.62,
  fontWeight: 650,
};

const spotDiscoveryTextStyle: CSSProperties = {
  margin: "12px 0 14px",
  fontSize: 13,
  lineHeight: 1.5,
  opacity: 0.7,
};

const chipRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 7,
};

const smallChipStyle: CSSProperties = {
  padding: "7px 9px",
  borderRadius: 999,
  background: "rgba(0, 0, 0, 0.06)",
  fontSize: 12,
  fontWeight: 750,
};

const moodGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
  gap: 12,
};

const moodCardStyle: CSSProperties = {
  textAlign: "left",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  borderRadius: 26,
  padding: 18,
  background: "rgba(255, 255, 255, 0.78)",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.07)",
  color: "#0D2B52",
  cursor: "pointer",
};

const activeMoodCardStyle: CSSProperties = {
  ...moodCardStyle,
  background: "#0D2B52",
  color: "#ffffff",
};

const moodTitleStyle: CSSProperties = {
  fontSize: 20,
  lineHeight: 1.08,
  letterSpacing: "-0.04em",
  fontWeight: 850,
  marginBottom: 9,
};

const moodTextStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.55,
  opacity: 0.7,
  marginBottom: 16,
};

const moodActionStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 850,
};

const moodResultBoxStyle: CSSProperties = {
  marginTop: 14,
  padding: 16,
  borderRadius: 26,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.07)",
};

const moodResultHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
  marginBottom: 12,
};

const moodResultTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 22,
  lineHeight: 1.05,
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const clearMoodButtonStyle: CSSProperties = {
  border: "1px solid rgba(0, 0, 0, 0.1)",
  borderRadius: 999,
  padding: "8px 10px",
  background: "#ffffff",
  color: "#0D2B52",
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
};

const moodResultGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
  gap: 10,
};

const moodResultCardStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: 13,
  borderRadius: 18,
  background: "rgba(0, 0, 0, 0.04)",
  color: "inherit",
  textDecoration: "none",
};

const moodResultCityStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 850,
};

const moodResultMetaStyle: CSSProperties = {
  marginTop: 3,
  fontSize: 12,
  opacity: 0.62,
};

const moodResultArrowStyle: CSSProperties = {
  fontWeight: 850,
  opacity: 0.62,
};

const categoryWrapStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  overflowX: "auto",
  paddingBottom: 14,
  marginBottom: 8,
};

const categoryButtonStyle: CSSProperties = {
  border: "1px solid rgba(0, 0, 0, 0.1)",
  background: "rgba(255, 255, 255, 0.74)",
  color: "#0D2B52",
  borderRadius: 999,
  padding: "10px 13px",
  fontSize: 13,
  fontWeight: 700,
  whiteSpace: "nowrap",
  cursor: "pointer",
  boxShadow: "0 10px 28px rgba(0, 0, 0, 0.04)",
};

const activeCategoryStyle: CSSProperties = {
  ...categoryButtonStyle,
  background: "#0D2B52",
  color: "#ffffff",
  border: "1px solid #0D2B52",
};

const destinationGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 16,
};

const destinationCardStyle: CSSProperties = {
  display: "block",
  borderRadius: 28,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 20px 58px rgba(0, 0, 0, 0.08)",
  color: "inherit",
  textDecoration: "none",
  overflow: "hidden",
};

const destinationVisualStyle: CSSProperties = {
  height: "clamp(140px, 40vw, 160px)",
  position: "relative",
};

const countryBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.76)",
  backdropFilter: "blur(12px)",
  fontSize: 12,
  fontWeight: 750,
};

const destinationBodyStyle: CSSProperties = {
  padding: 18,
};

const destinationTopStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  alignItems: "flex-start",
  marginBottom: 14,
};

const destinationTextStyle: CSSProperties = {
  minWidth: 0,
};

const destinationTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(22px, 6vw, 25px)",
  lineHeight: 1.05,
  letterSpacing: "-0.035em",
  overflowWrap: "break-word",
};

const destinationCountryStyle: CSSProperties = {
  margin: "7px 0 0",
  fontSize: 14,
  opacity: 0.62,
};

const destinationReasonStyle: CSSProperties = {
  margin: "0 0 14px",
  fontSize: 13,
  lineHeight: 1.45,
  opacity: 0.7,
  fontWeight: 650,
};

const arrowStyle: CSSProperties = {
  width: 34,
  height: 34,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "#0D2B52",
  color: "#ffffff",
  fontWeight: 800,
  flexShrink: 0,
};

const spotsStyle: CSSProperties = {
  display: "grid",
  gap: 7,
  fontSize: 14,
  lineHeight: 1.35,
  opacity: 0.74,
  marginBottom: 16,
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const primaryMiniStyle: CSSProperties = {
  padding: "7px 10px",
  borderRadius: 999,
  background: "#0D2B52",
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 750,
};

const secondaryMiniStyle: CSSProperties = {
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(0, 0, 0, 0.06)",
  color: "#0D2B52",
  fontSize: 12,
  fontWeight: 750,
};

const emptyStyle: CSSProperties = {
  padding: "28px",
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.76)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  textAlign: "center",
  opacity: 0.72,
};

const disclosureStyle: CSSProperties = {
  margin: "34px auto 0",
  maxWidth: 560,
  textAlign: "center",
  fontSize: 12,
  lineHeight: 1.6,
  opacity: 0.52,
};

