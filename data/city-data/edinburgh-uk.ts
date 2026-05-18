import type { City } from "../types";

export const edinburghUk: City = {
  slug: "edinburgh-uk",
  city: "Edinburgh",
  country: "United Kingdom",
  stops: ["Old Town", "Royal Mile", "Castle View"],

  seasons: ["Spring", "Summer", "Autumn"],
  months: ["May", "June", "August", "September", "October"],
  travelStyles: ["Solo", "Couples", "Friends"],
  themes: ["Old Town", "Castle", "Scenic", "Culture"],

  spotDetails: [
    {
      slug: "old-town",
      name: "Old Town",
      summary: "A dense historic area with layered streets, stone buildings, and a moody city atmosphere.",
      highlights: ["Stone streets", "Historic buildings", "Walkable route"],
      bestFor: ["Solo", "Couples", "First-time"],
      bestTime: "Morning or evening",
      tags: ["Old Town", "Culture", "Architecture"],
      imageUrl: "",
      imageAlt: "Edinburgh Old Town",
      imageCredit: "",
    },
    {
      slug: "royal-mile",
      name: "Royal Mile",
      summary: "A central walking spine through Edinburgh’s old town, useful for first-time city orientation.",
      highlights: ["Historic walk", "Shops", "Street atmosphere"],
      bestFor: ["Family", "Friends", "Solo"],
      bestTime: "Afternoon",
      tags: ["Old Town", "Walkable", "Culture"],
      imageUrl: "",
      imageAlt: "Royal Mile in Edinburgh",
      imageCredit: "",
    },
    {
      slug: "castle-view",
      name: "Castle View",
      summary: "A strong skyline moment showing Edinburgh’s castle, hills, and historic city structure.",
      highlights: ["Castle skyline", "City view", "Dramatic atmosphere"],
      bestFor: ["Couples", "Solo", "Photography"],
      bestTime: "Sunset",
      tags: ["Castle", "Scenic", "Viewpoint"],
      imageUrl: "",
      imageAlt: "Edinburgh castle view",
      imageCredit: "",
    },
  ],

  affHotelsUrl: "https://example.com/affiliate-hotels-edinburgh",
  affToursUrl: "https://example.com/affiliate-tours-edinburgh",
};
