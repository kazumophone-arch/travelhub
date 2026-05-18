import type { City } from "../types";

export const barcelonaEs: City = {
  slug: "barcelona-es",
  city: "Barcelona",
  country: "Spain",
  stops: ["Gothic Quarter", "Gaudí Streets", "Sunset Beach"],

  seasons: ["Spring", "Summer", "Autumn"],
  months: ["May", "June", "September", "October"],
  travelStyles: ["Couples", "Friends", "Solo", "Family"],
  themes: ["Architecture", "Beach", "Old Town", "Food"],

  spotDetails: [
    {
      slug: "gothic-quarter",
      name: "Gothic Quarter",
      summary: "A maze-like old-town area with narrow streets, plazas, and strong walking-route energy.",
      highlights: ["Narrow streets", "Historic plazas", "Old town walk"],
      bestFor: ["Solo", "Friends", "Couples"],
      bestTime: "Morning or evening",
      tags: ["Old Town", "Architecture", "Walkable"],
      imageUrl: "",
      imageAlt: "Gothic Quarter in Barcelona",
      imageCredit: "",
    },
    {
      slug: "gaudi-streets",
      name: "Gaudí Streets",
      summary: "A visual route through Barcelona’s distinctive architecture and colorful city character.",
      highlights: ["Gaudí architecture", "Colorful streets", "City walk"],
      bestFor: ["Family", "Friends", "First-time"],
      bestTime: "Late morning",
      tags: ["Architecture", "Iconic", "Scenic"],
      imageUrl: "",
      imageAlt: "Gaudi architecture in Barcelona",
      imageCredit: "",
    },
    {
      slug: "sunset-beach",
      name: "Sunset Beach",
      summary: "A relaxed coastal stop that adds beach atmosphere and sunset energy to the city route.",
      highlights: ["Beach walk", "Sunset light", "Coastal mood"],
      bestFor: ["Couples", "Friends", "Solo"],
      bestTime: "Sunset",
      tags: ["Beach", "Scenic", "Evening"],
      imageUrl: "",
      imageAlt: "Barcelona sunset beach",
      imageCredit: "",
    },
  ],

  affHotelsUrl: "https://example.com/affiliate-hotels-barcelona",
  affToursUrl: "https://example.com/affiliate-tours-barcelona",
};
