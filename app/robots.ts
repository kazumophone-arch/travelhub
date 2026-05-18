import type { MetadataRoute } from "next";

const siteUrl = "https://travelhub-murex.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/out/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
