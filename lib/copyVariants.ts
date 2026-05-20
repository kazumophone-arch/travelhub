export type HomeCopyVariant = {
  heroTitle: string;
  heroSubtitle: string;
  previewTitle: string;
  previewSub: string;
  discoverTitle: string;
  discoverText: string;
  citiesTitle: string;
  citiesText: string;
  spotsTitle: string;
  spotsText: string;
};

export const homeCopyVariants: HomeCopyVariant[] = [
  {
    heroTitle: "Find places worth planning around.",
    heroSubtitle:
      "Explore cities, spots, and travel timing first. Compare travel links only when the trip starts to make sense.",
    previewTitle: "A calmer way to discover travel ideas",
    previewSub: "Discover · Cities · Spots · Timing",
    discoverTitle: "Discover by feeling or timing",
    discoverText:
      "Use Discover when you know the mood or season, but not the destination.",
    citiesTitle: "Browse destinations",
    citiesText:
      "Search by city, broad region, timing, and travel style.",
    spotsTitle: "Explore by place",
    spotsText:
      "Start from a specific spot like a canal, castle, beach, temple, or view.",
  },
  {
    heroTitle: "Start with the place, not the booking.",
    heroSubtitle:
      "Use TravelHub to find the destination first, then compare stays or tours only when the route feels clearer.",
    previewTitle: "Travel ideas before travel pressure",
    previewSub: "Inspiration · Context · Timing · Routes",
    discoverTitle: "Find a trip direction",
    discoverText:
      "Use Discover when the mood, season, or travel style is clearer than the city.",
    citiesTitle: "Choose a city",
    citiesText:
      "Browse destinations without opening every city page first.",
    spotsTitle: "Start from a place",
    spotsText:
      "Use a landmark, view, canal, old town, or scenic spot as your starting point.",
  },
  {
    heroTitle: "Turn travel inspiration into a clearer route.",
    heroSubtitle:
      "Move from beautiful places to practical city, spot, timing, and stay-area decisions.",
    previewTitle: "From inspiration to trip shape",
    previewSub: "Mood · Season · City · Spot",
    discoverTitle: "Explore by mood and season",
    discoverText:
      "Use this path when you want ideas before choosing the exact destination.",
    citiesTitle: "Compare city options",
    citiesText:
      "Look through cities by region, timing, and the kind of trip they fit.",
    spotsTitle: "Find places that anchor a route",
    spotsText:
      "Start with a single place and build the city idea around it.",
  },
  {
    heroTitle: "Find the city that fits the trip you want.",
    heroSubtitle:
      "TravelHub helps you browse destinations by mood, timing, place type, and route logic before comparing links.",
    previewTitle: "A guide for early travel decisions",
    previewSub: "Feelings · Places · Seasons · Guides",
    discoverTitle: "Start with the trip feeling",
    discoverText:
      "Useful when you know what the trip should feel like, but not where to go.",
    citiesTitle: "Browse city guides",
    citiesText:
      "Open a city when you want more context on spots, timing, and stay areas.",
    spotsTitle: "Browse spot guides",
    spotsText:
      "Open a place when one landmark or view catches your attention first.",
  },
  {
    heroTitle: "Explore first. Compare later.",
    heroSubtitle:
      "Find cities and spots that make sense for your timing and travel style before moving into hotels or tours.",
    previewTitle: "Less noise before planning",
    previewSub: "Discover · Decide · Compare",
    discoverTitle: "Find ideas by timing or mood",
    discoverText:
      "Use this when the month or atmosphere matters more than the destination name.",
    citiesTitle: "Search cities simply",
    citiesText:
      "Filter destinations by broad region, timing, and style.",
    spotsTitle: "Search places visually",
    spotsText:
      "Find routes that begin with a view, monument, canal, beach, or old town.",
  },
  {
    heroTitle: "Make travel discovery feel lighter.",
    heroSubtitle:
      "Use one place to browse cities, spots, seasonal timing, and route anchors without jumping straight into booking.",
    previewTitle: "A lighter travel discovery hub",
    previewSub: "Cities · Spots · Seasons · Context",
    discoverTitle: "Browse by idea",
    discoverText:
      "Use Discover for broad trip ideas before narrowing down to a city.",
    citiesTitle: "Browse by destination",
    citiesText:
      "Use Cities when you already want to compare places directly.",
    spotsTitle: "Browse by landmark",
    spotsText:
      "Use Spots when one place or visual scene is the starting point.",
  },
  {
    heroTitle: "Find a destination before choosing the details.",
    heroSubtitle:
      "Explore possible cities, places, and timing first. Planning links are there only when the trip becomes concrete.",
    previewTitle: "Destination first, details second",
    previewSub: "Ideas · Timing · Places · Links",
    discoverTitle: "Start broad",
    discoverText:
      "Use this when you are still deciding what kind of trip you want.",
    citiesTitle: "Narrow by city",
    citiesText:
      "Use filters to compare destinations without too much information at once.",
    spotsTitle: "Narrow by place",
    spotsText:
      "Use a spot, view, or landmark as the first clue for the trip.",
  },
  {
    heroTitle: "Browse travel ideas without rushing the decision.",
    heroSubtitle:
      "TravelHub is built for the early stage: finding places, understanding fit, and comparing only when useful.",
    previewTitle: "Slow down the first travel decision",
    previewSub: "Explore · Understand · Compare",
    discoverTitle: "Find by travel mood",
    discoverText:
      "Use Discover when your first clue is the atmosphere of the trip.",
    citiesTitle: "Find by destination",
    citiesText:
      "Use Cities when you want a clearer list of possible places.",
    spotsTitle: "Find by scene",
    spotsText:
      "Use Spots when a view, canal, temple, beach, or old town starts the idea.",
  },
];

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function pickDailyVariant<T>(items: T[], key: string) {
  if (items.length === 0) {
    throw new Error("pickDailyVariant requires at least one item.");
  }

  const today = getLocalDateKey();
  const index = hashString(`${key}-${today}`) % items.length;

  return items[index];
}

