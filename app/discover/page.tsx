import Link from "next/link";
import type { Metadata } from "next";
import styles from "./DiscoverPage.module.css";

export const metadata: Metadata = {
  title: "Discover | TravelHub",
  description:
    "Discover travel ideas by feeling, scene, pace, season, destination, and places worth building a trip around.",
};

const situations = [
  {
    title: "I know the country",
    text: "You have chosen the country, but not the city yet.",
    href: "/cities",
    label: "Choose a city",
    image: "/assets/home/find-peace.jpg",
  },
  {
    title: "I know the city",
    text: "You know the city and want to choose areas, stays, and places.",
    href: "/cities",
    label: "Explore city guides",
    image: "/assets/home/rome-preview.jpg",
  },
  {
    title: "I know the spot",
    text: "You have a place in mind and want to plan when and how to visit.",
    href: "/spots",
    label: "See spot guides",
    image: "/assets/home/lake-bled.jpg",
  },
  {
    title: "I am still unsure",
    text: "You are looking for seasons, moods, and trip styles to start from.",
    href: "/themes",
    label: "Explore themes",
    image: "/assets/home/marrakech.jpg",
  },
];

const discoveries = [
  {
    number: "01",
    title: "Kyoto in spring",
    text: "Soft light, temples, quiet streets.",
    href: "/c/kyoto",
    label: "Open city guide",
    image: "/assets/home/kyoto-hero.jpg",
  },
  {
    number: "02",
    title: "Rome for layered history",
    text: "Ruins, piazzas, espresso between sights.",
    href: "/c/rome",
    label: "Open city guide",
    image: "/assets/home/rome-preview.jpg",
  },
  {
    number: "03",
    title: "Tokyo at every pace",
    text: "Neon streets, quiet shrines, fast trains.",
    href: "/c/tokyo",
    label: "Open city guide",
    image: "/assets/home/seek-wonder.jpg",
  },
];

export default function DiscoverPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>Discover</div>
          <h1>Find the kind of place your next trip is asking for.</h1>
          <div className={styles.rule} />
          <p>
            Not every journey begins with a city name. Start from a feeling, a
            season, a pace, or a scene — then move into the destinations and
            places that fit.
          </p>

          <div className={styles.quickLinks}>
            <Link href="/themes">Seasonal places</Link>
            <span>/</span>
            <Link href="/themes/quiet-escapes">Quiet cities</Link>
            <span>/</span>
            <Link href="/cities">Coastal stays</Link>
          </div>
        </div>

        <div
          className={styles.heroImage}
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(31, 26, 23, 0.04) 0%, rgba(31, 26, 23, 0.32) 100%), url("/assets/home/lake-bled.jpg")',
          }}
        />
      </section>

      <section className={styles.feelings}>
        <h2>Start with what you already know</h2>

        <div className={styles.feelingGrid}>
          {situations.map((item) => (
            <Link key={item.title} href={item.href} className={styles.feelingCard}>
              <div
                className={styles.feelingImage}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(31, 26, 23, 0.02) 0%, rgba(31, 26, 23, 0.36) 100%), url("${item.image}")`,
                }}
              />
              <div className={styles.feelingBody}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <strong>{item.label} →</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.discoverySection}>
        <h2>Featured discoveries</h2>

        <div className={styles.discoveryList}>
          {discoveries.map((item) => (
            <Link key={item.number} href={item.href} className={styles.discoveryRow}>
              <div className={styles.discoveryCopy}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <strong>{item.label} →</strong>
              </div>

              <div
                className={styles.discoveryImage}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(31, 26, 23, 0.02) 0%, rgba(31, 26, 23, 0.28) 100%), url("${item.image}")`,
                }}
              />
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.closing}>
        <span>✦</span>
        <p>Travel is personal. Find the right kind of place for your next journey.</p>
      </section>
    </main>
  );
}


