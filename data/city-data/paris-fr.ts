import type { City } from "../types";

export const parisFr: City = {
  slug: "paris-fr",
  city: "Paris",
  country: "France",
  stops: ["Seine River", "Montmartre", "Eiffel View"],

  seasons: ["Spring", "Autumn"],
  months: ["April", "May", "September", "October"],
  travelStyles: ["Couples", "Family", "Luxury", "Solo"],
  themes: ["Romantic", "Scenic", "Architecture", "Food"],

  spotDetails: [
    {
      slug: "seine-river",
      name: "Seine River",
      summary: "A scenic Paris route with bridges, riverside walks, classic architecture, and easy romantic atmosphere.",
      highlights: ["River walk", "Bridges", "Classic Paris views"],
      bestFor: ["Couples", "Solo", "First-time"],
      bestTime: "Late afternoon",
      tags: ["Romantic", "Scenic", "Walkable"],
      imageUrl: "",
      imageAlt: "Seine River in Paris",
      imageCredit: "",
    },
    {
      slug: "montmartre",
      name: "Montmartre",
      summary: "A hilltop neighborhood with artistic streets, cafés, and a village-like Paris feeling.",
      highlights: ["Hill streets", "Cafés", "Art atmosphere"],
      bestFor: ["Couples", "Friends", "Solo"],
      bestTime: "Morning",
      tags: ["Romantic", "Food", "Old Town"],
      imageUrl: "",
      imageAlt: "Montmartre in Paris",
      imageCredit: "",
    },
    {
      slug: "eiffel-view",
      name: "Eiffel View",
      summary: "A classic Paris visual stop, useful as the strongest recognizable moment in a Paris route.",
      highlights: ["Eiffel Tower", "Skyline", "Photo spot"],
      bestFor: ["Couples", "Family", "First-time"],
      bestTime: "Evening",
      tags: ["Iconic", "Romantic", "Scenic"],
      imageUrl: "",
      imageAlt: "Eiffel Tower view in Paris",
      imageCredit: "",
    },
  ],

  affHotelsUrl: "https://example.com/affiliate-hotels-paris",
  affToursUrl: "https://example.com/affiliate-tours-paris",
};