export type SimplePageCopyVariant = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export const discoverCopyVariants: SimplePageCopyVariant[] = [
  {
    eyebrow: "Trip discovery",
    title: "Find a trip direction.",
    subtitle:
      "Use Discover when you know the mood, style, or timing of the trip, but have not chosen the city yet.",
  },
  {
    eyebrow: "Start broad",
    title: "Explore before choosing the city.",
    subtitle:
      "Browse ideas by feeling and travel timing before narrowing down to destinations and spots.",
  },
  {
    eyebrow: "Early travel ideas",
    title: "Find the shape of your next trip.",
    subtitle:
      "Use broad signals like mood, season, and travel style before moving into city guides.",
  },
  {
    eyebrow: "Travel inspiration",
    title: "Start with the kind of trip you want.",
    subtitle:
      "Use Discover when the atmosphere of the trip is clearer than the destination name.",
  },
  {
    eyebrow: "Trip direction",
    title: "Choose the mood before the map.",
    subtitle:
      "Find destinations by feeling and timing, then open the city or spot that starts to make sense.",
  },
];

export const citiesCopyVariants: SimplePageCopyVariant[] = [
  {
    eyebrow: "City directory",
    title: "Choose a city.",
    subtitle:
      "Browse destinations by broad region, timing, and travel style without opening every city page.",
  },
  {
    eyebrow: "Destination list",
    title: "Compare cities at a glance.",
    subtitle:
      "Use filters to narrow the list before opening a full guide.",
  },
  {
    eyebrow: "Browse destinations",
    title: "Find a city that fits the trip.",
    subtitle:
      "Start with broad region, month, or style, then open the cities that match.",
  },
  {
    eyebrow: "City guides",
    title: "Move from options to one destination.",
    subtitle:
      "Use this page when you want to compare possible cities without too much detail at once.",
  },
  {
    eyebrow: "Destination search",
    title: "Narrow the world into a short list.",
    subtitle:
      "Search by region, timing, travel style, or specific places you want to see.",
  },
];

export const spotsCopyVariants: SimplePageCopyVariant[] = [
  {
    eyebrow: "Spot directory",
    title: "Start from a place.",
    subtitle:
      "Use this page when a specific spot, view, landmark, canal, beach, or old town catches your attention first.",
  },
  {
    eyebrow: "Place search",
    title: "Find a trip through one spot.",
    subtitle:
      "Start with the place that interests you, then open the related city guide.",
  },
  {
    eyebrow: "Spot guides",
    title: "Choose the scene before the city.",
    subtitle:
      "Browse places by type, city, or keyword when the visual idea comes first.",
  },
  {
    eyebrow: "Travel anchors",
    title: "Build a route around a place.",
    subtitle:
      "Use one landmark, view, canal, beach, temple, or old town as the first clue.",
  },
  {
    eyebrow: "Explore by place",
    title: "Let one place lead the trip.",
    subtitle:
      "Find spots that can become the anchor for a city route or travel idea.",
  },
];

