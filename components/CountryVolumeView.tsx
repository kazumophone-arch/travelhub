import Link from "next/link";
import styles from "./CountryVolumeView.module.css";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { journalArticles } from "@/data/journal";
import type { CountryVolume } from "@/data/supabase-public-countries";
import {
  CLIMATE_MONTHS,
  DEMAND_META,
  hasClimateData,
  normalizeClimate,
  type ClimateDemand,
} from "@/lib/climate";
import {
  getCssImagePosition,
  getImageBackground,
  getOptionalHttpUrl,
} from "@/lib/url-fields";

// Full month names in the same order as CLIMATE_MONTHS; cities store
// best_months as full English month names.
const FULL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DEMAND_SCORE: Record<ClimateDemand, number> = {
  low: 0,
  mid: 1,
  high: 2,
  peak: 3,
};

const SCORE_TO_DEMAND: ClimateDemand[] = ["low", "mid", "high", "peak"];

const FALLBACK_TILE_GRADIENT =
  "linear-gradient(135deg, #26352f 0%, #b68b5e 52%, #f3e3cb 100%)";

type Props = {
  volume: CountryVolume;
  currentMonth: string;
};

export function CountryVolumeView({ volume, currentMonth }: Props) {
  const { country, cities, volumeNumber } = volume;
  const firstCity = cities[0];

  const coverUrl = getOptionalHttpUrl(country.image_url);
  const coverSourceUrl = getOptionalHttpUrl(country.image_source_url);

  const volumeLabel =
    typeof volumeNumber === "number"
      ? `Vol. ${String(volumeNumber).padStart(2, "0")}`
      : null;

  const chapterCountLabel = `${cities.length} chapter${cities.length === 1 ? "" : "s"}`;

  const monthCities = cities.filter((city) => (city.best_months?.length ?? 0) > 0);
  const inSeasonCities = cities.filter((city) =>
    city.best_months?.includes(currentMonth)
  );

  const cityClimates = cities
    .map((city) => ({ city, climate: normalizeClimate(city.climate) }))
    .filter((entry) => hasClimateData(entry.climate));

  const crowdByMonth = CLIMATE_MONTHS.map((label, index) => {
    const scores = cityClimates.map(
      (entry) => DEMAND_SCORE[entry.climate.months[index].demand]
    );

    if (scores.length === 0) {
      return { label, demand: null as ClimateDemand | null };
    }

    const average = Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );

    return {
      label,
      demand: SCORE_TO_DEMAND[Math.min(3, Math.max(0, average))],
    };
  });

  const citySlugs = new Set(cities.map((city) => city.slug));
  const relatedJournal = journalArticles
    .filter((article) => citySlugs.has(article.relatedCitySlug))
    .slice(0, 4);

  return (
    <main className={styles.page}>
      <section
        className={styles.cover}
        style={
          coverUrl
            ? { backgroundImage: `url(${JSON.stringify(coverUrl)})` }
            : undefined
        }
      >
        <div className={styles.coverShade} aria-hidden="true" />

        <div className={styles.coverInner}>
          <Breadcrumbs
            tone="light"
            items={[{ label: "Home", href: "/" }, { label: country.name }]}
          />

          <div className={styles.coverMeta}>
            {volumeLabel ? (
              <span className={styles.volumeLabel}>{volumeLabel}</span>
            ) : null}
            {country.region?.trim() ? (
              <span className={styles.regionLabel}>{country.region.trim()}</span>
            ) : null}
          </div>

          <h1 className={styles.coverTitle}>{country.name}</h1>
          <p className={styles.coverSubline}>{chapterCountLabel}</p>

          {firstCity ? (
            <Link href={`/c/${firstCity.slug}`} className={styles.coverStartLink}>
              Begin with {firstCity.city} →
            </Link>
          ) : null}

          {coverSourceUrl ? (
            <a
              href={coverSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.coverSourceLink}
            >
              Photo source
            </a>
          ) : null}
        </div>
      </section>

      <section className={styles.body}>
        {inSeasonCities.length > 0 ? (
          <p className={styles.seasonNowBanner}>
            In season this month:{" "}
            {inSeasonCities.map((city, index) => (
              <span key={city.id}>
                {index > 0 ? ", " : ""}
                <Link href={`/c/${city.slug}`} className={styles.seasonNowLink}>
                  {city.city}
                </Link>
              </span>
            ))}
          </p>
        ) : null}

        <section className={styles.chapterSection} aria-labelledby="chapters-title">
          <div className={styles.label}>The chapters</div>
          <h2 id="chapters-title" className={styles.sectionTitle}>
            Cities in {country.name}
          </h2>

          <div className={styles.chapterList}>
            {cities.map((city, index) => (
              <Link key={city.id} href={`/c/${city.slug}`} className={styles.chapterCard}>
                <div
                  className={styles.chapterImage}
                  style={{
                    backgroundImage: getImageBackground(
                      city.image_url ?? "",
                      "linear-gradient(180deg, rgba(23, 19, 14, 0) 0%, rgba(23, 19, 14, 0.24) 100%)",
                      FALLBACK_TILE_GRADIENT
                    ),
                    backgroundPosition: getCssImagePosition(city.image_position),
                  }}
                />

                <div className={styles.chapterBody}>
                  <div className={styles.chapterMetaRow}>
                    <span className={styles.chapterNumber}>
                      Chapter {String(index + 1).padStart(2, "0")}
                    </span>
                    {index === 0 ? (
                      <span className={styles.startHereBadge}>Start here</span>
                    ) : null}
                  </div>

                  <h3 className={styles.chapterName}>{city.city}</h3>

                  {(city.summary ?? "").trim() ? (
                    <p className={styles.chapterSummary}>{(city.summary ?? "").trim()}</p>
                  ) : null}

                  {(city.best_months?.length ?? 0) > 0 ? (
                    <p className={styles.chapterMonths}>
                      Best months: {city.best_months?.join(" · ")}
                    </p>
                  ) : null}

                  <span className={styles.chapterAction}>Open the {city.city} guide →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {monthCities.length > 0 ? (
          <section className={styles.matrixSection} aria-labelledby="when-to-go-title">
            <div className={styles.label}>When to go</div>
            <h2 id="when-to-go-title" className={styles.sectionTitle}>
              Best months by city
            </h2>

            <div className={styles.matrixScroll}>
              <table className={styles.matrixTable}>
                <thead>
                  <tr>
                    <th scope="col" className={styles.matrixCityHead} />
                    {CLIMATE_MONTHS.map((month) => (
                      <th key={month} scope="col" className={styles.matrixMonthHead}>
                        {month}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthCities.map((city) => (
                    <tr key={city.id}>
                      <th scope="row" className={styles.matrixCityCell}>
                        {city.city}
                      </th>
                      {FULL_MONTHS.map((fullMonth, index) => {
                        const isBest = city.best_months?.includes(fullMonth) ?? false;
                        return (
                          <td
                            key={CLIMATE_MONTHS[index]}
                            className={isBest ? styles.matrixCellBest : styles.matrixCell}
                            aria-label={
                              isBest ? `${city.city}: good in ${fullMonth}` : undefined
                            }
                          >
                            {isBest ? <span className={styles.matrixDot} /> : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {cityClimates.length > 0 ? (
          <section className={styles.crowdSection} aria-labelledby="crowd-title">
            <div className={styles.label}>Seasonality</div>
            <h2 id="crowd-title" className={styles.sectionTitle}>
              Demand through the year
            </h2>
            <p className={styles.crowdCaption}>
              Based on {cityClimates.length} of {cities.length} chapter
              {cities.length === 1 ? "" : "s"}.
            </p>

            <div className={styles.crowdRow}>
              {crowdByMonth.map((month) =>
                month.demand ? (
                  <div key={month.label} className={styles.crowdMonth}>
                    <span
                      className={styles.crowdBar}
                      data-demand={month.demand}
                      style={{ height: `${18 + DEMAND_SCORE[month.demand] * 14}px` }}
                      title={`${month.label}: ${DEMAND_META[month.demand].label}`}
                    />
                    <span className={styles.crowdMonthLabel}>{month.label}</span>
                  </div>
                ) : null
              )}
            </div>

            <div className={styles.crowdLegend}>
              {(Object.keys(DEMAND_META) as ClimateDemand[]).map((demand) => (
                <span key={demand} className={styles.crowdLegendItem}>
                  <span className={styles.crowdLegendSwatch} data-demand={demand} />
                  {DEMAND_META[demand].short}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {relatedJournal.length > 0 ? (
          <section className={styles.journalSection} aria-labelledby="volume-journal-title">
            <div className={styles.label}>From the journal</div>
            <h2 id="volume-journal-title" className={styles.sectionTitle}>
              Notes from {country.name}
            </h2>

            <div className={styles.journalList}>
              {relatedJournal.map((article) => (
                <Link
                  key={article.slug}
                  href={`/journal/${article.slug}`}
                  className={styles.journalRow}
                >
                  <div className={styles.journalRowBody}>
                    <div className={styles.journalRowCategory}>{article.category}</div>
                    <h3 className={styles.journalRowTitle}>{article.title}</h3>
                    <p className={styles.journalRowDescription}>{article.description}</p>
                  </div>
                  <span className={styles.journalRowArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
