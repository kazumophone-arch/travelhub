import Link from "next/link";
import type { Metadata } from "next";
import styles from "./AboutPage.module.css";

export const metadata: Metadata = {
  title: "About | TravelHub",
  description:
    "About TravelHub, a calmer travel discovery site for choosing destinations, city guides, spot guides, and trip essentials.",
};

const principles = [
  {
    title: "Start with intent",
    text: "A better trip often begins with the reason for going, not a search box.",
  },
  {
    title: "Keep the path calm",
    text: "TravelHub organizes themes, cities, spots, and essentials without turning planning into a noisy booking flow.",
  },
  {
    title: "Make decisions easier",
    text: "Each page should help the reader move one step closer to the right destination, area, spot, or preparation.",
  },
];

const structure = [
  {
    label: "Themes",
    text: "Seasonal and mood-based inspiration before the destination is fixed.",
    href: "/themes",
  },
  {
    label: "Discover",
    text: "A planning hub that routes travelers to the right city, spot, or article.",
    href: "/discover",
  },
  {
    label: "Cities",
    text: "Destination pages for where to stay, what to see, and how to begin.",
    href: "/cities",
  },
  {
    label: "Journal",
    text: "Editorial notes and travel essentials for decisions made before the trip.",
    href: "/journal",
  },
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>About TravelHub</div>
          <h1>A calmer way to discover where a trip can begin.</h1>
          <p>
            TravelHub is built as an editorial travel discovery site: a place to
            move from inspiration to city guides, spot guides, and essential
            planning notes without turning the experience into a search engine.
          </p>
          <div className={styles.heroActions}>
            <Link href="/themes">Explore themes →</Link>
            <Link href="/discover">Start with discover →</Link>
          </div>
        </div>

        <div
          className={styles.heroImage}
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(31, 26, 23, 0.02) 0%, rgba(31, 26, 23, 0.34) 100%), url("/assets/home/lake-bled.jpg")',
          }}
        />
      </section>

      <section className={styles.intro}>
        <div>
          <div className={styles.eyebrow}>The role</div>
          <h2>TravelHub is not trying to show everything.</h2>
        </div>
        <p>
          The goal is to help travelers choose better starting points: a season,
          a city, a neighborhood, a place worth building around, or a practical
          step that should be decided before arrival.
        </p>
      </section>

      <section className={styles.principles}>
        {principles.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.structure}>
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrow}>How TravelHub is organized</div>
          <h2>Each section has a different job.</h2>
        </div>

        <div className={styles.structureGrid}>
          {structure.map((item) => (
            <Link key={item.label} href={item.href} className={styles.structureItem}>
              <span>{item.label}</span>
              <p>{item.text}</p>
              <strong>Open {item.label} →</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.disclosure}>
        <div>
          <div className={styles.eyebrow}>Affiliate transparency</div>
          <h2>Some links may support the site.</h2>
        </div>
        <div>
          <p>
            TravelHub may include affiliate links to hotels, tours, travel
            services, or other planning tools. If a reader books through those
            links, TravelHub may earn a commission at no additional cost to the
            reader.
          </p>
          <Link href="/affiliate-disclosure">Read affiliate disclosure →</Link>
        </div>
      </section>

      <section className={styles.closing}>
        <div
          className={styles.closingImage}
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(31, 26, 23, 0.04) 0%, rgba(31, 26, 23, 0.42) 100%), url("/assets/home/kyoto-hero.jpg")',
          }}
        />
        <div className={styles.closingCopy}>
          <div className={styles.eyebrow}>What comes next</div>
          <h2>From discovery to decision.</h2>
          <p>
            The site is designed to connect inspiration with useful next steps:
            seasonal ideas, destination pages, spot guides, planning notes, and
            calm affiliate calls to action when they are relevant.
          </p>
          <Link href="/cities">Browse destinations →</Link>
        </div>
      </section>
    </main>
  );
}
