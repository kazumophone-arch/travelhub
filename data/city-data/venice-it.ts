import type { City } from "../types";

export const veniceIt: City = {
  slug: "venice-it",
  city: "Venice",
  country: "Italy",
  stops: ["Grand Canal", "Rialto Bridge", "Lagoon View"],

  seasons: ["Spring", "Autumn"],
  months: ["April", "May", "September", "October"],
  travelStyles: ["Couples", "Luxury", "Friends"],
  themes: ["World Heritage", "Canals", "Romantic", "Scenic"],

  spotDetails: [
    {
      slug: "grand-canal",
      name: "Grand Canal",
      summary: "Venice’s central waterway, lined with historic palaces and classic canal views. Best as the main visual anchor for a Venice trip.",
      highlights: ["Canal views", "Historic palaces", "Gondola atmosphere"],
      bestFor: ["Couples", "First-time", "Photography"],
      bestTime: "Late afternoon",
      tags: ["Canals", "Romantic", "Scenic"],
      imageUrl: "",
      imageAlt: "Grand Canal in Venice",
      imageCredit: "",
    },
    {
      slug: "rialto-bridge",
      name: "Rialto Bridge",
      summary: "A famous bridge area with strong Venice atmosphere, shops, canal traffic, and easy walking access.",
      highlights: ["Historic bridge", "Canal crossing", "Central area"],
      bestFor: ["First-time", "Friends", "Couples"],
      bestTime: "Morning or evening",
      tags: ["Architecture", "Canals", "Old Town"],
      imageUrl: "",
      imageAlt: "Rialto Bridge in Venice",
      imageCredit: "",
    },
    {
      slug: "lagoon-view",
      name: "Lagoon View",
      summary: "A scenic Venice moment for open water, soft light, and a calmer ending to the city route.",
      highlights: ["Open water", "Soft light", "Evening atmosphere"],
      bestFor: ["Couples", "Luxury", "Solo"],
      bestTime: "Sunset",
      tags: ["Scenic", "Romantic", "Evening"],
      imageUrl: "",
      imageAlt: "Venice lagoon view",
      imageCredit: "",
    },
  ],

  affHotelsUrl: "https://example.com/affiliate-hotels-venice",
  affToursUrl: "https://example.com/affiliate-tours-venice",
};
