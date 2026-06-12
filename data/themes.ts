export type ThemeGroup = "season" | "style";

export type Theme = {
  slug: string;
  title: string;
  group: ThemeGroup;
  eyebrow: string;
  description: string;
  imageSeed: string;
  accent?: string;
  hints?: string[];
};

export const themes: Theme[] = [
  {
    slug: "spring",
    title: "Spring",
    group: "season",
    eyebrow: "Spring travel",
    description:
      "Wake up the season with gentle light, blooming city streets, and quieter travel rhythms.",
    imageSeed: "travelhub-theme-spring",
    accent: "Blossom, recharge, stroll.",
    hints: ["Kyoto", "Paris", "Amsterdam"],
  },
  {
    slug: "summer",
    title: "Summer",
    group: "season",
    eyebrow: "Summer escapes",
    description:
      "Seek bold coastal days, warm nights, and easy outdoor adventures with a relaxed summer pace.",
    imageSeed: "travelhub-theme-summer",
    accent: "Warm light, open air, late dusk.",
    hints: ["Barcelona", "Dubrovnik", "Venice"],
  },
  {
    slug: "autumn",
    title: "Autumn",
    group: "season",
    eyebrow: "Autumn journeys",
    description:
      "Travel under softer skies, crisp mornings, and color-rich cityscapes that feel thoughtful and calm.",
    imageSeed: "travelhub-theme-autumn",
    accent: "Crisp air, golden glow, quiet wander.",
    hints: ["Edinburgh", "Prague", "Vienna"],
  },
  {
    slug: "winter",
    title: "Winter",
    group: "season",
    eyebrow: "Winter travel",
    description:
      "Choose cooler city scenes, cozy stays, and a slower destination rhythm that feels intimate.",
    imageSeed: "travelhub-theme-winter",
    accent: "Stillness, warmth, thoughtful nights.",
    hints: ["Kyoto", "Vienna", "Rome"],
  },
  {
    slug: "nature",
    title: "Nature",
    group: "style",
    eyebrow: "Nature escapes",
    description:
      "Pick destinations that feel rooted in landscapes, green spaces, and quiet riverside stops.",
    imageSeed: "travelhub-theme-nature",
    accent: "Green, outdoors, ease.",
    hints: ["Kyoto", "Dubrovnik", "Prague"],
  },
  {
    slug: "food",
    title: "Food",
    group: "style",
    eyebrow: "Food journeys",
    description:
      "Follow flavorful streets, local markets, and memorable meals that shape a city story.",
    imageSeed: "travelhub-theme-food",
    accent: "Taste, atmosphere, craft.",
    hints: ["Paris", "Barcelona", "Rome"],
  },
  {
    slug: "luxury",
    title: "Luxury",
    group: "style",
    eyebrow: "Luxury travel",
    description:
      "Find richly composed stays, polished city routes, and experiences that feel considered.",
    imageSeed: "travelhub-theme-luxury",
    accent: "Polished, calm, elevated.",
    hints: ["Rome", "Vienna", "Paris"],
  },
  {
    slug: "couples",
    title: "Couples",
    group: "style",
    eyebrow: "Couples getaways",
    description:
      "Choose destinations with intimate streets, candlelit evenings, and quiet shared moments.",
    imageSeed: "travelhub-theme-couples",
    accent: "Small discoveries, soft evenings.",
    hints: ["Venice", "Paris", "Florence"],
  },
  {
    slug: "first-trip",
    title: "First Trip",
    group: "style",
    eyebrow: "First-time travel",
    description:
      "Begin with destinations that feel easy to navigate, memorable, and rewarding for a first visit.",
    imageSeed: "travelhub-theme-first-trip",
    accent: "Simple, iconic, welcoming.",
    hints: ["Amsterdam", "Rome", "Barcelona"],
  },
  {
    slug: "quiet-escapes",
    title: "Quiet Escapes",
    group: "style",
    eyebrow: "Quiet escapes",
    description:
      "Find calmer city moments, less crowded routes, and destinations made for a slower pace.",
    imageSeed: "travelhub-theme-quiet-escapes",
    accent: "Soft places, calm routes, space to breathe.",
    hints: ["Edinburgh", "Prague", "Kyoto"],
  },
];
