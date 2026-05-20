"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { getDisplayStops } from "@/lib/displayText";

type Props = {
  cities: City[];
};

type QuizAnswer = {
  style: string | null;
  season: string | null;
  mood: string | null;
};

const travelStyles = ["Couples", "Family", "Solo", "Friends"];
const seasons = ["Spring", "Summer", "Autumn", "Winter"];
const moods = [
  "Romantic",
  "Scenic",
  "Old Town",
  "World Heritage",
  "Beach",
  "Nature",
  "Food",
];

function getCityTags(city: City) {
  const tags = new Set<string>();

  city.seasons?.forEach((item) => tags.add(item));
  city.months?.forEach((item) => tags.add(item));
  city.travelStyles?.forEach((item) => tags.add(item));
  city.themes?.forEach((item) => tags.add(item));
  city.categories?.forEach((item) => tags.add(item));

  if (city.country) tags.add(city.country);

  const joinedStops = city.stops.join(" ");

  if (
    joinedStops.includes("Old") ||
    joinedStops.includes("Historic") ||
    joinedStops.includes("Temple")
  ) {
    tags.add("Old Town");
  }

  if (
    joinedStops.includes("Sunset") ||
    joinedStops.includes("View") ||
    joinedStops.includes("Canal") ||
    joinedStops.includes("River") ||
    joinedStops.includes("Beach") ||
    joinedStops.includes("Lagoon")
  ) {
    tags.add("Scenic");
  }

  return Array.from(tags);
}

function visualForCity(slug: string) {
  const visuals: Record<string, string> = {
    "rome-it":
      "linear-gradient(135deg, #d9a76f 0%, #b86b4b 42%, #3b2f2f 100%)",
    "venice-it":
      "linear-gradient(135deg, #9cc9d7 0%, #e7c389 46%, #8b5f4d 100%)",
    "florence-it":
      "linear-gradient(135deg, #d7a65f 0%, #b65f4a 48%, #2e2a32 100%)",
    "prague-cz":
      "linear-gradient(135deg, #d7b06f 0%, #6f8da8 46%, #2e3543 100%)",
    "dubrovnik-hr":
      "linear-gradient(135deg, #d58b5a 0%, #2f8da8 48%, #183747 100%)",
    "vienna-at":
      "linear-gradient(135deg, #e1c8a4 0%, #b98e65 48%, #42352f 100%)",
    "edinburgh-uk":
      "linear-gradient(135deg, #8e99a8 0%, #5c6675 46%, #252a33 100%)",
    "paris-fr":
      "linear-gradient(135deg, #c7d4df 0%, #d3b58d 44%, #4b4b58 100%)",
    "barcelona-es":
      "linear-gradient(135deg, #f0b45f 0%, #d95850 45%, #2e6f89 100%)",
    "kyoto-jp":
      "linear-gradient(135deg, #c6a96b 0%, #8da36f 48%, #2f3a2f 100%)",
    "amsterdam-nl":
      "linear-gradient(135deg, #8eb6c7 0%, #d9a35f 45%, #38465a 100%)",
  };

  return (
    visuals[slug] ??
    "linear-gradient(135deg, #e5c7a5 0%, #9fb8c9 48%, #30394a 100%)"
  );
}

function scoreCity(city: City, answer: QuizAnswer) {
  const tags = getCityTags(city);
  let score = 0;

  if (answer.style && tags.includes(answer.style)) score += 4;
  if (answer.season && tags.includes(answer.season)) score += 3;
  if (answer.mood && tags.includes(answer.mood)) score += 4;

  const searchable = [city.city, city.country, ...city.stops, ...tags]
    .join(" ")
    .toLowerCase();

  if (answer.mood && searchable.includes(answer.mood.toLowerCase())) score += 1;
  if (answer.style && searchable.includes(answer.style.toLowerCase())) score += 1;
  if (answer.season && searchable.includes(answer.season.toLowerCase())) score += 1;

  return score;
}

