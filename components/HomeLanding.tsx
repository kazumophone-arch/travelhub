"use client";

import Link from "next/link";
import { useState } from "react";
import type { City } from "@/data/types";
import { AIRALO_URL } from "@/lib/quick-affiliate-links";
import { HomeWaitlistForm } from "@/components/HomeWaitlistForm";
import { journalArticles } from "@/data/journal";
import styles from "./HomeLanding.module.css";

type Props = {
  cities: City[];
  currentMonth: string;
};

type HeroCity = Pick<City, "slug" | "city" | "country" | "imageUrl">;

type QuickLink = {
  label: string;
  emoji: string;
  href: string;
};

// Used only when Supabase has no published cities yet (e.g. local/dev).
const FALLBACK_HERO_CITY: HeroCity = {
  slug: "kyoto",
  city: "Kyoto",
  country: "Japan",
  imageUrl: "/assets/home/kyoto-hero.jpg",
};

const quickLinks: QuickLink[] = [
  { label: "Hotels", emoji: "🏨", href: "https://www.booking.com/" },
  { label: "Tours", emoji: "🗺️", href: "https://www.viator.com/" },
  { label: "eSIM", emoji: "📱", href: AIRALO_URL },
];

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

  return (
    <main className={styles.root}>
      <section
        className={styles.heroFull}
        style={
          activeCity.imageUrl
            ? { backgroundImage: `url('${activeCity.imageUrl}')` }
            : undefined
        }
      >
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <span className={styles.heroBadgeOutline}>🎬 FEATURED IN OUR VIDEOS</span>
          <h1 className={styles.heroCityTitle}>{activeCity.city}</h1>
          <p className={styles.heroCountryText}>{activeCity.country}</p>

          <Link href={`/c/${activeCity.slug}`} className={styles.heroCta}>
            Explore {activeCity.city} →
          </Link>
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
      </section>

      <section className={styles.quickLinkSection}>
        <div className={styles.quickLinkRow}>
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={styles.quickLinkItem}
            >
              <span className={styles.quickLinkEmoji}>{link.emoji}</span>
              <span className={styles.quickLinkLabel}>{link.label}</span>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>All Destinations</h2>
        </div>

        <div className={styles.destinationScroll}>
          {cities.map((city) => (
            <Link key={city.slug} href={`/c/${city.slug}`} className={styles.destinationCard}>
              <div
                className={styles.destinationCardPhoto}
                style={city.imageUrl ? { backgroundImage: `url('${city.imageUrl}')` } : undefined}
              />
              <div className={styles.destinationCardName}>{city.city}</div>
              <div className={styles.destinationCardCountry}>{city.country}</div>
              <span className={styles.destinationCardCta}>Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {seasonalCities.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Good to visit in {currentMonth}</h2>
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
          <h2 className={styles.sectionTitle}>From the Journal</h2>
        </div>

        <div className={styles.journalScroll}>
          {homeJournalArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className={styles.journalCard}
            >
              <div
                className={styles.journalCardPhoto}
                style={{ backgroundImage: `url('${article.image}')` }}
              />
              <div className={styles.journalCardCategory}>{article.category}</div>
              <div className={styles.journalCardTitle}>{article.title}</div>
            </Link>
          ))}
        </div>

        <Link href="/journal" className={styles.journalViewAll}>
          View all journal stories →
        </Link>
      </section>

      <section className={styles.waitlistSection}>
        <div className={styles.waitlistPanel}>
          <h2 className={styles.waitlistTitle}>Get free travel guides for Kyoto, Rome &amp; Tokyo</h2>
          <HomeWaitlistForm />
        </div>
      </section>
    </main>
  );
}
