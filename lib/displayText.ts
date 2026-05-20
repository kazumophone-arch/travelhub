export function isValidDisplayText(value: string | null | undefined) {
  if (!value) return false;

  const normalized = value.trim().toLowerCase();

  return (
    normalized !== "" &&
    normalized !== "none" &&
    normalized !== "n/a" &&
    normalized !== "null" &&
    normalized !== "-"
  );
}

export function getDisplayStops(
  city: {
    stops: string[];
  },
  limit = 3
) {
  return city.stops.filter(isValidDisplayText).slice(0, limit);
}
