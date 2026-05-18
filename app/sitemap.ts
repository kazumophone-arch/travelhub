import type { MetadataRoute } from "next";
import { cities } from "@/data/cities";

const siteUrl = "https://travelhub-murex.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/affiliate-disclosure`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const cityPages: MetadataRoute.Sitemap = Object.values(cities).map((city) => ({
    url: `${siteUrl}/c/${city.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const spotPages: MetadataRoute.Sitemap = Object.values(cities).flatMap((city) =>
    (city.spotDetails ?? []).map((spot) => ({
      url: `${siteUrl}/c/${city.slug}/spot/${spot.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...cityPages, ...spotPages];
}
