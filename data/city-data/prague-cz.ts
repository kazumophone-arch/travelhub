import type { City } from "../types";

export const pragueCz: City = {
  slug: "prague-cz",
  city: "Prague",
  country: "Czech Republic",
  stops: ["Old Town", "Charles Bridge", "Castle View"],

  seasons: ["Spring", "Autumn", "Winter"],
  months: ["April", "May", "September", "October", "December"],
  travelStyles: ["Couples", "Solo", "Friends", "Budget"],
  themes: ["World Heritage", "Old Town", "Architecture", "Scenic"],

  spotDetails: [
    {
      slug: "old-town",
      name: "Old Town",
      summary: "A compact historic area with colorful streets, plazas, towers, and strong first-time Europe atmosphere.",
      highlights: ["Historic square", "Old streets", "Architecture"],
      bestFor: ["First-time", "Solo", "Couples"],
      bestTime: "Morning or evening",
      tags: ["Old Town", "World Heritage", "Architecture"],
      imageUrl: "",
      imageAlt: "Prague Old Town",
      imageCredit: "",
    },
    {
      slug: "charles-bridge",
      name: "Charles Bridge",
      summary: "Prague’s classic bridge walk, connecting old streets with river views and castle-side scenery.",
      highlights: ["Historic bridge", "River view", "Street atmosphere"],
      bestFor: ["Couples", "Photography", "First-time"],
      bestTime: "Early morning",
      tags: ["Scenic", "Old Town", "Iconic"],
      imageUrl: "",
      imageAlt: "Charles Bridge in Prague",
      imageCredit: "",
    },
    {
      slug: "castle-view",
      name: "Castle View",
      summary: "A skyline-focused stop for seeing Prague’s layered rooftops, river, and castle area together.",
      highlights: ["Castle skyline", "City view", "Rooftops"],
      bestFor: ["Couples", "Solo", "Photography"],
      bestTime: "Sunset",
      tags: ["Scenic", "Castle", "Viewpoint"],
      imageUrl: "",
      imageAlt: "Prague castle view",
      imageCredit: "",
    },
  ],

  affHotelsUrl: "https://example.com/affiliate-hotels-prague",
  affToursUrl: "https://example.com/affiliate-tours-prague",
};
