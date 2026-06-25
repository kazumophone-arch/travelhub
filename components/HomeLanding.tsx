"use client";

import Link from "next/link";
import { useState } from "react";
import type { City } from "@/data/types";
import { AIRALO_URL } from "@/lib/quick-affiliate-links";
import { HomeWaitlistForm } from "@/components/HomeWaitlistForm";
import styles from "./HomeLanding.module.css";

type Props = {
  cities: City[];
};

type HeroCity = Pick<City, "slug" | "city" | "country" | "imageUrl">;

type QuickLink = {
  label: string;
  emoji: string;
  href: string;
};

const HERO_CITY_SLUGS = ["kyoto", "rome", "tokyo"];

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

function getHeroCities(cities: City[]): HeroCity[] {
  const bySlug = new Map(cities.map((city) => [city.slug, city]));
  const matched = HERO_CITY_SLUGS
    .map((slug) => bySlug.get(slug))
    .filter((city): city is City => Boolean(city));

  if (matched.length > 0) {
    return matched;
  }

  return cities.length > 0 ? cities.slice(0, 3) : [FALLBACK_HERO_CITY];
}

export function HomeLanding({ cities }: Props) {
  const heroCities = getHeroCities(cities);
  const [activeHero, setActiveHero] = useState(0);
  const activeCity = heroCities[activeHero] ?? heroCities[0];

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

      <section className={styles.waitlistSection}>
        <div className={styles.waitlistPanel}>
          <h2 className={styles.waitlistTitle}>Get free travel guides for Kyoto, Rome &amp; Tokyo</h2>
          <HomeWaitlistForm />
        </div>
      </section>
    </main>
  );
}
