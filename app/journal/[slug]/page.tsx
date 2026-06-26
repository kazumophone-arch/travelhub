import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AffiliateButtonGroup } from "@/components/AffiliateButtonGroup";
import { journalArticles } from "@/data/journal";
import { getPublishedSupabaseCity } from "@/data/supabase-public-cities";
import styles from "./JournalArticle.module.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return journalArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = journalArticles.find((item) => item.slug === slug);

  if (!article) {
    return {
      title: "Article not found | TravelHub",
      description: "This TravelHub journal article could not be found.",
    };
  }

  return {
    title: `${article.title} | TravelHub`,
    description: article.description,
  };
}

export default async function JournalArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = journalArticles.find((item) => item.slug === slug);

  if (!article) return notFound();

  const isEssentials = article.category === "Travel Essentials";
  const related = journalArticles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);
  const ctaCity = await getPublishedSupabaseCity(article.relatedCitySlug);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.kicker}>{article.category}</div>
          <h1>{article.title}</h1>
          <p>{article.description}</p>
          <Link href="/journal" className={styles.backLink}>
            Back to Journal →
          </Link>
        </div>

        <div
          className={styles.heroImage}
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(31, 26, 23, 0.02) 0%, rgba(31, 26, 23, 0.22) 54%, rgba(31, 26, 23, 0.58) 100%), url("${article.image}")`,
          }}
        />
      </section>

      <section className={styles.bodyShell}>
        <article className={styles.articleBody}>
          <div className={styles.sectionLabel}>Guide note</div>
          <h2>{getIntroHeading(article.slug)}</h2>
          <p>{article.description}</p>
          <p>{getCategoryNote(article.category)}</p>

          {isEssentials ? (
            <>
              <h2>Start with your travel style.</h2>
              <p>
                For solo travelers, an eSIM can be the cleanest choice because
                it avoids pickup counters and extra devices. For families or
                groups, pocket WiFi can still make sense because several people
                can share one connection.
              </p>

              <div className={styles.compareGrid}>
                <div>
                  <h3>Choose eSIM if</h3>
                  <p>
                    You want a simple setup, you travel light, and your phone
                    supports eSIM before arrival.
                  </p>
                </div>
                <div>
                  <h3>Choose pocket WiFi if</h3>
                  <p>
                    You are traveling as a group, you want one shared device,
                    or you prefer not to change phone settings.
                  </p>
                </div>
              </div>

              <h2>For Japan, reliability matters more than speed.</h2>
              <p>
                The best option is the one that keeps maps, train routes,
                hotel messages, and translation available when you need them.
                A slightly simpler setup is often better than a cheaper option
                that makes arrival more stressful.
              </p>

            </>
          ) : (
            <>
              <h2>Use this as a starting point.</h2>
              <p>
                This article is designed to send readers toward the right city
                guide, season page, or planning note without making the page
                feel like a booking engine.
              </p>
              <p>
                As the Journal grows, this page can become a full editorial
                article with related city guides, nearby places, and carefully
                placed affiliate links.
              </p>
            </>
          )}

          {ctaCity ? (
            <aside className={styles.ctaBox}>
              <div>
                <div className={styles.kicker}>Plan the next step</div>
                <h3>Turn this guide into a booking.</h3>
                <p>
                  Compare stays and experiences in {ctaCity.city} once this
                  article has given the trip some shape.
                </p>
              </div>

              <div className={styles.ctaAffiliateGroup}>
                <AffiliateButtonGroup
                  city={ctaCity}
                  src="journal"
                  v={`journal_${article.slug}`}
                  variant="final"
                  showHotels
                  showTours
                />
              </div>
            </aside>
          ) : null}
        </article>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarBox}>
            <div className={styles.kicker}>Next step</div>
            <h3>Keep planning inside TravelHub.</h3>
            <Link href="/themes">Explore themes →</Link>
            <Link href="/cities">Browse destinations →</Link>
          </div>

          <div className={styles.sidebarBox}>
            <div className={styles.kicker}>Related journal</div>
            {related.map((item) => (
              <Link key={item.slug} href={`/journal/${item.slug}`}>
                {item.title}
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

function getIntroHeading(slug: string) {
  if (slug === "esim-vs-pocket-wifi-japan") {
    return "The calm way to choose mobile internet for Japan.";
  }

  return "A slower way to plan the trip.";
}

function getCategoryNote(category: string) {
  if (category === "Seasonal Ideas") {
    return "Use this as a seasonal lens first — a way to decide when a place is worth visiting, before deciding exactly where.";
  }

  if (category === "City Stories") {
    return "Read this as a mood check before the logistics: does this place match the kind of trip you actually want to take.";
  }

  if (category === "Planning Notes") {
    return "This is meant to be read before the planning gets specific — most of these choices get easier once one decision is made first.";
  }

  return "Start with the situation, then choose the option that removes the most friction from the trip.";
}
