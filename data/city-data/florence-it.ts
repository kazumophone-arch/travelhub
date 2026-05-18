import type { City } from "../types";

export const florenceIt: City = {
  slug: "florence-it",
  city: "Florence",
  country: "Italy",
  stops: ["Duomo", "Ponte Vecchio", "Piazzale Michelangelo"],

  seasons: ["Spring", "Autumn"],
  months: ["April", "May", "September", "October"],
  travelStyles: ["Couples", "Solo", "Friends"],
  themes: ["Art", "Architecture", "Old Town", "Scenic"],

  spotDetails: [
    {
      slug: "duomo",
      name: "Duomo",
      summary: "Florence’s central landmark and one of the strongest first visuals for the city, surrounded by compact historic streets.",
      highlights: ["Cathedral view", "Historic center", "Architecture"],
      bestFor: ["First-time", "Couples", "Solo"],
      bestTime: "Morning",
      tags: ["Architecture", "Old Town", "Iconic"],
      imageUrl: "",
      imageAlt: "Florence Duomo",
      imageCredit: "",
    },
    {
      slug: "ponte-vecchio",
      name: "Ponte Vecchio",
      summary: "A historic bridge with shops, river views, and a classic Florence walking-route atmosphere.",
      highlights: ["Historic bridge", "River view", "Old shops"],
      bestFor: ["Couples", "Friends", "Photography"],
      bestTime: "Late afternoon",
      tags: ["Old Town", "Romantic", "Architecture"],
      imageUrl: "",
      imageAlt: "Ponte Vecchio in Florence",
      imageCredit: "",
    },
    {
      slug: "piazzale-michelangelo",
      name: "Piazzale Michelangelo",
      summary: "A panoramic viewpoint overlooking Florence, especially strong for sunset and closing shots.",
      highlights: ["City panorama", "Sunset view", "Skyline"],
      bestFor: ["Couples", "Solo", "Photography"],
      bestTime: "Sunset",
      tags: ["Scenic", "Sunset", "Viewpoint"],
      imageUrl: "",
      imageAlt: "View from Piazzale Michelangelo",
      imageCredit: "",
    },
  ],

  affHotelsUrl: "https://example.com/affiliate-hotels-florence",
  affToursUrl: "https://example.com/affiliate-tours-florence",
};
