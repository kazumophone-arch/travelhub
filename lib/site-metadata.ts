import type { Metadata } from "next";
import { getOptionalHttpUrl } from "@/lib/url-fields";

export const SITE_NAME = "Taleglen";
export const DEFAULT_SITE_DESCRIPTION =
  "An editorial travel guide for discovering cities, seasonal escapes, and places worth planning around.";

const FALLBACK_SITE_URL = "https://travelhub-murex.vercel.app";

type PublicMetadataInput = {
  title: string;
  description: string;
  path: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  return new URL(normalizeSiteUrl(siteUrl) || FALLBACK_SITE_URL);
}

export function getCanonicalPath(path: string) {
  if (!path || path === "/") {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export function getAbsoluteUrl(path: string) {
  return new URL(getCanonicalPath(path), getSiteUrl()).toString();
}

export function createPublicMetadata({
  title,
  description,
  path,
  imageUrl,
  imageAlt,
}: PublicMetadataInput): Metadata {
  const image = getOptionalHttpUrl(imageUrl);
  const canonical = getCanonicalPath(path);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: SITE_NAME,
      url: canonical,
      images: image
        ? [
            {
              url: image,
              alt: imageAlt || title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function normalizeSiteUrl(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  const urlValue = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const url = new URL(urlValue);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "";
    }

    return url.origin;
  } catch {
    return "";
  }
}

