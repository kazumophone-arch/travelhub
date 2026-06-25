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
  city_id?: string | null;
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
  imagePosition?: string;
  imageAlt?: string;
  imageCredit?: string;
  imageSourceUrl?: string;

  affiliateHotelUrl?: string;
  affiliateTourUrl?: string;
};

export type City = {
  slug: string;
  city: string;
  countryId?: string | null;
  country: string;
  countryName?: string;
  countrySlug?: string;
  stops: [string, string, string];

  description?: string;

  isPublished?: boolean;
  sortRank?: number;

  imageUrl?: string;
  imagePosition?: string;
  imageAlt?: string;
  imageCredit?: string;
  imageSourceUrl?: string;

  isFeatured?: boolean;
  featuredRank?: number | null;

  spotDetails?: Spot[];

  seasons?: string[];
  months?: string[];
  travelStyles?: string[];
  themes?: string[];
  categories?: string[];

  affiliateLinks?: AffiliateLink[];

  affiliateHotelUrl?: string;
  affiliateTourUrl?: string;

  affHotelsUrl?: string;
  affToursUrl?: string;
  planUrl?: string;
};
