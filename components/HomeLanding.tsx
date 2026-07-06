"use client";

import Link from "next/link";
import { useState } from "react";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { HomeWaitlistForm } from "@/components/HomeWaitlistForm";
import { journalArticles } from "@/data/journal";
import styles from "./HomeLanding.module.css";

// A country rendered as a hardcover volume on the Home shelf. Serializable
// subset passed from the server page; never fabricated client-side.
export type HomeVolume = {
  id: string;
  slug: string;
  name: string;
  image_url: string | null;
};

type Props = {
  cities: City[];
  volumes: HomeVolume[];
  currentMonth: string;
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

function getCoverPalette(key: string): CoverPalette {
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

function getChapterCount(cities: City[], volume: HomeVolume): number {
  return cities.filter((city) => city.countryId === volume.id).length;
}

function getSideVolumeStyle(volume: HomeVolume): CSSProperties {
  if (volume.image_url) {
    return { backgroundImage: `url('${volume.image_url}')` };
  }

  const palette = getCoverPalette(volume.slug);
  return {
    background: `linear-gradient(160deg, ${palette.cover[0]} 0%, ${palette.cover[1]} 100%)`,
  };
}

export function HomeLanding({ cities, volumes, currentMonth }: Props) {
  const heroVolumes = volumes.slice(0, 3);
  const [activeHero, setActiveHero] = useState(0);
  const activeVolume = heroVolumes[activeHero] ?? heroVolumes[0];
  const homeJournalArticles = getHomeJournalArticles();
  const seasonalCities = cities
    .filter((city) => city.months?.includes(currentMonth))
    .slice(0, 4);

  const sideVolumes = heroVolumes.filter((_, index) => index !== activeHero);
  const leftSideVolume = sideVolumes[0];
  const rightSideVolume = sideVolumes[1];
  const activeChapterCount = activeVolume ? getChapterCount(cities, activeVolume) : 0;

  return (
    <main className={styles.root}>
      <section className={styles.bookshelfHero}>
        <div
          className={styles.bookshelfBackdropImage}
          style={
            activeVolume?.image_url
              ? { backgroundImage: `url('${activeVolume.image_url}')` }
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

          {activeVolume ? (
            <div className={styles.heroBookCol}>
              <div className={styles.bookshelfRow}>
                {leftSideVolume ? (
                  <button
                    type="button"
                    aria-label={`Show ${leftSideVolume.name}`}
                    className={`${styles.bookSide} ${styles.bookSideLeft}`}
                    style={getSideVolumeStyle(leftSideVolume)}
                    onClick={() => setActiveHero(heroVolumes.indexOf(leftSideVolume))}
                  />
                ) : (
                  <div className={`${styles.bookSideEmpty} ${styles.bookSideLeft}`} aria-hidden="true" />
                )}

                <div className={styles.bookMain}>
                  <div
                    className={styles.bookSpine}
                    style={coverStyleVars(getCoverPalette(activeVolume.slug)) as CSSProperties}
                    aria-hidden="true"
                  />

                  <div
                    className={styles.bookCover}
                    style={coverStyleVars(getCoverPalette(activeVolume.slug)) as CSSProperties}
                  >
                    {activeVolume.image_url ? (
                      <img
                        src={activeVolume.image_url}
                        alt={`${activeVolume.name} volume cover photograph`}
                        className={styles.bookCoverPhoto}
                      />
                    ) : null}
                    <div className={styles.bookCoverShade} aria-hidden="true" />
                    <div className={styles.coverOrnaments} aria-hidden="true" />
                    <div className={styles.coverInnerBorder} aria-hidden="true" />

                    <h2 className={styles.bookTitle}>{activeVolume.name}</h2>
                    {activeChapterCount > 0 ? (
                      <p className={styles.bookCountry}>
                        {activeChapterCount} chapter{activeChapterCount === 1 ? "" : "s"}
                      </p>
                    ) : null}
                  </div>

                  <div className={styles.pageEdge} aria-hidden="true" />
                  <div className={styles.bookContactShadow} aria-hidden="true" />
                </div>

                {rightSideVolume ? (
                  <button
                    type="button"
                    aria-label={`Show ${rightSideVolume.name}`}
                    className={`${styles.bookSide} ${styles.bookSideRight}`}
                    style={getSideVolumeStyle(rightSideVolume)}
                    onClick={() => setActiveHero(heroVolumes.indexOf(rightSideVolume))}
                  />
                ) : (
                  <div className={`${styles.bookSideEmpty} ${styles.bookSideRight}`} aria-hidden="true" />
                )}
              </div>

              {heroVolumes.length > 1 && (
                <div className={styles.heroDots}>
                  {heroVolumes.map((volume, index) => (
                    <button
                      key={volume.slug}
                      type="button"
                      aria-label={`Show ${volume.name}`}
                      className={
                        index === activeHero ? styles.heroDotActive : styles.heroDot
                      }
                      onClick={() => setActiveHero(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}

          <div className={styles.heroActions}>
            {activeVolume ? (
              <Link
                href={`/countries/${activeVolume.slug}`}
                className={styles.heroPrimaryCta}
              >
                Open the {activeVolume.name} volume
                <span className={styles.heroPrimaryCtaArrow} aria-hidden="true">→</span>
              </Link>
            ) : null}

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
