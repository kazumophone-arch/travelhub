import type { City } from "../types";

export const amsterdamNl: City = {
  slug: "amsterdam-nl",
  city: "Amsterdam",
  country: "Netherlands",
  stops: ["Canal Belt", "Museum Quarter", "Sunset Bridges"],

  seasons: ["Spring", "Summer", "Autumn"],
  months: ["April", "May", "June", "September"],
  travelStyles: ["Couples", "Solo", "Friends"],
  themes: ["Canals", "Architecture", "Scenic", "Romantic"],

  spotDetails: [
    {
      slug: "canal-belt",
      name: "Canal Belt",
      summary: "Amsterdam’s classic canal area with bridges, historic houses, and easy scenic walking routes.",
      highlights: ["Canal bridges", "Historic houses", "Walkable streets"],
      bestFor: ["Couples", "Solo", "Photography"],
      bestTime: "Late morning or evening",
      tags: ["Canals", "Romantic", "Scenic"],
      imageUrl: "",
      imageAlt: "Amsterdam canal belt",
      imageCredit: "",
    },
    {
      slug: "museum-quarter",
      name: "Museum Quarter",
      summary: "A refined area for culture, open spaces, and a slower Amsterdam route beyond the canal core.",
      highlights: ["Museums", "Open lawns", "Culture"],
      bestFor: ["Family", "Solo", "Friends"],
      bestTime: "Afternoon",
      tags: ["Culture", "Architecture", "Family"],
      imageUrl: "",
      imageAlt: "Museum Quarter in Amsterdam",
      imageCredit: "",
    },
    {
      slug: "sunset-bridges",
      name: "Sunset Bridges",
      summary: "A soft evening route built around canals, bridge silhouettes, and warm city light.",
      highlights: ["Bridge views", "Golden light", "Canal reflections"],
      bestFor: ["Couples", "Solo", "Photography"],
      bestTime: "Sunset",
      tags: ["Scenic", "Romantic", "Evening"],
      imageUrl: "",
      imageAlt: "Sunset bridges in Amsterdam",
      imageCredit: "",
    },
  ],

  affHotelsUrl: "https://example.com/affiliate-hotels-amsterdam",
  affToursUrl: "https://example.com/affiliate-tours-amsterdam",
};
