import { isImagePosition } from "@/lib/url-fields";

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
    return `${label}は必須です。`;
  }

  if (!slugPattern.test(slug)) {
    return `${label}は小文字、数字、ハイフンのみで入力してください。スペースや先頭・末尾のハイフンは使えません。`;
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
      return `${label}は http:// または https:// で始まるURLにしてください。`;
    }
  } catch {
    return `${label}は有効なURLにしてください。`;
  }

  return null;
}

export function validateImagePosition(value: unknown) {
  const imagePosition = asString(value);

  if (!imagePosition) {
    return null;
  }

  if (!isImagePosition(imagePosition)) {
    return "画像の表示位置は選択肢から選んでください。";
  }

  return null;
}

export function formatValidationErrors(errors: string[]) {
  return errors.length === 1
    ? errors[0]
    : `次の項目を修正してください: ${errors.join(" ")}`;
}

export type CityValidationInput = {
  city?: unknown;
  slug?: unknown;
  countryId?: unknown;
  country?: unknown;
  imageUrl?: unknown;
  imagePosition?: unknown;
  imageSourceUrl?: unknown;
  affiliateHotelUrl?: unknown;
  affiliateTourUrl?: unknown;
  sortRank?: unknown;
  featuredRank?: unknown;
};

export function validateCityFields(input: CityValidationInput) {
  const errors: string[] = [];

  if (!asString(input.city)) {
    errors.push("都市名は必須です。");
  }

  const slugError = validateSlug(input.slug, "都市スラッグ");
  if (slugError) errors.push(slugError);

  if (!asString(input.country)) {
    errors.push("国は必須です。");
  }

  const imageUrlError = validateOptionalUrl(input.imageUrl, "画像URL");
  if (imageUrlError) errors.push(imageUrlError);

  const imageSourceUrlError = validateOptionalUrl(
    input.imageSourceUrl,
    "画像出典URL"
  );
  if (imageSourceUrlError) errors.push(imageSourceUrlError);

  const imagePositionError = validateImagePosition(input.imagePosition);
  if (imagePositionError) errors.push(imagePositionError);

  const hotelUrlError = validateOptionalUrl(
    input.affiliateHotelUrl,
    "ホテルアフィリエイトURL"
  );
  if (hotelUrlError) errors.push(hotelUrlError);

  const tourUrlError = validateOptionalUrl(
    input.affiliateTourUrl,
    "ツアーアフィリエイトURL"
  );
  if (tourUrlError) errors.push(tourUrlError);

  if (
    input.sortRank !== undefined &&
    input.sortRank !== null &&
    input.sortRank !== "" &&
    !Number.isFinite(Number(input.sortRank))
  ) {
    errors.push("表示順は数値で入力してください。");
  }

  if (
    input.featuredRank !== undefined &&
    input.featuredRank !== null &&
    input.featuredRank !== "" &&
    !Number.isFinite(Number(input.featuredRank))
  ) {
    errors.push("注目順は数値で入力してください。");
  }

  return errors;
}

export type CountryValidationInput = {
  name?: unknown;
  slug?: unknown;
  imageUrl?: unknown;
  imageSourceUrl?: unknown;
  sortRank?: unknown;
};

export function validateCountryFields(input: CountryValidationInput) {
  const errors: string[] = [];

  if (!asString(input.name)) {
    errors.push("国名は必須です。");
  }

  const slugError = validateSlug(input.slug, "国スラッグ");
  if (slugError) errors.push(slugError);

  const imageUrlError = validateOptionalUrl(input.imageUrl, "画像URL");
  if (imageUrlError) errors.push(imageUrlError);

  const imageSourceUrlError = validateOptionalUrl(
    input.imageSourceUrl,
    "画像出典URL"
  );
  if (imageSourceUrlError) errors.push(imageSourceUrlError);

  if (
    input.sortRank !== undefined &&
    input.sortRank !== null &&
    input.sortRank !== "" &&
    !Number.isFinite(Number(input.sortRank))
  ) {
    errors.push("表示順は数値で入力してください。");
  }

  return errors;
}

export type SpotValidationInput = {
  cityId?: unknown;
  name?: unknown;
  slug?: unknown;
  imageUrl?: unknown;
  imagePosition?: unknown;
  imageSourceUrl?: unknown;
  affiliateHotelUrl?: unknown;
  affiliateTourUrl?: unknown;
};

export function validateSpotFields(input: SpotValidationInput) {
  const errors: string[] = [];

  if (!asString(input.cityId)) {
    errors.push("都市を選択してください。");
  }

  if (!asString(input.name)) {
    errors.push("スポット名は必須です。");
  }

  const slugError = validateSlug(input.slug, "スポットスラッグ");
  if (slugError) errors.push(slugError);

  const imageUrlError = validateOptionalUrl(input.imageUrl, "画像URL");
  if (imageUrlError) errors.push(imageUrlError);

  const imageSourceUrlError = validateOptionalUrl(
    input.imageSourceUrl,
    "画像出典URL"
  );
  if (imageSourceUrlError) errors.push(imageSourceUrlError);

  const imagePositionError = validateImagePosition(input.imagePosition);
  if (imagePositionError) errors.push(imagePositionError);

  const hotelUrlError = validateOptionalUrl(
    input.affiliateHotelUrl,
    "ホテルアフィリエイトURL"
  );
  if (hotelUrlError) errors.push(hotelUrlError);

  const tourUrlError = validateOptionalUrl(
    input.affiliateTourUrl,
    "ツアーアフィリエイトURL"
  );
  if (tourUrlError) errors.push(tourUrlError);

  return errors;
}
