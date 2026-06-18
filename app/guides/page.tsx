import Link from "next/link";
import type { Metadata } from "next";
import styles from "./GuidesPage.module.css";

export const metadata: Metadata = {
  title: "Guides | TravelHub",
  description:
    "A calmer way to plan your trip through destinations, city guides, spot guides, seasonal ideas, and travel essentials.",
};

const situations = [
  {
    title: "I know the country",
    text: "You have chosen the country, but not the city yet.",
    href: "/cities",
    label: "Choose a city guide",
    icon: "◎",
  },
  {
    title: "I know the city",
    text: "You know the city and want to choose areas, stays, and places.",
    href: "/cities",
    label: "Explore city guides",
    icon: "⌖",
  },
  {
    title: "I know the spot",
    text: "You have a place in mind and want to plan when and how to visit.",
    href: "/spots",
    label: "See spot guides",
    icon: "◇",
  },
  {
    title: "I am still unsure",
    text: "You are looking for seasons, moods, and trip styles to start from.",
    href: "/themes",
    label: "Explore themes",
    icon: "✦",
  },
];

const planningPath = [
  {
    number: "01",
    title: "Choose the season or mood",
    text: "Find the right season, travel style, and inspiration for your trip.",
    href: "/themes",
    label: "Explore themes",
  },
  {
    number: "02",
    title: "Choose the destination",
    text: "Discover cities that fit your interests, days, and travel pace.",
    href: "/cities",
    label: "Browse city guides",
  },
  {
    number: "03",
    title: "Choose the places",
    text: "Explore spots, neighborhoods, and nearby highlights that shape the trip.",
    href: "/spots",
    label: "See spot guides",
  },
  {
    number: "04",
    title: "Prepare for the trip",
    text: "Use essentials and planning notes before anything feels rushed.",
    href: "/journal",
    label: "Read essentials",
  },
];

const entrances = [
  {
    title: "City Guides",
    text: "Where to stay, how many days, best areas, getting around, and sample routes.",
    href: "/cities",
    label: "Browse cities",
    image: "/assets/home/rome-preview.jpg",
  },
  {
    title: "Spot Guides",
    text: "Why go, best time to visit, how long to spend, and what to pair with.",
    href: "/spots",
    label: "Explore spots",
    image: "/assets/home/kyoto-hero.jpg",
  },
  {
    title: "Travel Essentials",
    text: "eSIM, WiFi, insurance, luggage delivery, airport transfer, and what to book.",
    href: "/journal/esim-vs-pocket-wifi-japan",
    label: "Read guides",
    image: "/assets/home/live-the-moment.jpg",
  },
  {
    title: "Seasonal Planning",
    text: "Spring, summer, autumn, and winter travel ideas before choosing a city.",
    href: "/themes",
    label: "See seasonal guides",
    image: "/assets/home/find-peace.jpg",
  },
];

const featuredLinks = [
  {
    title: "Japan in spring: what to know before you go",
    href: "/themes/spring",
  },
  {
    title: "Kyoto city guide: areas, stays, and routes",
    href: "/c/kyoto",
  },
  {
    title: "Where to stay in Kyoto for a first trip",
    href: "/journal/where-to-stay-kyoto-first-trip",
  },
  {
    title: "eSIM vs Pocket WiFi in Japan: which is better?",
    href: "/journal/esim-vs-pocket-wifi-japan",
  },
  {
    title: "Arashiyama Bamboo Grove: how to plan your visit",
    href: "/c/kyoto/spot/arashiyama-bamboo-grove",
  },
];

export default function GuidesPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>Guides</div>
          <h1>Plan your trip in the right order.</h1>
          <p>
            Not every trip begins with a destination. Start with the question
            you have now, then move into the city, spot, or article guide that
            fits.
          </p>
        </div>

        <div
          className={styles.heroImage}
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(248, 242, 233, 0.08) 0%, rgba(33, 31, 26, 0.16) 100%), url("/assets/home/kyoto-hero.jpg")',
          }}
        />
      </section>

      <section className={styles.situationSection}>
        <div className={styles.centerHeader}>
          <span />
          <div>
            <h2>Start with your situation</h2>
            <p>Choose the situation that matches where you are now.</p>
          </div>
          <span />
        </div>

        <div className={styles.situationGrid}>
          {situations.map((item) => (
            <Link key={item.title} href={item.href} className={styles.situationCard}>
              <div className={styles.iconCircle}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <strong>{item.label} →</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.pathSection}>
        <div className={styles.centerHeader}>
          <div>
            <h2>Planning path</h2>
            <p>A simple path from travel idea to city, spot, and preparation.</p>
          </div>
        </div>

        <div className={styles.pathGrid}>
          {planningPath.map((item) => (
            <Link key={item.number} href={item.href} className={styles.pathItem}>
              <div className={styles.pathTop}>
                <span>{item.number}</span>
                <i>→</i>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <strong>{item.label} →</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.entrances}>
        <div className={styles.centerHeader}>
          <div>
            <div className={styles.eyebrow}>Guide entrances</div>
            <h2>Dive deeper into the page you need most.</h2>
          </div>
        </div>

        <div className={styles.entranceGrid}>
          {entrances.map((item) => (
            <Link key={item.title} href={item.href} className={styles.entranceCard}>
              <div
                className={styles.entranceImage}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(31, 26, 23, 0.04) 0%, rgba(31, 26, 23, 0.36) 100%), url("${item.image}")`,
                }}
              />
              <div className={styles.entranceBody}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <strong>{item.label} →</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.featureCopy}>
          <div className={styles.eyebrow}>Featured planning guide</div>
          <h2>First trip to Japan: how to move from idea to itinerary</h2>
          <p>
            A step-by-step route through TravelHub: start with season, choose a
            city, check where to stay, prepare the essentials, then move into
            spot guides.
          </p>
          <Link href="/journal/what-to-book-before-japan">Read the guide →</Link>
        </div>

        <div className={styles.featureLinks}>
          {featuredLinks.map((item) => (
            <Link key={item.title} href={item.href}>
              {item.title}
              <span>›</span>
            </Link>
          ))}
        </div>

        <div
          className={styles.featureImage}
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(31, 26, 23, 0.02) 0%, rgba(31, 26, 23, 0.38) 100%), url("/assets/home/kyoto-hero.jpg")',
          }}
        />
      </section>
    </main>
  );
}
