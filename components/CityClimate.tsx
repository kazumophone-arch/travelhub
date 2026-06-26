import type { ReactNode } from "react";
import styles from "./CityClimate.module.css";
import {
  DEMAND_META,
  hasClimateData,
  type ClimateDemand,
  type CityClimate as CityClimateData,
} from "@/lib/climate";

type Props = {
  cityName: string;
  climate: CityClimateData;
  editor?: ReactNode;
};

const DEMAND_LEGEND: ClimateDemand[] = ["low", "mid", "high", "peak"];

export function CityClimate({ cityName, climate, editor }: Props) {
  if (!editor && !hasClimateData(climate)) {
    return null;
  }

  const temps = climate.months.flatMap((month) =>
    [month.high, month.low].filter((value): value is number => value !== null)
  );
  const hasTemps = temps.length > 0;
  const minTemp = hasTemps ? Math.min(...temps) : 0;
  const maxTemp = hasTemps ? Math.max(...temps) : 1;
  const span = maxTemp - minTemp || 1;

  const highlightCards = [
    climate.peak_season
      ? { key: "peak", icon: "🔥", label: "Peak season", value: climate.peak_season }
      : null,
    climate.value_season
      ? { key: "value", icon: "💰", label: "Best value (cheapest)", value: climate.value_season }
      : null,
    climate.weather_summary
      ? { key: "weather", icon: "🌤", label: "Weather in a nutshell", value: climate.weather_summary }
      : null,
  ].filter((card): card is { key: string; icon: string; label: string; value: string } => Boolean(card));

  return (
    <section className={styles.section} aria-label={`${cityName} climate and best time to visit`}>
      <div className={styles.headerRow}>
        <div>
          <div className={styles.label}>Climate & when to go</div>
          <h2 className={styles.title}>Best time to visit {cityName}</h2>
        </div>
        {editor}
      </div>

      {highlightCards.length > 0 ? (
        <div className={styles.highlightGrid}>
          {highlightCards.map((card) => (
            <div key={card.key} className={styles.highlightCard}>
              <div className={styles.highlightIcon} aria-hidden="true">
                {card.icon}
              </div>
              <div>
                <div className={styles.highlightLabel}>{card.label}</div>
                <p className={styles.highlightValue}>{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {hasTemps ? (
        <>
          <div className={styles.chart}>
            {climate.months.map((month) => {
              const meta = DEMAND_META[month.demand];
              const high = month.high;
              const low = month.low;
              const topValue = high ?? low ?? minTemp;
              const bottomValue = low ?? high ?? minTemp;
              const topPct = ((topValue - minTemp) / span) * 100;
              const bottomPct = ((bottomValue - minTemp) / span) * 100;
              const barHeight = Math.max(topPct - bottomPct, 4);

              return (
                <div key={month.month} className={styles.column}>
                  <div className={styles.highTemp}>
                    {high !== null ? `${Math.round(high)}°` : "–"}
                  </div>
                  <div className={styles.track}>
                    <div
                      className={styles.bar}
                      style={{
                        bottom: `${bottomPct}%`,
                        height: `${barHeight}%`,
                        background: meta.color,
                      }}
                      title={`${month.month}: ${high ?? "–"}° / ${low ?? "–"}° — ${meta.label}`}
                    />
                  </div>
                  <div className={styles.lowTemp}>
                    {low !== null ? `${Math.round(low)}°` : "–"}
                  </div>
                  <div className={styles.monthLabel}>{month.month}</div>
                  <div
                    className={styles.demandDot}
                    style={{ background: meta.color }}
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>

          <div className={styles.legend}>
            {DEMAND_LEGEND.map((demand) => (
              <span key={demand} className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{ background: DEMAND_META[demand].color }}
                  aria-hidden="true"
                />
                {DEMAND_META[demand].short}
              </span>
            ))}
            <span className={styles.legendNote}>Bars show typical daily high–low (°C). Colour = crowds &amp; prices.</span>
          </div>
        </>
      ) : null}
    </section>
  );
}
