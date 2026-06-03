export const IMAGE_POSITION_VALUES = [
  "center",
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;

export type ImagePosition = (typeof IMAGE_POSITION_VALUES)[number];

export const IMAGE_POSITION_OPTIONS: { value: ImagePosition; label: string }[] = [
  { value: "center", label: "中央" },
  { value: "top", label: "上" },
  { value: "bottom", label: "下" },
  { value: "left", label: "左" },
  { value: "right", label: "右" },
  { value: "top-left", label: "左上" },
  { value: "top-right", label: "右上" },
  { value: "bottom-left", label: "左下" },
  { value: "bottom-right", label: "右下" },
];

const cssImagePositionMap: Record<ImagePosition, string> = {
  center: "center",
  top: "center top",
  bottom: "center bottom",
  left: "left center",
  right: "right center",
  "top-left": "left top",
  "top-right": "right top",
  "bottom-left": "left bottom",
  "bottom-right": "right bottom",
};

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

export function isImagePosition(value: unknown): value is ImagePosition {
  return IMAGE_POSITION_VALUES.includes(value as ImagePosition);
}

export function normalizeImagePosition(value: unknown): ImagePosition {
  const position = String(value ?? "").trim();

  return isImagePosition(position) ? position : "center";
}

export function getCssImagePosition(value: unknown) {
  return cssImagePositionMap[normalizeImagePosition(value)];
}

export function getImagePositionLabel(value: unknown) {
  const position = normalizeImagePosition(value);
  return IMAGE_POSITION_OPTIONS.find((option) => option.value === position)?.label ?? "中央";
}
