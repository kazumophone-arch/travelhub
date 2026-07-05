"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./ScrollyCityStory.module.css";
import { AffiliateButtonGroup } from "@/components/AffiliateButtonGroup";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TierCtaLink } from "@/components/TierCtaLink";
import { AIRALO_URL } from "@/lib/quick-affiliate-links";
import { buildScrollySections } from "@/lib/scrolly-sections";
import type {
  ScrollyArticleSection,
  ScrollyClimateSection,
  ScrollyHeroSection,
  ScrollySpotSection,
} from "@/lib/scrolly-sections";
import {
  SAMPLE_SEASONS,
  SAMPLE_STAY_AREAS,
  SAMPLE_STAY_LENGTHS,
  SAMPLE_TOUR_CATEGORIES,
} from "@/lib/scrolly-sample-data";
import { DEMAND_META } from "@/lib/climate";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import type { CityDetailSpot } from "@/components/CityDetailView";
import type { TrackingParams } from "@/lib/tracking-query";
import { getCssImagePosition } from "@/lib/url-fields";

type Props = {
  city: SupabasePublicCity;
  spots: CityDetailSpot[];
  tracking?: TrackingParams;
};

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

// A "display section" is one vertical scroll-snap slot in the story. Real
// (non-sample) sections come from buildScrollySections(); sample sections
// (seasons, stay length, stay areas, tours) are appended around them in the
// fixed order approved by the owner. Every display section gets its own
// footprint indicator and background image.
type DisplaySection =
  | { kind: "hero"; key: string; imageUrl: string; imagePosition?: string | null; data: ScrollyHeroSection }
  | { kind: "seasons"; key: string; imageUrl: string; imagePosition?: string | null }
  | { kind: "climate"; key: string; imageUrl: string; imagePosition?: string | null; data: ScrollyClimateSection }
  | { kind: "stayLength"; key: string; imageUrl: string; imagePosition?: string | null }
  | { kind: "spots"; items: Array<{ key: string; imageUrl: string; imagePosition?: string | null; data: ScrollySpotSection }> }
  | { kind: "stayAreas"; key: string; imageUrl: string; imagePosition?: string | null }
  | { kind: "tours"; key: string; imageUrl: string; imagePosition?: string | null }
  | { kind: "articles"; key: string; imageUrl: string; imagePosition?: string | null; data: ScrollyArticleSection };

