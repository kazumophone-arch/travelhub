import type { City } from "../types";

export const dubrovnikHr: City = {
  slug: "dubrovnik-hr",
  city: "Dubrovnik",
  country: "Croatia",
  stops: ["Old City Walls", "Stradun", "Adriatic View"],

  seasons: ["Spring", "Summer", "Autumn"],
  months: ["May", "June", "September", "October"],
  travelStyles: ["Couples", "Friends", "Luxury"],
  themes: ["World Heritage", "Old Town", "Beach", "Scenic"],

  spotDetails: [
    {
      slug: "old-city-walls",
      name: "Old City Walls",
      summary: "A dramatic walking route above Dubrovnik’s old town with rooftops, stone walls, and sea views.",
      highlights: ["City walls", "Rooftops", "Sea views"],
      bestFor: ["First-time", "Couples", "Photography"],
      bestTime: "Morning",
      tags: ["World Heritage", "Old Town", "Scenic"],
      imageUrl: "",
      imageAlt: "Dubrovnik old city walls",
      imageCredit: "",
    },
    {
      slug: "stradun",
      name: "Stradun",
      summary: "The main old-town street, useful for showing Dubrovnik’s stone architecture and walkable historic core.",
      highlights: ["Main street", "Stone architecture", "Old town walk"],
      bestFor: ["Family", "Friends", "First-time"],
      bestTime: "Morning or evening",
      tags: ["Old Town", "Architecture", "Walkable"],
      imageUrl: "",
      imageAlt: "Stradun in Dubrovnik",
      imageCredit: "",
    },
    {
      slug: "adriatic-view",
      name: "Adriatic View",
      summary: "A scenic coastal view that gives Dubrovnik its strong travel-poster feeling without needing a long route.",
      highlights: ["Blue sea", "Coastal view", "Sunset atmosphere"],
      bestFor: ["Couples", "Luxury", "Photography"],
      bestTime: "Sunset",
      tags: ["Scenic", "Beach", "Romantic"],
      imageUrl: "",
      imageAlt: "Adriatic view in Dubrovnik",
      imageCredit: "",
    },
  ],

  affHotelsUrl: "https://example.com/affiliate-hotels-dubrovnik",
  affToursUrl: "https://example.com/affiliate-tours-dubrovnik",
};
