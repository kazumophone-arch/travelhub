import Link from "next/link";
import type { Metadata } from "next";
import {
  journalArticles,
  journalCategories,
  type JournalArticle,
} from "@/data/journal";
import styles from "./JournalPage.module.css";

export const metadata: Metadata = {
  title: "Journal | TravelHub",
  description:
    "TravelHub journal stories, seasonal ideas, planning notes, and travel essentials.",
};

const featuredArticle =
  journalArticles.find((article) => article.featured) ?? journalArticles[0];

export default function JournalPage() {
  const groupedArticles = journalCategories.map((category) => ({
    category,
    articles: journalArticles.filter(
      (article) =>
        article.category === category && article.slug !== featuredArticle.slug
    ),
  }));

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>TravelHub Journal</div>
          <h1>Journal</h1>
          <p className={styles.heroLead}>
            Stories, guides, and essentials for planning better trips.
          </p>
          <p className={styles.heroText}>
            Seasonal ideas, city stories, planning notes, and travel essentials
            that help the trip feel considered before anything is booked.
          </p>
        </div>

        <div
          className={styles.heroImage}
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(248, 242, 233, 0.88) 0%, rgba(248, 242, 233, 0.18) 56%), url("/assets/home/kyoto-hero.jpg")',
          }}
        />
      </section>

      <Link
        href={`/journal/${featuredArticle.slug}`}
        className={styles.featured}
      >
        <div
          className={styles.featureImage}
          style={{
            backgroundImage:
              `linear-gradient(180deg, rgba(31, 26, 23, 0.02) 0%, rgba(31, 26, 23, 0.24) 52%, rgba(31, 26, 23, 0.70) 100%), url("${featuredArticle.image}")`,
          }}
        />

        <article className={styles.featureCopy}>
          <div className={styles.kicker}>{featuredArticle.category}</div>
          <h2>{featuredArticle.title}</h2>
          <p>{featuredArticle.description}</p>
          <span>{featuredArticle.ctaLabel ?? "Read the guide"} →</span>
        </article>
      </Link>

      {groupedArticles.map(({ category, articles }) => (
        <section key={category} className={styles.articleSection}>
          <div className={styles.sectionHeader}>
            <h2>{category}</h2>
            <span>View all →</span>
          </div>

          <div className={styles.articleGrid}>
            {articles.slice(0, 4).map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

function ArticleCard({ article }: { article: JournalArticle }) {
  return (
    <Link href={`/journal/${article.slug}`} className={styles.articleCard}>
      <div
        className={styles.articleImage}
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(31, 26, 23, 0.02) 0%, rgba(31, 26, 23, 0.26) 58%, rgba(31, 26, 23, 0.62) 100%), url("${article.image}")`,
        }}
      />
      <div className={styles.articleBody}>
        <div className={styles.articleCategory}>{article.category}</div>
        <h3>{article.title}</h3>
        <p>{article.description}</p>
      </div>
    </Link>
  );
}
