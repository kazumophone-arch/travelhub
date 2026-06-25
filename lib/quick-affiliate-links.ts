// Placeholder partner search links — replace with real affiliate codes when available.

export function getViatorSearchUrl(cityName: string) {
  return `https://www.viator.com/searchResults/all?text=${encodeURIComponent(cityName)}`;
}

export function getBookingSearchUrl(cityName: string) {
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(cityName)}`;
}

export const AIRALO_URL = "https://www.airalo.com/";
