"use client";

import Link from "next/link";
import { useState } from "react";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { HomeWaitlistForm } from "@/components/HomeWaitlistForm";
import { journalArticles } from "@/data/journal";
import styles from "./HomeLanding.module.css";

type Props = {
  cities: City[];
  currentMonth: string;
};

type HeroCity = Pick<City, "slug" | "city" | "country" | "imageUrl">;

// Used only when Supabase has no published cities yet (e.g. local/dev).
const FALLBACK_HERO_CITY: HeroCity = {
  slug: "kyoto",
  city: "Kyoto",
  country: "Japan",
  imageUrl: "/assets/home/kyoto-hero.jpg",
};

// Deterministic hardcover material palettes. No per-city DB field — the
// cover material is chosen from a fixed set based on the city slug so the
// same city always gets the same "binding" (used for the spine strip and
// as a background fallback behind the cover photo).
type CoverPalette = {
  cover: [string, string];
  spine: [string, string];
  band: string;
};

const COVER_PALETTES: CoverPalette[] = [
  { cover: ["#1E3E60", "#0E2138"], spine: ["#152C46", "#081524"], band: "#0A1A2C" }, // deep navy
  { cover: ["#5C2420", "#341210"], spine: ["#43201C", "#220E0C"], band: "#2A1210" }, // oxblood
  { cover: ["#3C4A28", "#212B14"], spine: ["#2C3A1C", "#171F0D"], band: "#151B0B" }, // dark olive
  { cover: ["#5A3A1D", "#33210F"], spine: ["#43290F", "#22140A"], band: "#20130A" }, // warm umber
  { cover: ["#1F4A46", "#0F2624"], spine: ["#173733", "#0A1A18"], band: "#0B1C1A" }, // muted teal
  { cover: ["#3C3B3E", "#1F1E21"], spine: ["#2C2B2E", "#151417"], band: "#131214" }, // charcoal
];

function getCoverPalette(city: HeroCity): CoverPalette {
  const key = city.slug || city.city || "";
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return COVER_PALETTES[hash % COVER_PALETTES.length];
}

function coverStyleVars(palette: CoverPalette): Record<string, string> {
  return {
    "--cover-base-1": palette.cover[0],
    "--cover-base-2": palette.cover[1],
    "--spine-base-1": palette.spine[0],
    "--spine-base-2": palette.spine[1],
    "--spine-band": palette.band,
  };
}

// Pure helper: groups a city's available months into short, human-readable
// ranges (e.g. ["March", "April", "November"] -> "Mar – Apr, Nov"). Never
// invents months — only formats what the city record already has.
const MONTH_ORDER = [
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

const MONTH_ABBR: Record<string, string> = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};

export function formatMonthRanges(months: string[] | undefined | null): string {
  if (!months || months.length === 0) return "";

  const indices = Array.from(
    new Set(
      months
        .map((month) => MONTH_ORDER.indexOf(month))
        .filter((index) => index !== -1)
    )
  ).sort((a, b) => a - b);

  if (indices.length === 0) return "";

  const groups: number[][] = [];
  let current: number[] = [indices[0]];

  for (let i = 1; i < indices.length; i += 1) {
    if (indices[i] === current[current.length - 1] + 1) {
      current.push(indices[i]);
    } else {
      groups.push(current);
      current = [indices[i]];
    }
  }
  groups.push(current);

  return groups
    .map((group) => {
      const startAbbr = MONTH_ABBR[MONTH_ORDER[group[0]]];
      const endAbbr = MONTH_ABBR[MONTH_ORDER[group[group.length - 1]]];
      return group.length > 1 ? `${startAbbr} – ${endAbbr}` : startAbbr;
    })
    .join(", ");
}

function BedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 17v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
      <path d="M3 17v2.5M21 17v2.5" />
      <path d="M3 15h18" />
      <path d="M6 11V9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 8a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1.5 1.5 0 0 0 0 3v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1.5 1.5 0 0 0 0-3V8z" />
      <path d="M14 7v10" strokeDasharray="2.2 2.2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="#E8B85C"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v4M16 3v4" />
    </svg>
  );
}

function JournalBookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="#E8B85C"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5.5c-1.6-1.1-3.8-1.6-6.3-1.4a1 1 0 0 0-.9 1v12.4c0 .6.5 1.1 1.1 1 2.2-.2 4.2.3 5.6 1.3" />
      <path d="M12 5.5c1.6-1.1 3.8-1.6 6.3-1.4a1 1 0 0 1 .9 1v12.4c0 .6-.5 1.1-1.1 1-2.2-.2-4.2.3-5.6 1.3" />
      <path d="M12 5.5v14.3" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="34"
      height="34"
      fill="none"
      stroke="#E8B85C"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="5.5" width="19" height="13" rx="1.5" />
      <path d="M3 6.5l9 7 9-7" />
    </svg>
  );
}

const HOME_JOURNAL_SLUGS = [
  "esim-vs-pocket-wifi-japan",
  "japan-spring-cities",
  "marrakech-color-calm",
  "rome-slowly",
];

function getHomeJournalArticles() {
  const bySlug = new Map(journalArticles.map((article) => [article.slug, article]));
  const matched = HOME_JOURNAL_SLUGS
    .map((slug) => bySlug.get(slug))
    .filter((article): article is NonNullable<typeof article> => Boolean(article));

  if (matched.length > 0) {
    return matched;
  }

  const featured = journalArticles.filter((article) => article.featured);
  return (featured.length > 0 ? featured : journalArticles).slice(0, 4);
}

function getHeroCities(cities: City[]): HeroCity[] {
  const featured = cities
    .filter((city) => city.isFeatured)
    .sort((a, b) => {
      const rankA = a.featuredRank ?? Number.POSITIVE_INFINITY;
      const rankB = b.featuredRank ?? Number.POSITIVE_INFINITY;
      return rankA - rankB;
    })
    .slice(0, 3);

  if (featured.length > 0) {
    return featured;
  }

  return cities.length > 0 ? cities.slice(0, 3) : [FALLBACK_HERO_CITY];
}

