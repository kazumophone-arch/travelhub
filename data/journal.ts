export type JournalCategory =
  | "Seasonal Ideas"
  | "City Stories"
  | "Planning Notes"
  | "Travel Essentials";

export type JournalArticle = {
  slug: string;
  title: string;
  category: JournalCategory;
  description: string;
  image: string;
  featured?: boolean;
  ctaLabel?: string;
  /**
   * Slug of the published city this article's affiliate CTA should point to.
   * Live published cities (verified against the Supabase `cities` table):
   * kyoto, rome, tokyo. Picked to match the article's actual subject; falls
   * back to a sensible default for articles about places that aren't
   * published cities (e.g. Marrakech, Lake Bled) — never invent a fake city.
   */
  relatedCitySlug: string;
};

export const journalCategories: JournalCategory[] = [
  "Seasonal Ideas",
  "City Stories",
  "Planning Notes",
  "Travel Essentials",
];

export const journalArticles: JournalArticle[] = [
  {
    slug: "esim-vs-pocket-wifi-japan",
    title: "Do you need pocket WiFi or eSIM in Japan?",
    category: "Travel Essentials",
    description:
      "A calm guide to choosing mobile internet before your trip, without overbuying or arriving unprepared.",
    image: "/assets/home/find-peace.jpg",
    featured: true,
    ctaLabel: "Read the essentials",
    relatedCitySlug: "tokyo",
  },
  {
    slug: "japan-spring-cities",
    title: "Japan in spring: cities worth planning around",
    category: "Seasonal Ideas",
    description:
      "Soft light, seasonal flowers, and cities that feel especially good when the weather turns gentle.",
    image: "/assets/home/kyoto-hero.jpg",
    relatedCitySlug: "kyoto",
  },
  {
    slug: "quiet-europe-summer",
    title: "Quiet European cities for a slow summer trip",
    category: "Seasonal Ideas",
    description:
      "Places that keep the warmth and scenery without making the trip feel crowded or overbuilt.",
    image: "/assets/home/lake-bled.jpg",
    relatedCitySlug: "rome",
  },
  {
    slug: "kyoto-autumn-season",
    title: "Kyoto in autumn: why the season changes the city",
    category: "Seasonal Ideas",
    description:
      "A short editorial note on color, pacing, and why Kyoto rewards slower planning in autumn.",
    image: "/assets/home/kyoto-hero.jpg",
    relatedCitySlug: "kyoto",
  },
  {
    slug: "quiet-first-day-kyoto",
    title: "A quiet first day in Kyoto",
    category: "City Stories",
    description:
      "How to begin Kyoto without rushing straight into the busiest routes.",
    image: "/assets/home/kyoto-hero.jpg",
    relatedCitySlug: "kyoto",
  },
  {
    slug: "rome-slowly",
    title: "Rome, slowly",
    category: "City Stories",
    description:
      "A gentler way to approach Rome beyond the checklist and the crowds.",
    image: "/assets/home/rome-preview.jpg",
    relatedCitySlug: "rome",
  },
  {
    slug: "marrakech-color-calm",
    title: "Marrakech: color, calm, and first impressions",
    category: "City Stories",
    description:
      "How to read the city through texture, courtyards, markets, and quieter moments.",
    image: "/assets/home/marrakech.jpg",
    relatedCitySlug: "tokyo",
  },
  {
    slug: "where-to-stay-kyoto-first-trip",
    title: "Where to stay in Kyoto for a first trip",
    category: "Planning Notes",
    description:
      "How to choose a base that keeps temples, food, stations, and quiet evenings within reach.",
    image: "/assets/home/kyoto-hero.jpg",
    relatedCitySlug: "kyoto",
  },
  {
    slug: "choose-hotel-area-before-booking",
    title: "How to choose a hotel area before booking",
    category: "Planning Notes",
    description:
      "A simple way to decide where to stay before comparing rooms and prices.",
    image: "/assets/home/rome-preview.jpg",
    relatedCitySlug: "rome",
  },
  {
    slug: "what-to-book-before-japan",
    title: "What to book before your first trip to Japan",
    category: "Planning Notes",
    description:
      "The essentials worth arranging before arrival so the first day feels easier.",
    image: "/assets/home/taste-culture.jpg",
    relatedCitySlug: "tokyo",
  },
  {
    slug: "airport-to-city-japan",
    title: "Airport to city: the easiest ways to start",
    category: "Travel Essentials",
    description:
      "Train, transfer, or taxi — how to think about the first move after landing.",
    image: "/assets/home/queenstown.jpg",
    relatedCitySlug: "tokyo",
  },
  {
    slug: "luggage-delivery-japan",
    title: "Luggage delivery in Japan: is it worth it?",
    category: "Travel Essentials",
    description:
      "When hands-free travel makes sense, especially between hotels, stations, and airports.",
    image: "/assets/home/live-the-moment.jpg",
    relatedCitySlug: "tokyo",
  },
];
