export type Spot = {
  slug: string;
  name: string;
  summary: string;
  highlights: string[];
  bestFor: string[];
  bestTime?: string;
  tags?: string[];
};

export type City = {
  slug: string;
  city: string;
  country: string;
  stops: [string, string, string];

  spotDetails?: Spot[];

  seasons?: string[];
  months?: string[];
  travelStyles?: string[];
  themes?: string[];
  categories?: string[];

  affHotelsUrl: string;
  affToursUrl?: string;
  planUrl?: string;
};