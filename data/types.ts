export type City = {
  slug: string;
  city: string;
  country: string;
  stops: [string, string, string];

  seasons?: string[];
  months?: string[];
  travelStyles?: string[];
  themes?: string[];
  categories?: string[];

  affHotelsUrl: string;
  affToursUrl?: string;
  planUrl?: string;
};