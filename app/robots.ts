import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/out/"],
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
}
