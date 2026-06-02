export function getOptionalHttpUrl(value: string | null | undefined) {
  const urlValue = String(value ?? "").trim();

  if (!urlValue) {
    return "";
  }

  try {
    const url = new URL(urlValue);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "";
    }

    return urlValue;
  } catch {
    return "";
  }
}

export function toCssUrl(value: string | null | undefined) {
  const url = getOptionalHttpUrl(value);

  return url ? `url(${JSON.stringify(url)})` : "";
}

export function getImageBackground(
  imageUrl: string | null | undefined,
  overlay: string,
  fallback: string
) {
  const cssUrl = toCssUrl(imageUrl);

  return cssUrl ? `${overlay}, ${cssUrl}` : fallback;
}
