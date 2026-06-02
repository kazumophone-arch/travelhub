import type { AffiliateLink, AffiliateLinkType, City } from "@/data/types";

export function isAffiliateLinkType(type: string): type is AffiliateLinkType {
  return (
    type === "hotels" ||
    type === "tours" ||
    type === "plan" ||
    type === "flights" ||
    type === "restaurants" ||
    type === "activities" ||
    type === "transport" ||
    type === "insurance"
  );
}

export function getAffiliateLinks(city: City): AffiliateLink[] {
  const manualLinks = city.affiliateLinks ?? [];
  const hotelUrl = city.affiliateHotelUrl ?? city.affHotelsUrl;
  const tourUrl = city.affiliateTourUrl ?? city.affToursUrl;

  const legacyLinks: AffiliateLink[] = [];

  if (hotelUrl) {
    legacyLinks.push({
      type: "hotels",
      label: `Find hotels in ${city.city}`,
      url: hotelUrl,
      priority: 10,
      isActive: true,
    });
  }

  if (tourUrl) {
    legacyLinks.push({
      type: "tours",
      label: "Book tours & activities",
      url: tourUrl,
      priority: 20,
      isActive: true,
    });
  }

  if (city.planUrl) {
    legacyLinks.push({
      type: "plan",
      label: "View travel plan",
      url: city.planUrl,
      priority: 30,
      isActive: true,
    });
  }

  const merged = [...manualLinks, ...legacyLinks];

  const uniqueByType = new Map<AffiliateLinkType, AffiliateLink>();

  merged.forEach((link) => {
    if (!link.url) return;
    if (link.isActive === false) return;

    const existing = uniqueByType.get(link.type);

    if (!existing) {
      uniqueByType.set(link.type, link);
      return;
    }

    const existingPriority = existing.priority ?? 999;
    const nextPriority = link.priority ?? 999;

    if (nextPriority < existingPriority) {
      uniqueByType.set(link.type, link);
    }
  });

  return Array.from(uniqueByType.values()).sort(
    (a, b) => (a.priority ?? 999) - (b.priority ?? 999)
  );
}

export function getAffiliateLink({
  city,
  type,
}: {
  city: City;
  type: AffiliateLinkType;
}) {
  return getAffiliateLinks(city).find((link) => link.type === type) ?? null;
}
