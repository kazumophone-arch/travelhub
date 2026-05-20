export type TravelImageAsset = {
  imageUrl: string;
  alt: string;
  sourceName: string;
  sourceUrl: string;
  credit?: string;
};

function placeholderImage(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/600`;
}

export const cityImages: Record<string, TravelImageAsset> = {
  "rome-it": {
    imageUrl: placeholderImage("travelhub-rome-it"),
    alt: "Travel placeholder image for Rome",
    sourceName: "Picsum",
    sourceUrl: "https://picsum.photos/",
  },
  "venice-it": {
    imageUrl: placeholderImage("travelhub-venice-it"),
    alt: "Travel placeholder image for Venice",
    sourceName: "Picsum",
    sourceUrl: "https://picsum.photos/",
  },
  "florence-it": {
    imageUrl: placeholderImage("travelhub-florence-it"),
    alt: "Travel placeholder image for Florence",
    sourceName: "Picsum",
    sourceUrl: "https://picsum.photos/",
  },
  "paris-fr": {
    imageUrl: placeholderImage("travelhub-paris-fr"),
    alt: "Travel placeholder image for Paris",
    sourceName: "Picsum",
    sourceUrl: "https://picsum.photos/",
  },
  "barcelona-es": {
    imageUrl: placeholderImage("travelhub-barcelona-es"),
    alt: "Travel placeholder image for Barcelona",
    sourceName: "Picsum",
    sourceUrl: "https://picsum.photos/",
  },
  "kyoto-jp": {
    imageUrl: placeholderImage("travelhub-kyoto-jp"),
    alt: "Travel placeholder image for Kyoto",
    sourceName: "Picsum",
    sourceUrl: "https://picsum.photos/",
  },
  "amsterdam-nl": {
    imageUrl: placeholderImage("travelhub-amsterdam-nl"),
    alt: "Travel placeholder image for Amsterdam",
    sourceName: "Picsum",
    sourceUrl: "https://picsum.photos/",
  },
  "prague-cz": {
    imageUrl: placeholderImage("travelhub-prague-cz"),
    alt: "Travel placeholder image for Prague",
    sourceName: "Picsum",
    sourceUrl: "https://picsum.photos/",
  },
  "dubrovnik-hr": {
    imageUrl: placeholderImage("travelhub-dubrovnik-hr"),
    alt: "Travel placeholder image for Dubrovnik",
    sourceName: "Picsum",
    sourceUrl: "https://picsum.photos/",
  },
  "vienna-at": {
    imageUrl: placeholderImage("travelhub-vienna-at"),
    alt: "Travel placeholder image for Vienna",
    sourceName: "Picsum",
    sourceUrl: "https://picsum.photos/",
  },
  "edinburgh-uk": {
    imageUrl: placeholderImage("travelhub-edinburgh-uk"),
    alt: "Travel placeholder image for Edinburgh",
    sourceName: "Picsum",
    sourceUrl: "https://picsum.photos/",
  },
};

export const spotImages: Record<string, TravelImageAsset> = {
  "rome-it/trevi-fountain": {
    imageUrl: placeholderImage("travelhub-rome-it-trevi-fountain"),
    alt: "Travel placeholder image for Trevi Fountain",
    sourceName: "Picsum",
    sourceUrl: "https://picsum.photos/",
  },
};

export function getCityImage(slug: string) {
  return (
    cityImages[slug] ?? {
      imageUrl: placeholderImage(`travelhub-city-${slug}`),
      alt: `Travel placeholder image for ${slug}`,
      sourceName: "Picsum",
      sourceUrl: "https://picsum.photos/",
    }
  );
}

export function getSpotImage(citySlug: string, spotSlug: string) {
  const key = `${citySlug}/${spotSlug}`;

  return (
    spotImages[key] ?? {
      imageUrl: placeholderImage(`travelhub-spot-${key}`),
      alt: `Travel placeholder image for ${key}`,
      sourceName: "Picsum",
      sourceUrl: "https://picsum.photos/",
    }
  );
}
