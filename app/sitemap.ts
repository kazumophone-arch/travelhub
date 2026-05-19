import type { MetadataRoute } from "next";
import { cities } from "@/data/cities";
import { isPublishedCity, isPublishedSpot } from "@/data/visibility";

const siteUrl = "https://travelhub-murex.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const publishedCities = Object.values(cities).filter(isPublishedCity);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/cities`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
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

  const cityPages: MetadataRoute.Sitemap = publishedCities.map((city) => ({
    url: `${siteUrl}/c/${city.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const spotPages: MetadataRoute.Sitemap = publishedCities.flatMap((city) =>
    (city.spotDetails ?? [])
      .filter(isPublishedSpot)
      .map((spot) => ({
        url: `${siteUrl}/c/${city.slug}/spot/${spot.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
  );

  return [...staticPages, ...cityPages, ...spotPages];
}