export type Spot = {
  slug: string;
  name: string;
  summary: string;
  highlights: string[];
  bestFor: string[];
  bestTime?: string;
  tags?: string[];

  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: string;
};

export type City = {
  slug: string;
  city: string;
  country: string;
  stops: [string, string, string];

  description?: string;

  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: string;

  isFeatured?: boolean;
  featuredRank?: number;

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