export function TravelDiscoveryTools({ cities }: Props) {
  const [answer, setAnswer] = useState<QuizAnswer>({
    style: "Couples",
    season: "Spring",
    mood: "Scenic",
  });

  const [swipeIndex, setSwipeIndex] = useState(0);
  const [pickedSlugs, setPickedSlugs] = useState<string[]>([]);

  const quizResults = useMemo(() => {
    const hasAnyAnswer = Boolean(answer.style || answer.season || answer.mood);

    if (!hasAnyAnswer) return cities.slice(0, 3);

    const ranked = cities
      .map((city) => ({
        city,
        score: scoreCity(city, answer),
      }))
      .sort((a, b) => b.score - a.score);

    const matched = ranked.filter((item) => item.score > 0).slice(0, 3);

    if (matched.length > 0) return matched.map((item) => item.city);

    return cities.slice(0, 3);
  }, [cities, answer]);

  const swipeCity = cities.length > 0 ? cities[swipeIndex % cities.length] : null;

  const pickedCities = useMemo(() => {
    return pickedSlugs
      .map((slug) => cities.find((city) => city.slug === slug))
      .filter((city): city is City => Boolean(city));
  }, [pickedSlugs, cities]);

  function toggleAnswer(key: keyof QuizAnswer, value: string) {
    setAnswer((current) => ({
      ...current,
      [key]: current[key] === value ? null : value,
    }));
  }

  function nextSwipe() {
    if (cities.length === 0) return;
    setSwipeIndex((current) => (current + 1) % cities.length);
  }

  function pickCurrentCity() {
    if (!swipeCity) return;

    setPickedSlugs((current) => {
      if (current.includes(swipeCity.slug)) return current;
      return [...current, swipeCity.slug].slice(-5);
    });

    nextSwipe();
  }

  return (
    <section style={wrapStyle}>
      <section style={sectionHeaderStyle}>
        <div>
          <div style={smallLabelStyle}>Interactive discovery</div>
          <h2 style={sectionTitleStyle}>
            Find a trip by feeling, not just by city.
          </h2>
        </div>
      </section>

      <div style={gridStyle}>
        <section style={quizCardStyle}>
          <div style={toolHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Travel quiz</div>
              <h3 style={toolTitleStyle}>What kind of trip fits you?</h3>
            </div>
            <div style={toolBadgeStyle}>3 picks</div>
          </div>

          <div style={resultBoxStyle}>
            <div style={resultTitleStyle}>Your matches</div>

            <div style={resultListStyle}>
              {quizResults.map((city, index) => (
                <Link
                  key={`${city.slug}-quiz-${index}`}
                  href={`/c/${city.slug}?src=home&v=quiz_${city.slug}`}
                  style={resultItemStyle}
                >
                  <div style={resultRankStyle}>{index + 1}</div>

                  <div style={resultTextStyle}>
                    <div style={resultCityStyle}>{city.city}</div>
                    <div style={resultMetaStyle}>
                      {city.country} · {getCityTags(city).slice(0, 2).join(" · ")}
                    </div>
                  </div>

                  <div style={resultArrowStyle}>→</div>
                </Link>
              ))}
            </div>
          </div>

          <div style={questionBlockStyle}>
            <div style={questionLabelStyle}>Who are you traveling with?</div>
            <div style={optionRowStyle}>
              {travelStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleAnswer("style", style)}
                  style={answer.style === style ? activeOptionStyle : optionStyle}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div style={questionBlockStyle}>
            <div style={questionLabelStyle}>When do you want to go?</div>
            <div style={optionRowStyle}>
              {seasons.map((season) => (
                <button
                  key={season}
                  type="button"
                  onClick={() => toggleAnswer("season", season)}
                  style={answer.season === season ? activeOptionStyle : optionStyle}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>

          <div style={questionBlockStyle}>
            <div style={questionLabelStyle}>What mood do you want?</div>
            <div style={optionRowStyle}>
              {moods.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => toggleAnswer("mood", mood)}
                  style={answer.mood === mood ? activeOptionStyle : optionStyle}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section style={swipeCardStyle}>
          <div style={toolHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Swipe / Pick</div>
              <h3 style={toolTitleStyle}>Would you visit this city?</h3>
            </div>
            <div style={toolBadgeStyle}>Pick list</div>
          </div>

          {swipeCity ? (
            <>
              <div
                style={{
                  ...swipeVisualStyle,
                  background: visualForCity(swipeCity.slug),
                }}
              >
                <div style={visualBadgeStyle}>{swipeCity.country}</div>
              </div>

              <div style={swipeBodyStyle}>
                <h3 style={swipeCityStyle}>{swipeCity.city}</h3>
                <p style={swipeReasonStyle}>
                  {swipeCity.stops[0]} · {swipeCity.stops[1]} ·{" "}
                  {swipeCity.stops[2]}
                </p>

                <div style={swipeButtonRowStyle}>
                  <button type="button" onClick={nextSwipe} style={skipButtonStyle}>
                    Skip
                  </button>

                  <button
                    type="button"
                    onClick={pickCurrentCity}
                    style={pickButtonStyle}
                  >
                    Looks good
                  </button>
                </div>

                <Link
                  href={`/c/${swipeCity.slug}?src=home&v=swipe_${swipeCity.slug}`}
                  style={viewCityLinkStyle}
                >
                  View city page →
                </Link>
              </div>
            </>
          ) : (
            <div style={emptyStyle}>No cities available.</div>
          )}

          <div style={pickedBoxStyle}>
            <div style={resultTitleStyle}>Your picks</div>

            {pickedCities.length === 0 ? (
              <div style={pickedEmptyStyle}>Pick cities you might want to visit.</div>
            ) : (
              <div style={pickedListStyle}>
                {pickedCities.map((city) => (
                  <Link
                    key={`picked-${city.slug}`}
                    href={`/c/${city.slug}?src=home&v=picked_${city.slug}`}
                    style={pickedItemStyle}
                  >
                    {city.city}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

const wrapStyle: CSSProperties = {
  marginBottom: 42,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-end",
  marginBottom: 16,
  flexWrap: "wrap",
};

const smallLabelStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  opacity: 0.5,
  marginBottom: 6,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(24px, 6vw, 32px)",
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: 16,
};

const quizCardStyle: CSSProperties = {
  borderRadius: 32,
  padding: 18,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  boxShadow: "0 24px 70px rgba(0, 0, 0, 0.1)",
};

const swipeCardStyle: CSSProperties = {
  borderRadius: 32,
  padding: 18,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  boxShadow: "0 24px 70px rgba(0, 0, 0, 0.1)",
};

const toolHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
  marginBottom: 14,
};

const toolTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.05,
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const toolBadgeStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 999,
  background: "rgba(0, 0, 0, 0.06)",
  fontSize: 12,
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const questionBlockStyle: CSSProperties = {
  marginBottom: 16,
};

const questionLabelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  opacity: 0.68,
  marginBottom: 8,
};

const optionRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const optionStyle: CSSProperties = {
  border: "1px solid rgba(0, 0, 0, 0.1)",
  borderRadius: 999,
  padding: "9px 11px",
  background: "#ffffff",
  color: "#171717",
  fontSize: 13,
  fontWeight: 750,
  cursor: "pointer",
};

const activeOptionStyle: CSSProperties = {
  ...optionStyle,
  background: "#171717",
  color: "#ffffff",
  border: "1px solid #171717",
};

const resultBoxStyle: CSSProperties = {
  marginBottom: 18,
  padding: 14,
  borderRadius: 24,
  background: "rgba(0, 0, 0, 0.04)",
};

const resultTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 850,
  opacity: 0.72,
  marginBottom: 10,
};

const resultListStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

const resultItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: 12,
  borderRadius: 18,
  background: "#ffffff",
  color: "inherit",
  textDecoration: "none",
};

const resultRankStyle: CSSProperties = {
  width: 28,
  height: 28,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "#171717",
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 850,
  flexShrink: 0,
};

const resultTextStyle: CSSProperties = {
  minWidth: 0,
};

const resultCityStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 850,
};

const resultMetaStyle: CSSProperties = {
  marginTop: 3,
  fontSize: 12,
  opacity: 0.62,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const resultArrowStyle: CSSProperties = {
  marginLeft: "auto",
  fontWeight: 850,
  opacity: 0.6,
};

const swipeVisualStyle: CSSProperties = {
  height: "clamp(220px, 58vw, 320px)",
  borderRadius: 26,
  position: "relative",
  overflow: "hidden",
  marginBottom: 16,
};

const visualBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  padding: "8px 11px",
  borderRadius: 999,
  background: "#ffffff",
  backdropFilter: "blur(12px)",
  fontSize: 12,
  fontWeight: 800,
};

const swipeBodyStyle: CSSProperties = {
  padding: "0 2px",
};

const swipeCityStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(28px, 8vw, 38px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const swipeReasonStyle: CSSProperties = {
  margin: "10px 0 16px",
  fontSize: 14,
  lineHeight: 1.55,
  opacity: 0.68,
};

const swipeButtonRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};

const skipButtonStyle: CSSProperties = {
  border: "1px solid rgba(0, 0, 0, 0.1)",
  borderRadius: 18,
  padding: "14px 12px",
  background: "#ffffff",
  color: "#171717",
  fontSize: 14,
  fontWeight: 850,
  cursor: "pointer",
};

const pickButtonStyle: CSSProperties = {
  border: 0,
  borderRadius: 18,
  padding: "14px 12px",
  background: "#171717",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 850,
  cursor: "pointer",
};

const viewCityLinkStyle: CSSProperties = {
  display: "block",
  marginTop: 13,
  color: "inherit",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
  opacity: 0.72,
};

const pickedBoxStyle: CSSProperties = {
  marginTop: 18,
  padding: 14,
  borderRadius: 24,
  background: "rgba(0, 0, 0, 0.04)",
};

const pickedEmptyStyle: CSSProperties = {
  fontSize: 13,
  opacity: 0.58,
};

const pickedListStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const pickedItemStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 999,
  background: "#171717",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 800,
};

const emptyStyle: CSSProperties = {
  padding: 18,
  borderRadius: 20,
  background: "rgba(0, 0, 0, 0.04)",
  fontSize: 14,
  opacity: 0.68,
};




