export type City = {
  slug: string;
  city: string;
  country: string;
  stops: [string, string, string];
  affHotelsUrl: string;
  affToursUrl?: string;
  planUrl?: string;
};