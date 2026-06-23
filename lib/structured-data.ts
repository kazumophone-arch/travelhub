import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import { getAbsoluteUrl } from "@/lib/site-metadata";
import { getOptionalHttpUrl } from "@/lib/url-fields";

export function getCityTouristDestinationJsonLd(city: SupabasePublicCity) {
  const description = city.description || city.summary;
  const image = getOptionalHttpUrl(city.image_url);
  const country = city.countryName || city.country;

  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: city.city,
    url: getAbsoluteUrl(`/c/${city.slug}`),
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    ...(country ? { containedInPlace: { "@type": "Place", name: country } } : {}),
  };
}
