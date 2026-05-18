import type { City } from "../types";

export const viennaAt: City = {
  slug: "vienna-at",
  city: "Vienna",
  country: "Austria",
  stops: ["Historic Center", "Palace District", "Evening Streets"],

  seasons: ["Spring", "Autumn", "Winter"],
  months: ["April", "May", "September", "October", "December"],
  travelStyles: ["Couples", "Family", "Luxury", "Solo"],
  themes: ["Architecture", "Palace", "Old Town", "Culture"],

  spotDetails: [
    {
      slug: "historic-center",
      name: "Historic Center",
      summary: "A refined city-center area with grand streets, classical buildings, and easy walking routes.",
      highlights: ["Historic streets", "Classical architecture", "Walkable center"],
      bestFor: ["Couples", "Family", "Solo"],
      bestTime: "Morning",
      tags: ["Old Town", "Architecture", "Culture"],
      imageUrl: "",
      imageAlt: "Vienna historic center",
      imageCredit: "",
    },
    {
      slug: "palace-district",
      name: "Palace District",
      summary: "A strong visual area for Vienna’s imperial atmosphere, gardens, and elegant architecture.",
      highlights: ["Palace atmosphere", "Gardens", "Grand architecture"],
      bestFor: ["Family", "Couples", "Luxury"],
      bestTime: "Late morning",
      tags: ["Palace", "Architecture", "Luxury"],
      imageUrl: "",
      imageAlt: "Vienna palace district",
      imageCredit: "",
    },
    {
      slug: "evening-streets",
      name: "Evening Streets",
      summary: "A calm city-walk moment for lights, cafés, and elegant evening atmosphere.",
      highlights: ["Evening lights", "Café streets", "City walk"],
      bestFor: ["Couples", "Solo", "Luxury"],
      bestTime: "Evening",
      tags: ["Romantic", "Evening", "Culture"],
      imageUrl: "",
      imageAlt: "Vienna evening streets",
      imageCredit: "",
    },
  ],

  affHotelsUrl: "https://example.com/affiliate-hotels-vienna",
  affToursUrl: "https://example.com/affiliate-tours-vienna",
};
