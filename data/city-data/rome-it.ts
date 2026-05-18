import type { City } from "../types";

export const romeIt: City = {
  slug: "rome-it",
  city: "Rome",
  country: "Italy",
  stops: ["Historic Center", "Trevi Fountain", "Sunset View"],

  imageUrl: "",
  imageAlt: "Rome historic city view",
  imageCredit: "",
  
  seasons: ["Spring", "Autumn"],
  months: ["April", "May", "October"],
  travelStyles: ["Couples", "Family", "Solo"],
  themes: ["World Heritage", "Old Town", "Architecture", "Romantic"],

  spotDetails: [
    {
      slug: "historic-center",
      name: "Historic Center",
      summary:
        "A walkable area filled with old streets, classical architecture, plazas, and historic atmosphere. Best for first-time visitors who want to feel Rome immediately.",
      highlights: ["Old streets", "Historic architecture", "Walkable plazas"],
      bestFor: ["First-time", "Couples", "Solo"],
      bestTime: "Morning or late afternoon",
      tags: ["Old Town", "World Heritage", "Architecture"],
    },
    {
  slug: "trevi-fountain",
  name: "Trevi Fountain",
  summary:
    "One of Rome’s most iconic stops, especially strong for short-form travel videos and first-trip itineraries. It works best as a dramatic visual highlight.",
  highlights: ["Iconic fountain", "Photo spot", "Central location"],
  bestFor: ["Couples", "First-time", "Friends"],
  bestTime: "Early morning or evening",
  tags: ["Romantic", "Iconic", "Architecture"],

  imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
imageAlt: "Trevi Fountain in Rome",
imageCredit: "Photo: Unsplash",
},
    {
      slug: "sunset-view",
      name: "Sunset View",
      summary:
        "A scenic final stop for ending a Rome day with atmosphere. Use this as the emotional closing point before choosing hotels or tours.",
      highlights: ["Golden light", "City view", "Evening atmosphere"],
      bestFor: ["Couples", "Solo", "Luxury"],
      bestTime: "Sunset",
      tags: ["Scenic", "Romantic", "Evening"],
    },
  ],

  affHotelsUrl: "https://example.com/affiliate-hotels-rome",
  affToursUrl: "https://example.com/affiliate-tours-rome",
};