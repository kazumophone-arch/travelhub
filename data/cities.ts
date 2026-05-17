// data/cities.ts
export type City = {
  slug: string;
  city: string;
  country: string;
  stops: [string, string, string];
  affHotelsUrl: string;
  affToursUrl?: string;
  planUrl?: string;
};

export const cities: Record<string, City> = {
  "rome-it": {
    slug: "rome-it",
    city: "Rome",
    country: "Italy",
    stops: ["Historic Center", "Trevi Fountain", "Sunset View"],
    affHotelsUrl: "https://example.com/affiliate-hotels-rome",
    affToursUrl: "https://example.com/affiliate-tours-rome",
  },

  "venice-it": {
    slug: "venice-it",
    city: "Venice",
    country: "Italy",
    stops: ["Grand Canal", "Rialto Bridge", "Lagoon View"],
    affHotelsUrl: "https://example.com/affiliate-hotels-venice",
    affToursUrl: "https://example.com/affiliate-tours-venice",
  },

  "florence-it": {
    slug: "florence-it",
    city: "Florence",
    country: "Italy",
    stops: ["Duomo", "Ponte Vecchio", "Piazzale Michelangelo"],
    affHotelsUrl: "https://example.com/affiliate-hotels-florence",
    affToursUrl: "https://example.com/affiliate-tours-florence",
  },

  "prague-cz": {
    slug: "prague-cz",
    city: "Prague",
    country: "Czech Republic",
    stops: ["Old Town", "Charles Bridge", "Castle View"],
    affHotelsUrl: "https://example.com/affiliate-hotels-prague",
    affToursUrl: "https://example.com/affiliate-tours-prague",
  },

  "dubrovnik-hr": {
    slug: "dubrovnik-hr",
    city: "Dubrovnik",
    country: "Croatia",
    stops: ["Old City Walls", "Stradun", "Adriatic View"],
    affHotelsUrl: "https://example.com/affiliate-hotels-dubrovnik",
    affToursUrl: "https://example.com/affiliate-tours-dubrovnik",
  },

  "vienna-at": {
    slug: "vienna-at",
    city: "Vienna",
    country: "Austria",
    stops: ["Historic Center", "Palace District", "Evening Streets"],
    affHotelsUrl: "https://example.com/affiliate-hotels-vienna",
    affToursUrl: "https://example.com/affiliate-tours-vienna",
  },

  "edinburgh-uk": {
    slug: "edinburgh-uk",
    city: "Edinburgh",
    country: "United Kingdom",
    stops: ["Old Town", "Royal Mile", "Castle View"],
    affHotelsUrl: "https://example.com/affiliate-hotels-edinburgh",
    affToursUrl: "https://example.com/affiliate-tours-edinburgh",
  },

  "paris-fr": {
    slug: "paris-fr",
    city: "Paris",
    country: "France",
    stops: ["Seine River", "Montmartre", "Eiffel View"],
    affHotelsUrl: "https://example.com/affiliate-hotels-paris",
    affToursUrl: "https://example.com/affiliate-tours-paris",
  },

  "barcelona-es": {
    slug: "barcelona-es",
    city: "Barcelona",
    country: "Spain",
    stops: ["Gothic Quarter", "Gaudí Streets", "Sunset Beach"],
    affHotelsUrl: "https://example.com/affiliate-hotels-barcelona",
    affToursUrl: "https://example.com/affiliate-tours-barcelona",
  },

  "kyoto-jp": {
    slug: "kyoto-jp",
    city: "Kyoto",
    country: "Japan",
    stops: ["Old Streets", "Temple Area", "Bamboo Path"],
    affHotelsUrl: "https://example.com/affiliate-hotels-kyoto",
    affToursUrl: "https://example.com/affiliate-tours-kyoto",
  },
};