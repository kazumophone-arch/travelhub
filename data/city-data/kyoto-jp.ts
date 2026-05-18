import type { City } from "../types";

export const kyotoJp: City = {
  slug: "kyoto-jp",
  city: "Kyoto",
  country: "Japan",
  stops: ["Old Streets", "Temple Area", "Bamboo Path"],

  seasons: ["Spring", "Autumn"],
  months: ["March", "April", "November"],
  travelStyles: ["Couples", "Family", "Solo"],
  themes: ["World Heritage", "Old Town", "Nature", "Scenic"],

  spotDetails: [
    {
      slug: "old-streets",
      name: "Old Streets",
      summary: "Atmospheric traditional streets with wooden buildings, small shops, and a strong Kyoto walking-route feel.",
      highlights: ["Traditional streets", "Wooden buildings", "Local shops"],
      bestFor: ["Couples", "Solo", "First-time"],
      bestTime: "Morning",
      tags: ["Old Town", "Culture", "Walkable"],
      imageUrl: "",
      imageAlt: "Old streets in Kyoto",
      imageCredit: "",
    },
    {
      slug: "temple-area",
      name: "Temple Area",
      summary: "A calm cultural stop for gardens, gates, seasonal color, and classic Kyoto atmosphere.",
      highlights: ["Temple grounds", "Gardens", "Seasonal views"],
      bestFor: ["Family", "Solo", "Couples"],
      bestTime: "Morning or late afternoon",
      tags: ["World Heritage", "Culture", "Nature"],
      imageUrl: "",
      imageAlt: "Temple area in Kyoto",
      imageCredit: "",
    },
    {
      slug: "bamboo-path",
      name: "Bamboo Path",
      summary: "A visually memorable bamboo route that works strongly for short-form travel and nature-focused discovery.",
      highlights: ["Bamboo grove", "Nature walk", "Atmospheric path"],
      bestFor: ["Couples", "Family", "Photography"],
      bestTime: "Early morning",
      tags: ["Nature", "Scenic", "Iconic"],
      imageUrl: "",
      imageAlt: "Bamboo path in Kyoto",
      imageCredit: "",
    },
  ],

  affHotelsUrl: "https://example.com/affiliate-hotels-kyoto",
  affToursUrl: "https://example.com/affiliate-tours-kyoto",
};
