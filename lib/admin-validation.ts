const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function asString(value: unknown) {
  return String(value ?? "").trim();
}

export function validateSlug(value: unknown, label: string) {
  const slug = asString(value);

  if (!slug) {
    return `${label} is required.`;
  }

  if (!slugPattern.test(slug)) {
    return `${label} must use lowercase letters, numbers, and hyphens only, with no spaces or leading/trailing hyphen.`;
  }

  return null;
}

export function validateOptionalUrl(value: unknown, label: string) {
  const urlValue = asString(value);

  if (!urlValue) {
    return null;
  }

  try {
    const url = new URL(urlValue);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return `${label} must start with http:// or https://.`;
    }
  } catch {
    return `${label} must be a valid URL.`;
  }

  return null;
}

export function formatValidationErrors(errors: string[]) {
  return errors.length === 1
    ? errors[0]
    : `Please fix these fields: ${errors.join(" ")}`;
}

export type CityValidationInput = {
  city?: unknown;
  slug?: unknown;
  country?: unknown;
  imageUrl?: unknown;
  imageSourceUrl?: unknown;
  sortRank?: unknown;
};

export function validateCityFields(input: CityValidationInput) {
  const errors: string[] = [];

  if (!asString(input.city)) {
    errors.push("City name is required.");
  }

  const slugError = validateSlug(input.slug, "City slug");
  if (slugError) errors.push(slugError);

  if (!asString(input.country)) {
    errors.push("Country is required.");
  }

  const imageUrlError = validateOptionalUrl(input.imageUrl, "Image URL");
  if (imageUrlError) errors.push(imageUrlError);

  const imageSourceUrlError = validateOptionalUrl(
    input.imageSourceUrl,
    "Image source URL"
  );
  if (imageSourceUrlError) errors.push(imageSourceUrlError);

  if (
    input.sortRank !== undefined &&
    input.sortRank !== null &&
    input.sortRank !== "" &&
    !Number.isFinite(Number(input.sortRank))
  ) {
    errors.push("Sort rank must be a number.");
  }

  return errors;
}

export type SpotValidationInput = {
  cityId?: unknown;
  name?: unknown;
  slug?: unknown;
  imageUrl?: unknown;
  imageSourceUrl?: unknown;
  affiliateHotelUrl?: unknown;
  affiliateTourUrl?: unknown;
};

export function validateSpotFields(input: SpotValidationInput) {
  const errors: string[] = [];

  if (!asString(input.cityId)) {
    errors.push("City is required.");
  }

  if (!asString(input.name)) {
    errors.push("Spot name is required.");
  }

  const slugError = validateSlug(input.slug, "Spot slug");
  if (slugError) errors.push(slugError);

  const imageUrlError = validateOptionalUrl(input.imageUrl, "Image URL");
  if (imageUrlError) errors.push(imageUrlError);

  const imageSourceUrlError = validateOptionalUrl(
    input.imageSourceUrl,
    "Image source URL"
  );
  if (imageSourceUrlError) errors.push(imageSourceUrlError);

  const hotelUrlError = validateOptionalUrl(
    input.affiliateHotelUrl,
    "Hotel affiliate URL"
  );
  if (hotelUrlError) errors.push(hotelUrlError);

  const tourUrlError = validateOptionalUrl(
    input.affiliateTourUrl,
    "Tour affiliate URL"
  );
  if (tourUrlError) errors.push(tourUrlError);

  return errors;
}
