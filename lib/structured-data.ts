import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import type { SupabasePublicSpot } from "@/data/supabase-public-spots";
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

export function getSpotTouristAttractionJsonLd(
  city: SupabasePublicCity,
  spot: SupabasePublicSpot
) {
  const description = spot.description || spot.summary;
  const image = getOptionalHttpUrl(spot.image_url);
  const country = city.countryName || city.country;

  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: spot.name,
    url: getAbsoluteUrl(`/c/${city.slug}/spot/${spot.slug}`),
    ...(description ? { description } : {}),
    ...(image ? { image } : {}),
    containedInPlace: {
      "@type": "City",
      name: city.city,
      ...(country ? { containedInPlace: { "@type": "Place", name: country } } : {}),
    },
  };
}

// Keep in sync with the visible breadcrumb trail in components/SupabaseCityDetail.tsx
export function getCityBreadcrumbJsonLd(city: SupabasePublicCity) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: getAbsoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Destinations", item: getAbsoluteUrl("/cities") },
      { "@type": "ListItem", position: 3, name: city.city, item: getAbsoluteUrl(`/c/${city.slug}`) },
    ],
  };
}

// Keep in sync with the visible breadcrumb trail in components/SupabaseSpotDetail.tsx
export function getSpotBreadcrumbJsonLd(
  city: SupabasePublicCity,
  spot: SupabasePublicSpot
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: getAbsoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Destinations", item: getAbsoluteUrl("/cities") },
      { "@type": "ListItem", position: 3, name: city.city, item: getAbsoluteUrl(`/c/${city.slug}`) },
      {
        "@type": "ListItem",
        position: 4,
        name: spot.name,
        item: getAbsoluteUrl(`/c/${city.slug}/spot/${spot.slug}`),
      },
    ],
  };
}
