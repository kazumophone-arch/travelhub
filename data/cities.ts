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
    stops: ["Old Town", "Market", "Sunset View"],
    affHotelsUrl: "https://example.com/affiliate-hotels-rome",
    affToursUrl: "https://example.com/affiliate-tours-rome",
    planUrl: "https://yourdomain.com/plan?c=rome-it",
  },
};