export function ScrollyCityStory({ city, spots, tracking }: Props) {
  const sections = buildScrollySections(city, spots);
  const spotTrackingQuery = getTrackingQuery(tracking);

  const heroSection = sections.find((s): s is ScrollyHeroSection => s.kind === "hero");
  const climateSection = sections.find((s): s is ScrollyClimateSection => s.kind === "climate");
  const spotSections = sections.filter((s): s is ScrollySpotSection => s.kind === "spot");
  const articleSection = sections.find((s): s is ScrollyArticleSection => s.kind === "article");

  // Shared image pool for the sample "Best time to visit" tabs: hero image
  // plus each spot image, reused in order. No new imagery is fabricated.
  const sampleImagePool = [
    heroSection?.imageUrl,
    ...spotSections.map((s) => s.imageUrl),
  ].filter((url): url is string => Boolean(url));

  const fallbackImageUrl = heroSection?.imageUrl ?? spotSections[0]?.imageUrl ?? "";

  // Build the fixed, owner-approved section order. Sections with no
  // supporting image are skipped entirely (mirrors the "no fabrication"
  // rule already used by buildScrollySections for real data).
  const displaySections: DisplaySection[] = [];

  if (heroSection) {
    displaySections.push({
      kind: "hero",
      key: heroSection.key,
      imageUrl: heroSection.imageUrl,
      imagePosition: heroSection.imagePosition,
      data: heroSection,
    });
  }

  if (sampleImagePool.length > 0) {
    displaySections.push({
      kind: "seasons",
      key: `sample-seasons-${city.slug}`,
      imageUrl: sampleImagePool[0],
    });
  }

  if (climateSection) {
    displaySections.push({
      kind: "climate",
      key: climateSection.key,
      imageUrl: climateSection.imageUrl,
      imagePosition: climateSection.imagePosition,
      data: climateSection,
    });
  }

  if (fallbackImageUrl) {
    displaySections.push({
      kind: "stayLength",
      key: `sample-stay-length-${city.slug}`,
      imageUrl: fallbackImageUrl,
    });
  }

  if (spotSections.length > 0) {
    displaySections.push({
      kind: "spots",
      items: spotSections.map((s) => ({
        key: s.key,
        imageUrl: s.imageUrl,
        imagePosition: s.imagePosition,
        data: s,
      })),
    });
  }

  if (fallbackImageUrl) {
    displaySections.push({
      kind: "stayAreas",
      key: `sample-stay-areas-${city.slug}`,
      imageUrl: fallbackImageUrl,
    });
  }

  if (fallbackImageUrl) {
    displaySections.push({
      kind: "tours",
      key: `sample-tours-${city.slug}`,
      imageUrl: fallbackImageUrl,
      imagePosition: heroSection?.imagePosition,
    });
  }

  if (articleSection) {
    displaySections.push({
      kind: "articles",
      key: articleSection.key,
      imageUrl: articleSection.imageUrl,
      imagePosition: articleSection.imagePosition,
      data: articleSection,
    });
  }

  // Flatten to (index -> background image) for the background layer and
  // footprint nav, treating the "spots" slot as a single indicator whose
  // background follows the currently active spot card.
  type FlatEntry = { key: string; imageUrl: string; imagePosition?: string | null };
  const flatEntries: FlatEntry[] = [];
  const slotStartIndex: number[] = [];

  displaySections.forEach((slot) => {
    slotStartIndex.push(flatEntries.length);
    if (slot.kind === "spots") {
      for (const item of slot.items) {
        flatEntries.push({ key: item.key, imageUrl: item.imageUrl, imagePosition: item.imagePosition });
      }
    } else {
      flatEntries.push({ key: slot.key, imageUrl: slot.imageUrl, imagePosition: slot.imagePosition });
    }
  });

  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const spotCardRefs = useRef<Array<HTMLElement | null>>([]);
  const spotTrackRef = useRef<HTMLDivElement | null>(null);
  const articleCardRefs = useRef<Array<HTMLElement | null>>([]);
  const articleTrackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSeason, setActiveSeason] = useState(SAMPLE_SEASONS[0]?.key ?? "spring");

  const spotsSlotIndex = displaySections.findIndex((s) => s.kind === "spots");
  const firstSpotFlatIndex = spotsSlotIndex >= 0 ? slotStartIndex[spotsSlotIndex] : -1;

  const articlesSlotIndex = displaySections.findIndex((s) => s.kind === "articles");
  const firstArticleFlatIndex = articlesSlotIndex >= 0 ? slotStartIndex[articlesSlotIndex] : -1;

  useEffect(() => {
    const elements = sectionRefs.current.filter(
      (element): element is HTMLElement => Boolean(element)
    );

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const isSpotSlot = entry.target.getAttribute("data-slot-kind") === "spots";
          const isArticleSlot = entry.target.getAttribute("data-slot-kind") === "articles";
          if (isSpotSlot || isArticleSlot) {
            const firstIndex = Number(entry.target.getAttribute("data-first-flat-index"));
            if (!Number.isNaN(firstIndex)) {
              setActiveIndex(firstIndex);
            }
            continue;
          }

          const index = Number(entry.target.getAttribute("data-flat-index"));
          if (!Number.isNaN(index)) {
            setActiveIndex(index);
          }
        }
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      }
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [displaySections.length]);

  useEffect(() => {
    const trackElement = spotTrackRef.current;
    if (!trackElement) return;

    const cardElements = spotCardRefs.current.filter(
      (element): element is HTMLElement => Boolean(element)
    );

    if (cardElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const index = Number(entry.target.getAttribute("data-flat-index"));
          if (!Number.isNaN(index)) {
            setActiveIndex(index);
          }
        }
      },
      {
        root: trackElement,
        threshold: 0.6,
      }
    );

    for (const element of cardElements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [displaySections.length]);

  useEffect(() => {
    const trackElement = articleTrackRef.current;
    if (!trackElement) return;

    const cardElements = articleCardRefs.current.filter(
      (element): element is HTMLElement => Boolean(element)
    );

    if (cardElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const index = Number(entry.target.getAttribute("data-flat-index"));
          if (!Number.isNaN(index)) {
            setActiveIndex(index);
          }
        }
      },
      {
        root: trackElement,
        threshold: 0.6,
      }
    );

    for (const element of cardElements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [displaySections.length]);

  const activeSeasonData =
    SAMPLE_SEASONS.find((season) => season.key === activeSeason) ?? SAMPLE_SEASONS[0];
  const seasonImageUrl =
    activeSeasonData && sampleImagePool.length > 0
      ? sampleImagePool[activeSeasonData.imageIndex % sampleImagePool.length]
      : fallbackImageUrl;

  return (
    <main className={styles.page}>
      <div className={styles.backgroundLayer} aria-hidden="true">
        {flatEntries.map((entry, index) => {
          // The "seasons" slot swaps its own background based on the
          // selected season tab, overriding the default flat entry image.
          const slotForIndex = displaySections.find((slot, slotIndex) => {
            const start = slotStartIndex[slotIndex];
            const count = slot.kind === "spots" ? slot.items.length : 1;
            return index >= start && index < start + count;
          });
          const isSeasonsSlot = slotForIndex?.kind === "seasons";
          const imageUrl = isSeasonsSlot ? seasonImageUrl || entry.imageUrl : entry.imageUrl;

          return (
            <div
              key={`bg-${entry.key}`}
              className={styles.backgroundImage}
              data-active={index === activeIndex}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt=""
                className={styles.backgroundImageEl}
                style={{
                  objectPosition: getCssImagePosition(entry.imagePosition),
                }}
                fetchPriority={index === 0 ? "high" : "low"}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          );
        })}
        <div className={styles.backgroundScrim} />
      </div>

      {flatEntries.length > 1 ? (
        <nav className={styles.footprintNav} aria-label="Story progress">
          {flatEntries.map((entry, index) => {
            const state =
              index === activeIndex ? "current" : index < activeIndex ? "visited" : "upcoming";

            return (
              <span
                key={`nav-${entry.key}`}
                className={styles.footprint}
                data-state={state}
                aria-hidden="true"
              >
                👣
              </span>
            );
          })}
        </nav>
      ) : null}

      <div className={styles.content}>
        {displaySections.map((slot, slotIndex) => {
          const flatIndex = slotStartIndex[slotIndex];

          if (slot.kind === "hero") {
            return (
              <section
                key={slot.key}
                ref={(element) => {
                  sectionRefs.current[flatIndex] = element;
                }}
                data-flat-index={flatIndex}
                className={styles.section}
              >
                <div className={styles.heroBlock}>
                  <Breadcrumbs
                    tone="light"
                    items={[
                      { label: "Home", href: "/" },
                      { label: "Destinations", href: "/cities" },
                      { label: city.city },
                    ]}
                  />

                  <h1 className={styles.heroTitle}>{city.city}</h1>
                  <p className={styles.heroCountry}>{city.country}</p>

                  <div className={styles.heroCtaStack}>
                    <div className={styles.heroAffiliateGroup}>
                      <AffiliateButtonGroup
                        city={city}
                        src="city-detail"
                        v={`city_detail_${city.slug}`}
                        variant="city"
                        tone="dark"
                        showHotels
                        showTours
                        compact
                        hideDisclosure
                      />

                      <TierCtaLink
                        href={AIRALO_URL}
                        affiliateType="esim"
                        citySlug={city.slug}
                        source="city-detail"
                        className={styles.heroCtaEsim}
                      >
                        Get an eSIM
                      </TierCtaLink>
                    </div>

                    <p className={styles.heroCtaDisclosure}>
                      External affiliate links. Taleglen may earn a commission at no extra cost
                      to you.
                    </p>
                  </div>
                </div>
              </section>
            );
          }

          if (slot.kind === "seasons") {
            return (
              <section
                key={slot.key}
                ref={(element) => {
                  sectionRefs.current[flatIndex] = element;
                }}
                data-flat-index={flatIndex}
                className={styles.section}
              >
                <div className={styles.panelBlock}>
                  <div className={styles.spotLabel}>Best time to visit</div>
                  <h2 className={styles.panelTitle}>When to visit {city.city}</h2>

                  {city.season_note ? (
                    <p className={styles.panelLead}>{city.season_note}</p>
                  ) : null}

                  {city.best_months && city.best_months.length > 0 ? (
                    <p className={styles.panelSubLead}>
                      Best months: {city.best_months.join(", ")}
                    </p>
                  ) : null}

                  <span className={styles.sampleBadge}>Sample</span>

                  <div className={styles.seasonTabs} role="tablist" aria-label="Choose a season (sample)">
                    {SAMPLE_SEASONS.map((season) => (
                      <button
                        key={season.key}
                        type="button"
                        role="tab"
                        aria-selected={season.key === activeSeason}
                        className={styles.seasonTab}
                        data-active={season.key === activeSeason}
                        onClick={() => setActiveSeason(season.key)}
                      >
                        {season.label}
                      </button>
                    ))}
                  </div>

                  <div className={styles.sampleCard}>
                    <p className={styles.sampleText}>{activeSeasonData?.sampleHighlight}</p>
                  </div>
                </div>
              </section>
            );
          }

          if (slot.kind === "climate") {
            const climate = slot.data.climate;
            const temps = climate.months.flatMap((m) =>
              [m.high, m.low].filter((v): v is number => v !== null)
            );
            const hasTemps = temps.length > 0;
            const minTemp = hasTemps ? Math.min(...temps) : 0;
            const maxTemp = hasTemps ? Math.max(...temps) : 1;
            const span = maxTemp - minTemp || 1;

            return (
              <section
                key={slot.key}
                ref={(element) => {
                  sectionRefs.current[flatIndex] = element;
                }}
                data-flat-index={flatIndex}
                className={styles.section}
              >
                <div className={styles.panelBlock}>
                  <div className={styles.spotLabel}>Weather & crowds</div>
                  <h2 className={styles.panelTitle}>Climate in {slot.data.cityName}</h2>

                  {climate.weather_summary ? (
                    <p className={styles.panelLead}>{climate.weather_summary}</p>
                  ) : null}

                  <div className={styles.climateHighlights}>
                    {climate.peak_season ? (
                      <div className={styles.climateHighlightCard}>
                        <span className={styles.climateHighlightLabel}>Peak season</span>
                        <p className={styles.climateHighlightValue}>★ {climate.peak_season}</p>
                      </div>
                    ) : null}
                    {climate.value_season ? (
                      <div className={styles.climateHighlightCard}>
                        <span className={styles.climateHighlightLabel}>Best value</span>
                        <p className={styles.climateHighlightValue}>{climate.value_season}</p>
                      </div>
                    ) : null}
                  </div>

                  {hasTemps ? (
                    <div className={styles.darkChart}>
                      {climate.months.map((month) => {
                        const meta = DEMAND_META[month.demand];
                        const high = month.high;
                        const low = month.low;
                        const topValue = high ?? low ?? minTemp;
                        const bottomValue = low ?? high ?? minTemp;
                        const topPct = ((topValue - minTemp) / span) * 100;
                        const bottomPct = ((bottomValue - minTemp) / span) * 100;
                        const barHeight = Math.max(topPct - bottomPct, 4);
                        const isPeak = month.demand === "peak";

                        return (
                          <div key={month.month} className={styles.darkChartColumn}>
                            <div className={styles.darkChartHigh}>
                              {high !== null ? `${Math.round(high)}°` : "–"}
                            </div>
                            <div className={styles.darkChartTrack}>
                              <div
                                className={styles.darkChartBar}
                                style={{
                                  bottom: `${bottomPct}%`,
                                  height: `${barHeight}%`,
                                  background: meta.color,
                                }}
                                title={`${month.month}: ${high ?? "–"}° / ${low ?? "–"}° — ${meta.label}`}
                              >
                                {isPeak ? (
                                  <span className={styles.darkChartPeakMark} aria-hidden="true">
                                    ★
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className={styles.darkChartMonth}>{month.month}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </section>
            );
          }

          if (slot.kind === "stayLength") {
            return (
              <section
                key={slot.key}
                ref={(element) => {
                  sectionRefs.current[flatIndex] = element;
                }}
                data-flat-index={flatIndex}
                className={styles.section}
              >
                <div className={styles.panelBlock}>
                  <div className={styles.spotLabel}>Recommended stay</div>
                  <h2 className={styles.panelTitle}>How long to stay in {city.city}</h2>

                  <div className={styles.cardGrid}>
                    {SAMPLE_STAY_LENGTHS.map((option) => (
                      <div key={option.key} className={styles.sampleCard}>
                        <span className={styles.sampleBadge}>Sample</span>
                        <p className={styles.cardTitle}>{option.label}</p>
                        <p className={styles.cardDuration}>{option.duration}</p>
                        <p className={styles.sampleText}>{option.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          if (slot.kind === "spots") {
            const firstFlatIndex = slot.items[0] ? flatIndex : firstSpotFlatIndex;

            return (
              <section
                key="spot-slot"
                ref={(element) => {
                  sectionRefs.current[firstFlatIndex] = element;
                }}
                data-slot-kind="spots"
                data-first-flat-index={firstFlatIndex}
                className={styles.section}
              >
                <div className={styles.spotTrack} ref={spotTrackRef}>
                  {slot.items.map((item, itemIndex) => (
                    <div
                      key={item.key}
                      ref={(element) => {
                        spotCardRefs.current[flatIndex + itemIndex] = element;
                      }}
                      data-flat-index={flatIndex + itemIndex}
                      className={styles.spotCard}
                    >
                      <div className={styles.spotBlock}>
                        <div className={styles.spotLabel}>Top attraction</div>
                        <h2 className={styles.spotTitle}>{item.data.spot.name}</h2>
                        <p className={styles.spotSummary}>
                          {item.data.spot.summary || "No summary yet."}
                        </p>
                        <Link
                          href={`/c/${city.slug}/spot/${item.data.spot.slug}${spotTrackingQuery}`}
                          className={styles.spotLink}
                        >
                          Open spot guide →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (slot.kind === "stayAreas") {
            return (
              <section
                key={slot.key}
                ref={(element) => {
                  sectionRefs.current[flatIndex] = element;
                }}
                data-flat-index={flatIndex}
                className={styles.section}
              >
                <div className={styles.panelBlock}>
                  <div className={styles.spotLabel}>Where to stay</div>
                  <h2 className={styles.panelTitle}>Choosing an area in {city.city}</h2>
                  <p className={styles.panelSubLead}>Detailed area guides are in progress.</p>

                  <div className={styles.cardGrid}>
                    {SAMPLE_STAY_AREAS.map((area) => (
                      <div key={area.key} className={styles.sampleCard}>
                        <span className={styles.sampleBadge}>Sample</span>
                        <p className={styles.cardTitle}>{area.label}</p>
                        <p className={styles.sampleText}>{area.description}</p>
                        <AffiliateButtonGroup
                          city={city}
                          src="scrolly-stay-areas"
                          v={`stay_areas_${city.slug}_${area.key}`}
                          variant="stay"
                          tone="dark"
                          showHotels
                          showTours={false}
                          compact
                          hideDisclosure
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          if (slot.kind === "tours") {
            return (
              <section
                key={slot.key}
                ref={(element) => {
                  sectionRefs.current[flatIndex] = element;
                }}
                data-flat-index={flatIndex}
                className={styles.section}
              >
                <div className={styles.panelBlock}>
                  <div className={styles.spotLabel}>Tours & experiences</div>
                  <h2 className={styles.panelTitle}>Ways to explore {city.city}</h2>

                  <div className={styles.cardGrid}>
                    {SAMPLE_TOUR_CATEGORIES.map((category) => (
                      <div key={category.key} className={styles.sampleCard}>
                        <span className={styles.sampleBadge}>Sample</span>
                        <p className={styles.cardTitle}>{category.label}</p>
                        <p className={styles.sampleText}>{category.description}</p>
                        <AffiliateButtonGroup
                          city={city}
                          src="scrolly-tours"
                          v={`tours_${city.slug}_${category.key}`}
                          variant="tour"
                          tone="dark"
                          showHotels={false}
                          showTours
                          compact
                          hideDisclosure
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // slot.kind === "articles"
          const firstFlatIndex = flatIndex;

          return (
            <section
              key="article-slot"
              ref={(element) => {
                sectionRefs.current[firstFlatIndex] = element;
              }}
              data-slot-kind="articles"
              data-first-flat-index={firstArticleFlatIndex}
              className={styles.section}
            >
              <div className={styles.spotTrack} ref={articleTrackRef}>
                {slot.data.articles.map((article, articleIndex) => (
                  <div
                    key={article.slug}
                    ref={(element) => {
                      articleCardRefs.current[flatIndex + articleIndex] = element;
                    }}
                    data-flat-index={flatIndex + articleIndex}
                    className={styles.spotCard}
                  >
                    <div className={styles.spotBlock}>
                      <div className={styles.spotLabel}>From the journal</div>
                      <h2 className={styles.spotTitle}>{article.title}</h2>
                      <p className={styles.spotSummary}>{article.description}</p>
                      <Link href={`/journal/${article.slug}`} className={styles.spotLink}>
                        Read the article →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
