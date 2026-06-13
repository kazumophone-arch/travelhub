"use client";

import Link from "next/link";
import type { City } from "@/data/types";
import styles from "./HomeLanding.module.css";

type Props = {
  cities: City[];
};

type Tile = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  icon?: "peace" | "wonder" | "culture" | "adventure" | "camera";
};

const previews: Tile[] = [
  {
    title: "Rome, Italy",
    subtitle: "Eternal city, timeless beauty.",
    href: "/c/rome-it",
    image: "/assets/home/rome-preview.jpg",
  },
  {
    title: "Paris, France",
    subtitle: "Iconic sights, endless charm.",
    href: "/c/paris-fr",
    image: "/assets/home/paris-preview.jpg",
  },
];

const featured: Tile[] = [
  {
    title: "The Algarve",
    subtitle: "Portugal — Golden cliffs and quiet beaches.",
    href: "/cities",
    image: "/assets/home/algarve.jpg",
  },
  {
    title: "Lake Bled",
    subtitle: "Slovenia — A fairytale in every season.",
    href: "/cities",
    image: "/assets/home/lake-bled.jpg",
  },
  {
    title: "Marrakech",
    subtitle: "Morocco — Color, culture, and calm.",
    href: "/cities",
    image: "/assets/home/marrakech.jpg",
  },
  {
    title: "Queenstown",
    subtitle: "New Zealand — Adventure in every direction.",
    href: "/cities",
    image: "/assets/home/queenstown.jpg",
  },
];

const feelings: Tile[] = [
  {
    title: "Find Peace",
    subtitle: "Quiet escapes",
    href: "/themes",
    image: "/assets/home/find-peace.jpg",
    icon: "peace",
  },
  {
    title: "Seek Wonder",
    subtitle: "Nature escapes",
    href: "/themes",
    image: "/assets/home/seek-wonder.jpg",
    icon: "wonder",
  },
  {
    title: "Taste Culture",
    subtitle: "Food journeys",
    href: "/themes",
    image: "/assets/home/taste-culture.jpg",
    icon: "culture",
  },
  {
    title: "Chase Adventure",
    subtitle: "First trip",
    href: "/themes",
    image: "/assets/home/chase-adventure.jpg",
    icon: "adventure",
  },
  {
    title: "Live the Moment",
    subtitle: "Couples getaways",
    href: "/themes",
    image: "/assets/home/live-the-moment.jpg",
    icon: "camera",
  },
];

function Icon({ type }: { type: NonNullable<Tile["icon"]> }) {
  if (type === "peace") {
    return (
      <svg viewBox="0 0 72 56" width="68" height="52" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 23c5.2-3.4 10.4-3.4 15.6 0s10.4 3.4 15.6 0 10.4-3.4 15.6 0" />
        <path d="M16 31c5.2-3.4 10.4-3.4 15.6 0s10.4 3.4 15.6 0 10.4-3.4 15.6 0" />
        <path d="M16 39c5.2-3.4 10.4-3.4 15.6 0s10.4 3.4 15.6 0 10.4-3.4 15.6 0" />
      </svg>
    );
  }

  if (type === "wonder") {
    return (
      <svg viewBox="0 0 72 72" width="70" height="70" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M36 10c11.4 0 20.5 8.7 20.5 19.5 0 8.7-5.5 16.4-13.3 19.2H28.8C21 45.9 15.5 38.2 15.5 29.5 15.5 18.7 24.6 10 36 10Z" />
        <path d="M24.5 28.5c1.2-9.8 5.6-16.2 11.5-18.5" />
        <path d="M47.5 28.5C46.3 18.7 41.9 12.3 36 10" />
        <path d="M36 10c2.8 6.4 4.2 12.9 4.2 19.5 0 6.7-1.4 13.1-4.2 19.2" />
        <path d="M36 10c-2.8 6.4-4.2 12.9-4.2 19.5 0 6.7 1.4 13.1 4.2 19.2" />
        <path d="M26.5 48.7h19" />
        <path d="M30.5 54.5h11" />
        <path d="M29.5 60h13" />
        <path d="M29.8 48.7l2.7 5.8" />
        <path d="M42.2 48.7l-2.7 5.8" />
      </svg>
    );
  }

  if (type === "culture") {
    return (
      <svg viewBox="0 0 72 72" width="66" height="66" fill="none" stroke="currentColor" strokeWidth="2.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 48h42" />
        <path d="M20 43h32" />
        <path d="M24 43c.7-10.8 5.5-17.2 12-17.2S47.3 32.2 48 43" />
        <path d="M36 20v5.8" />
        <path d="M32.5 20h7" />
        <path d="M22 53h28" />
        <path d="M18 48c1.2 3.2 4 5 8 5" />
        <path d="M54 48c-1.2 3.2-4 5-8 5" />
      </svg>
    );
  }

  if (type === "adventure") {
    return (
      <svg viewBox="0 0 72 72" width="66" height="66" fill="none" stroke="currentColor" strokeWidth="2.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 51h48" />
        <path d="M14 51l17-29 12 19 7-11 10 21" />
        <path d="M31 22l4.8 7.5" />
        <path d="M43 41l4.2-6.4" />
        <path d="M24 39l5.5-5.8 5.5 5.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 72 72" width="58" height="58" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="20" y="26" width="32" height="24" rx="4" />
      <circle cx="36" cy="38" r="6.2" />
      <path d="M27 26l3.2-5h11.6l3.2 5" />
      <path d="M48 31h.1" />
    </svg>
  );
}

export function HomeLanding({ cities }: Props) {
  void cities;

  return (
    <main className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <article
            className={styles.heroMain}
            style={{ backgroundImage: "url('/assets/home/kyoto-hero.jpg')" }}
          >
            <div className={`${styles.overlay} ${styles.heroOverlay}`} />
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>FEATURED DESTINATION</p>
              <h1 className={styles.heroTitle}>Kyoto, Japan</h1>
              <p className={styles.heroText}>Quiet temples and old streets.</p>
              <Link href="/c/kyoto" className={styles.textLink}>
                OPEN GUIDE →
              </Link>
            </div>
          </article>

          <div className={styles.heroRight}>
            {previews.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={styles.previewCard}
                style={{ backgroundImage: `url('${item.image}')` }}
              >
                <div className={styles.overlay} />
                <div className={styles.previewCopy}>
                  <p className={styles.eyebrow}>Featured</p>
                  <h2 className={styles.previewTitle}>{item.title}</h2>
                  <p className={styles.previewSubtitle}>{item.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recently Featured</h2>
          <Link href="/spots" className={styles.sectionLink}>
            VIEW ALL JOURNAL STORIES →
          </Link>
        </div>

        <div className={styles.featureGrid}>
          {featured.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={styles.featureCard}
              style={{ backgroundImage: `url('${item.image}')` }}
            >
              <div className={styles.overlay} />
              <div className={styles.featureCopy}>
                <p className={styles.featureSubtitle}>{item.subtitle}</p>
                <h3 className={styles.featureTitle}>{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Choose by Feeling</h2>
          <Link href="/themes" className={styles.sectionLink}>
            EXPLORE ALL →
          </Link>
        </div>

        <div className={styles.feelingGrid}>
          {feelings.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={styles.feelingCard}
              style={{ backgroundImage: `url('${item.image}')` }}
            >
              <div className={styles.overlay} />
              <div className={styles.feelingContent}>
                <div className={styles.feelingIcon}>
                  <Icon type={item.icon ?? "camera"} />
                </div>
                <h3 className={styles.feelingTitle}>{item.title}</h3>
                <p className={styles.feelingSubtitle}>{item.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
