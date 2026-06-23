import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { themes, type Theme } from "@/data/themes";
import { getPublishedSupabaseDirectoryCities } from "@/data/supabase-public-cities";
import styles from "./ThemeDetail.module.css";

type DirectoryCity = {
  slug: string;
  city: string;
  country?: string;
  countryName?: string;
  summary?: string;
  description?: string;
  imageUrl?: string;
  image_url?: string;
  seasons?: string[];
  themes?: string[];
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

type ThemeCopy = {
  title: string;
  subtitle: string;
  intro: string;
  linkLabel: string;
  notes: Array<{
    title: string;
    text: string;
  }>;
};

const seasonThemes = themes.filter((theme) => theme.group === "season");
const styleThemes = themes.filter((theme) => theme.group === "style");

export function generateStaticParams() {
  return themes.map((theme) => ({ slug: theme.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const theme = themes.find((item) => item.slug === slug);

  if (!theme) {
    return {
      title: "Theme not found | TravelHub",
      description: "This TravelHub theme page could not be found.",
    };
  }

  return {
    title: `${theme.title} Travel Ideas | TravelHub`,
    description: theme.description,
  };
}

export default async function ThemeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const theme = themes.find((item) => item.slug === slug);

  if (!theme) return notFound();

  const copy = getThemeCopy(theme);
  const cities = (await getPublishedSupabaseDirectoryCities()) as unknown as DirectoryCity[];
  const selectedCities = pickThemeCities(theme, cities).slice(0, 4);
  const collectionThemes = styleThemes.slice(0, 4);

  return (
    <main className={`${styles.page} ${styles[theme.slug] ?? ""}`}>
      <section className={styles.hero}>
        {theme.group === "season" ? (
          <nav className={styles.seasonTabs} aria-label="Season themes">
            {seasonThemes.map((season) => (
              <Link
                key={season.slug}
                href={`/themes/${season.slug}`}
                className={`${styles.seasonTab} ${
                  season.slug === theme.slug ? styles.activeSeason : ""
                }`}
              >
                <span>{season.title}</span>
              </Link>
            ))}
          </nav>
        ) : null}

        <div className={styles.heroCopy}>
          <h1>{copy.title}</h1>
          <p className={styles.subtitle}>{copy.subtitle}</p>
          <p className={styles.intro}>{copy.intro}</p>

          <Link href="#destinations" className={styles.textLink}>
            {copy.linkLabel} →
          </Link>
        </div>
      </section>

      <section className={styles.notes}>
        {copy.notes.map((note, index) => (
          <article key={note.title} className={styles.note}>
            <div className={styles.noteNumber}>{String(index + 1).padStart(2, "0")}</div>
            <h2>{note.title}</h2>
            <p>{note.text}</p>
          </article>
        ))}
      </section>

      <section id="destinations" className={styles.destinations}>
        <div className={styles.sectionHeader}>
          <h2>{getDestinationHeading(theme)}</h2>
          <Link href="/cities" className={styles.sectionLink}>
            View all destinations →
          </Link>
        </div>

        {selectedCities.length === 0 ? (
          <div className={styles.empty}>No matching destinations are published yet.</div>
        ) : (
          <div className={styles.destinationGrid}>
            {selectedCities.map((city) => (
              <Link
                key={city.slug}
                href={`/c/${city.slug}?src=theme-detail&v=theme_${theme.slug}_${city.slug}`}
                className={styles.destinationCard}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(26, 22, 18, 0.04) 0%, rgba(26, 22, 18, 0.28) 48%, rgba(26, 22, 18, 0.76) 100%), url("${getCityImage(city)}")`,
                }}
              >
                <div className={styles.cardBody}>
                  <h3>
                    {city.city}
                    {city.countryName || city.country ? `, ${city.countryName ?? city.country}` : ""}
                  </h3>
                  <p>
                    {getConciseText(
                      city.summary || city.description,
                      `Open the ${city.city} guide and see why it fits this theme.`
                    )}
                  </p>
                  <span>Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className={styles.collections}>
        <div className={styles.sectionHeader}>
          <h2>{theme.title} collections</h2>
          <Link href="/themes" className={styles.sectionLink}>
            Explore all collections →
          </Link>
        </div>

        <div className={styles.collectionGrid}>
          {collectionThemes.map((collection) => (
            <Link
              key={collection.slug}
              href={`/themes/${collection.slug}`}
              className={styles.collectionCard}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(26, 22, 18, 0.08) 0%, rgba(26, 22, 18, 0.42) 100%), url("${getThemeImage(collection)}")`,
              }}
            >
              <div>
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function getThemeCopy(theme: Theme): ThemeCopy {
  if (theme.slug === "spring") {
    return {
      title: "Spring Awaits",
      subtitle: "New blooms, new horizons.",
      intro:
        "From cherry blossoms and soft city mornings to timeless villages — let spring inspire your next escape.",
      linkLabel: "Why travel in spring",
      notes: [
        {
          title: "Blooming landscapes",
          text: "Cherry blossoms, wildflowers, fresh gardens, and brighter city walks.",
        },
        {
          title: "Pleasant weather",
          text: "Comfortable temperatures that make walking and outdoor days easier.",
        },
        {
          title: "Fewer crowds",
          text: "A gentler season for popular places when timed carefully.",
        },
        {
          title: "Seasonal experiences",
          text: "Festivals, local flavors, and cultural moments that feel tied to the season.",
        },
      ],
    };
  }

  if (theme.slug === "summer") {
    return {
      title: "Summer Opens",
      subtitle: "Long light, open water.",
      intro:
        "For coastal routes, mountain air, late sunsets, and bright cities that feel alive after dark.",
      linkLabel: "Why travel in summer",
      notes: [
        {
          title: "Coastal escapes",
          text: "Beaches, lakes, islands, and breezy waterfront cities.",
        },
        {
          title: "Longer days",
          text: "More daylight for slow mornings, late dinners, and flexible routes.",
        },
        {
          title: "Outdoor rhythm",
          text: "Markets, terraces, open-air walks, and scenic day trips.",
        },
        {
          title: "Bright energy",
          text: "Cities feel social, warm, and easier to explore after sunset.",
        },
      ],
    };
  }

  if (theme.slug === "autumn") {
    return {
      title: "Autumn Deepens",
      subtitle: "Golden light, slower roads.",
      intro:
        "Crisp air, warm colors, quieter streets, and cities that reward slower travel.",
      linkLabel: "Why travel in autumn",
      notes: [
        {
          title: "Seasonal color",
          text: "Forests, gardens, temple paths, and old streets turn warmer.",
        },
        {
          title: "Better pacing",
          text: "A calmer travel rhythm after the peak summer rush.",
        },
        {
          title: "City comfort",
          text: "Milder days make museums, cafés, and walking routes easier.",
        },
        {
          title: "Atmospheric stays",
          text: "A good season for ryokan, boutique hotels, and slower evenings.",
        },
      ],
    };
  }

  if (theme.slug === "winter") {
    return {
      title: "Winter Quiet",
      subtitle: "Clear air, calm streets.",
      intro:
        "For quiet cities, snowy landscapes, warm interiors, and trips that feel more private.",
      linkLabel: "Why travel in winter",
      notes: [
        {
          title: "Quiet atmosphere",
          text: "Fewer crowds and a softer pace in many classic destinations.",
        },
        {
          title: "Clearer views",
          text: "Cold air can make skylines, mountains, and night walks feel sharper.",
        },
        {
          title: "Warm interiors",
          text: "A better season for hotels, baths, restaurants, and slow evenings.",
        },
        {
          title: "Seasonal scenes",
          text: "Illuminations, snow, markets, and winter-only landscapes.",
        },
      ],
    };
  }

  return {
    title: theme.title,
    subtitle: theme.eyebrow,
    intro: theme.description,
    linkLabel: `Explore ${theme.title.toLowerCase()}`,
    notes: [
      {
        title: "Curated mood",
        text: "A focused edit of destinations that fit this travel style.",
      },
      {
        title: "Easy browsing",
        text: "Start with the feeling before choosing the exact city.",
      },
      {
        title: "Flexible routes",
        text: "Use each city guide as a calm starting point.",
      },
      {
        title: "Better planning",
        text: "Move from inspiration into places, stays, and experiences.",
      },
    ],
  };
}

function getDestinationHeading(theme: Theme) {
  if (theme.group === "season") {
    return `Where to go this ${theme.title.toLowerCase()}`;
  }

  return `Where to go for ${theme.title.toLowerCase()}`;
}

function pickThemeCities(theme: Theme, cities: DirectoryCity[]) {
  const themeWords = normalize(`${theme.title} ${theme.slug}`)
    .split(" ")
    .filter((word) => word.length >= 4);

  const scored = cities.map((city) => {
    const seasonText = normalize((city.seasons ?? []).join(" "));
    const themeText = normalize((city.themes ?? []).join(" "));
    const cityText = normalize(
      `${city.city} ${city.country ?? ""} ${city.summary ?? ""} ${city.description ?? ""}`
    );

    let score = 0;

    if (theme.group === "season") {
      if (seasonText.includes(normalize(theme.title))) score += 10;
      if (seasonText.includes(normalize(theme.slug))) score += 10;
    } else {
      for (const word of themeWords) {
        if (themeText.includes(word)) score += 6;
        if (cityText.includes(word)) score += 2;
      }
    }

    return { city, score };
  });

  const matched = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.city);

  if (matched.length >= 4) return matched;

  const fill = cities.filter(
    (city) => !matched.some((matchedCity) => matchedCity.slug === city.slug)
  );

  return [...matched, ...fill];
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getCityImage(city: DirectoryCity) {
  return (
    city.imageUrl ||
    city.image_url ||
    `https://picsum.photos/seed/${encodeURIComponent(city.slug)}/1100/760`
  );
}

function getThemeImage(theme: Theme) {
  const key = `${theme.slug} ${theme.title}`.toLowerCase();

  if (key.includes("food")) return "/assets/home/taste-culture.jpg";
  if (key.includes("couple")) return "/assets/home/live-the-moment.jpg";
  if (key.includes("first")) return "/assets/home/chase-adventure.jpg";
  if (key.includes("quiet")) return "/assets/home/find-peace.jpg";
  if (key.includes("nature")) return "/assets/home/seek-wonder.jpg";
  if (key.includes("luxury")) return "/assets/home/rome-preview.jpg";

  return "/assets/home/seek-wonder.jpg";
}

function getConciseText(value: string | null | undefined, fallback: string) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim() || fallback;
  return text.length <= 130 ? text : `${text.slice(0, 130).trim()}...`;
}

