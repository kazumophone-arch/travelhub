import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedSupabaseDirectoryCities } from "@/data/supabase-public-cities";
import { getText } from "@/lib/content-fallback";
import styles from "./DestinationsPage.module.css";

export const metadata: Metadata = {
  title: "Destinations | TravelHub",
  description:
    "TravelHub destinations: editorial city guides and places worth planning around.",
};

type RawCity = Record<string, unknown>;

const fallbackImages = [
  "/assets/home/kyoto-hero.jpg",
  "/assets/home/rome-preview.jpg",
  "/assets/home/marrakech.jpg",
  "/assets/home/lake-bled.jpg",
  "/assets/home/paris-preview.jpg",
  "/assets/home/queenstown.jpg",
];

const seasonLinks = [
  {
    title: "Spring",
    text: "Soft light, flowers, and gentle city walks.",
    href: "/themes/spring",
    image: "/assets/home/kyoto-hero.jpg",
  },
  {
    title: "Summer",
    text: "Coastal escapes, lakes, and long evenings.",
    href: "/themes/summer",
    image: "/assets/home/lake-bled.jpg",
  },
  {
    title: "Autumn",
    text: "Foliage, culture, and slower scenic towns.",
    href: "/themes/autumn",
    image: "/assets/home/rome-preview.jpg",
  },
  {
    title: "Winter",
    text: "Clear air, quiet streets, and calm stays.",
    href: "/themes/winter",
    image: "/assets/home/find-peace.jpg",
  },
];

const moodLinks = [
  {
    title: "Relax",
    text: "Slow down and unwind.",
    href: "/discover",
    image: "/assets/home/find-peace.jpg",
  },
  {
    title: "Adventure",
    text: "Outdoor scenery and active trips.",
    href: "/discover",
    image: "/assets/home/queenstown.jpg",
  },
  {
    title: "Culture",
    text: "Art, history, and local traditions.",
    href: "/discover",
    image: "/assets/home/rome-preview.jpg",
  },
  {
    title: "City Break",
    text: "Short trips with big city energy.",
    href: "/discover",
    image: "/assets/home/marrakech.jpg",
  },
];

function getCityName(city: RawCity) {
  return getText(city, ["city", "name", "title"]) || "Destination";
}

function getCountry(city: RawCity) {
  return getText(city, ["country", "countryName", "region"]) || "TravelHub";
}

function getDescription(city: RawCity) {
  return (
    getText(city, ["description", "summary", "intro", "excerpt"]) ||
    "A destination worth slowing down for, with places, stays, and scenes to build a trip around."
  );
}

function getSlug(city: RawCity) {
  return getText(city, ["slug"]);
}

function getCuratedImage(city: RawCity) {
  const key = `${getCityName(city)} ${getSlug(city)} ${getCountry(city)}`.toLowerCase();

  if (key.includes("kyoto")) return "/assets/home/kyoto-hero.jpg";
  if (key.includes("rome") || key.includes("italy")) return "/assets/home/rome-preview.jpg";
  if (key.includes("marrakech") || key.includes("morocco")) return "/assets/home/marrakech.jpg";
  if (key.includes("paris") || key.includes("france")) return "/assets/home/paris-preview.jpg";
  if (key.includes("bled") || key.includes("slovenia")) return "/assets/home/lake-bled.jpg";
  if (key.includes("queenstown") || key.includes("zealand")) return "/assets/home/queenstown.jpg";

  return "";
}

function getImage(city: RawCity, index: number) {
  return (
    getCuratedImage(city) ||
    fallbackImages[index % fallbackImages.length]
  );
}

function getCityHref(city: RawCity) {
  const slug = getSlug(city);
  return slug ? `/c/${slug}` : "/cities";
}

export default async function CitiesPage() {
  const records = await getPublishedSupabaseDirectoryCities();
  const cities = (records as unknown as RawCity[]).filter((city) =>
    getCityName(city)
  );

  const featured =
    cities.find((city) => getSlug(city).toLowerCase().includes("kyoto")) ??
    cities[0];

  const gridCities = cities.slice(0, 8);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>

        <div className={styles.heroHeader}>
          <h1>Destinations</h1>
          <p>Places worth planning around.</p>
        </div>

        {featured ? (
          <Link href={getCityHref(featured)} className={styles.featured}>
            <div
              className={styles.featuredImage}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(31, 26, 23, 0.03) 0%, rgba(31, 26, 23, 0.28) 100%), url("${getImage(featured, 0)}")`,
              }}
            />

            <article className={styles.featuredCopy}>
              <div className={styles.eyebrow}>Featured destination</div>
              <h2>
                {getCityName(featured)}, {getCountry(featured)}
              </h2>
              <div className={styles.starLine}>✦</div>
              <p>{getDescription(featured)}</p>
              <strong>Open city guide →</strong>
            </article>
          </Link>
        ) : null}
      </section>

      <section className={styles.destinations}>
        <div className={styles.sectionHeader}>
          <h2>All Destinations</h2>
          <span>{cities.length} cities</span>
        </div>

        <div className={styles.destinationGrid}>
          {gridCities.map((city, index) => (
            <Link key={`${getSlug(city)}-${index}`} href={getCityHref(city)} className={styles.cityCard}>
              <div
                className={styles.cityImage}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(31, 26, 23, 0.02) 0%, rgba(31, 26, 23, 0.34) 100%), url("${getImage(city, index + 1)}")`,
                }}
              />
              <div className={styles.cityBody}>
                <div className={styles.country}>{getCountry(city)}</div>
                <h3>{getCityName(city)}</h3>
                <p>{getDescription(city)}</p>
                <strong>Open city guide →</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.explorePanel}>
        <div className={styles.exploreColumn}>
          <div className={styles.panelTitle}>✦ Explore by season</div>

          <div className={styles.miniGrid}>
            {seasonLinks.map((item) => (
              <Link key={item.title} href={item.href} className={styles.miniItem}>
                <div
                  className={styles.miniImage}
                  style={{ backgroundImage: `url("${item.image}")` }}
                />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Link>
            ))}
          </div>

          <Link href="/themes" className={styles.panelLink}>
            View seasonal ideas →
          </Link>
        </div>

        <div className={styles.exploreColumn}>
          <div className={styles.panelTitle}>✦ Explore by mood</div>

          <div className={styles.miniGrid}>
            {moodLinks.map((item) => (
              <Link key={item.title} href={item.href} className={styles.miniItem}>
                <div
                  className={styles.miniImage}
                  style={{ backgroundImage: `url("${item.image}")` }}
                />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Link>
            ))}
          </div>

          <Link href="/discover" className={styles.panelLink}>
            View mood ideas →
          </Link>
        </div>
      </section>

      <section className={styles.closing}>
        <span>✦</span>
        <p>The world is full of places that stay with you forever.</p>
        <p>Find the right kind of place for your next journey.</p>
      </section>
    </main>
  );
}


