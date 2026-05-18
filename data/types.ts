export type AffiliateLinkType =
  | "hotels"
  | "tours"
  | "plan"
  | "flights"
  | "restaurants"
  | "activities"
  | "transport"
  | "insurance";

export type AffiliateLink = {
  type: AffiliateLinkType;
  label: string;
  url: string;
  priority?: number;
  isActive?: boolean;
};

export type Spot = {
  slug: string;
  name: string;
  summary: string;
  highlights: string[];
  bestFor: string[];
  bestTime?: string;
  tags?: string[];

  isPublished?: boolean;
  sortRank?: number;

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

  isPublished?: boolean;
  sortRank?: number;

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

  affiliateLinks?: AffiliateLink[];

  affHotelsUrl: string;
  affToursUrl?: string;
  planUrl?: string;
};