export function HomeLanding({ cities, currentMonth }: Props) {
  const heroCities = getHeroCities(cities);
  const [activeHero, setActiveHero] = useState(0);
  const activeCity = heroCities[activeHero] ?? heroCities[0];
  const homeJournalArticles = getHomeJournalArticles();
  const seasonalCities = cities
    .filter((city) => city.months?.includes(currentMonth))
    .slice(0, 4);

  const sideCities = heroCities.filter((_, index) => index !== activeHero);
  const leftSideCity = sideCities[0];
  const rightSideCity = sideCities[1];

  return (
    <main className={styles.root}>
      <section className={styles.bookshelfHero}>
        <div
          className={styles.bookshelfBackdropImage}
          style={
            activeCity.imageUrl
              ? { backgroundImage: `url('${activeCity.imageUrl}')` }
              : undefined
          }
          aria-hidden="true"
        />
        <div className={styles.bookshelfBackdrop} aria-hidden="true" />

        <div className={styles.bookshelfInner}>
          <div className={styles.heroTextCol}>
            <p className={styles.heroKicker}>Taleglen</p>
            <h1 className={styles.heroHeadline}>Find somewhere worth leaving home for.</h1>
            <p className={styles.heroSubcopy}>Curated places. Honest guides. Real next steps.</p>
          </div>

          <div className={styles.heroBookCol}>
            <div className={styles.bookshelfRow}>
              {leftSideCity ? (
                <button
                  type="button"
                  aria-label={`Show ${leftSideCity.city}`}
                  className={`${styles.bookSide} ${styles.bookSideLeft}`}
                  style={
                    leftSideCity.imageUrl
                      ? { backgroundImage: `url('${leftSideCity.imageUrl}')` }
                      : undefined
                  }
                  onClick={() => setActiveHero(heroCities.indexOf(leftSideCity))}
                />
              ) : (
                <div className={`${styles.bookSideEmpty} ${styles.bookSideLeft}`} aria-hidden="true" />
              )}

              <div className={styles.bookMain}>
                <div
                  className={styles.bookSpine}
                  style={coverStyleVars(getCoverPalette(activeCity)) as CSSProperties}
                  aria-hidden="true"
                />

                <div
                  className={styles.bookCover}
                  style={coverStyleVars(getCoverPalette(activeCity)) as CSSProperties}
                >
                  {activeCity.imageUrl ? (
                    <img
                      src={activeCity.imageUrl}
                      alt={`${activeCity.city} cover photograph`}
                      className={styles.bookCoverPhoto}
                    />
                  ) : null}
                  <div className={styles.bookCoverShade} aria-hidden="true" />
                  <div className={styles.coverOrnaments} aria-hidden="true" />
                  <div className={styles.coverInnerBorder} aria-hidden="true" />

                  <h2 className={styles.bookTitle}>{activeCity.city}</h2>
                  <p className={styles.bookCountry}>{activeCity.country}</p>
                </div>

                <div className={styles.pageEdge} aria-hidden="true" />
                <div className={styles.bookContactShadow} aria-hidden="true" />
              </div>

              {rightSideCity ? (
                <button
                  type="button"
                  aria-label={`Show ${rightSideCity.city}`}
                  className={`${styles.bookSide} ${styles.bookSideRight}`}
                  style={
                    rightSideCity.imageUrl
                      ? { backgroundImage: `url('${rightSideCity.imageUrl}')` }
                      : undefined
                  }
                  onClick={() => setActiveHero(heroCities.indexOf(rightSideCity))}
                />
              ) : (
                <div className={`${styles.bookSideEmpty} ${styles.bookSideRight}`} aria-hidden="true" />
              )}
            </div>

            {heroCities.length > 1 && (
              <div className={styles.heroDots}>
                {heroCities.map((city, index) => (
                  <button
                    key={city.slug}
                    type="button"
                    aria-label={`Show ${city.city}`}
                    className={
                      index === activeHero ? styles.heroDotActive : styles.heroDot
                    }
                    onClick={() => setActiveHero(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={styles.heroActions}>
            <Link href={`/c/${activeCity.slug}`} className={styles.heroPrimaryCta}>
              Open the {activeCity.city} guide
              <span className={styles.heroPrimaryCtaArrow} aria-hidden="true">→</span>
            </Link>

            <div className={styles.heroSecondaryRow}>
              <a
                href={`/out/hotels?c=${encodeURIComponent(activeCity.slug)}&src=home&v=home_quicklink_hotels`}
                className={styles.heroSecondaryCta}
              >
                <BedIcon />
                Stays
              </a>
              <a
                href={`/out/tours?c=${encodeURIComponent(activeCity.slug)}&src=home&v=home_quicklink_tours`}
                className={styles.heroSecondaryCta}
              >
                <TicketIcon />
                Experiences
              </a>
            </div>

            <Link href="/cities" className={styles.heroTertiaryLink}>
              Browse all destinations →
            </Link>
          </div>
        </div>
      </section>

      {seasonalCities.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLabel}>
              <CalendarIcon />
              <span>This Month&apos;s Picks</span>
            </div>
            <Link href="/cities" className={styles.sectionLink}>
              View all →
            </Link>
          </div>

          <div className={styles.destinationScroll}>
            {seasonalCities.map((city) => (
              <Link
                key={`${city.slug}-seasonal`}
                href={`/c/${city.slug}?src=home&v=seasonal_${currentMonth}_${city.slug}`}
                className={styles.destinationCard}
              >
                <div
                  className={styles.destinationCardPhoto}
                  style={city.imageUrl ? { backgroundImage: `url('${city.imageUrl}')` } : undefined}
                />
                <div className={styles.destinationCardName}>{city.city}</div>
                <div className={styles.destinationCardCountry}>{city.country}</div>
                {formatMonthRanges(city.months) ? (
                  <div className={styles.destinationCardMonths}>{formatMonthRanges(city.months)}</div>
                ) : null}
                {city.seasonNote ? (
                  <p className={styles.seasonalCardNote}>{city.seasonNote}</p>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLabel}>
            <JournalBookIcon />
            <span>Journal / Field Notes</span>
          </div>
          <Link href="/journal" className={styles.sectionLink}>
            All stories →
          </Link>
        </div>

        <div className={styles.journalList}>
          {homeJournalArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className={styles.journalRow}
            >
              <div
                className={styles.journalRowPhoto}
                style={{ backgroundImage: `url('${article.image}')` }}
              />
              <div className={styles.journalRowBody}>
                <div className={styles.journalRowTitle}>{article.title}</div>
                <p className={styles.journalRowDescription}>{article.description}</p>
              </div>
              <span className={styles.journalRowArrow}>→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.waitlistSection}>
        <div className={styles.waitlistPanel}>
          <EnvelopeIcon />
          <h2 className={styles.waitlistTitle}>
            Get notified when new destination guides are published.
          </h2>
          <p className={styles.waitlistSubcopy}>No spam. Just new places worth knowing about.</p>
          <HomeWaitlistForm />
        </div>
      </section>
    </main>
  );
}
