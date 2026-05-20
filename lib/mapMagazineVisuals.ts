const visualThemes = [
  {
    base: "#f8fcff",
    accent: "rgba(47, 128, 237, 0.18)",
    route: "rgba(19, 138, 114, 0.24)",
    sand: "rgba(246, 215, 168, 0.42)",
  },
  {
    base: "#fbfbf7",
    accent: "rgba(19, 138, 114, 0.16)",
    route: "rgba(47, 128, 237, 0.20)",
    sand: "rgba(246, 215, 168, 0.48)",
  },
  {
    base: "#f7fbfa",
    accent: "rgba(246, 184, 96, 0.24)",
    route: "rgba(19, 138, 114, 0.20)",
    sand: "rgba(47, 128, 237, 0.12)",
  },
];

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

export function getMapMagazineVisual(key: string) {
  const theme = visualThemes[hashString(key) % visualThemes.length];

  return `
    radial-gradient(circle at 16% 20%, ${theme.accent} 0 7px, transparent 8px),
    radial-gradient(circle at 78% 28%, ${theme.route} 0 5px, transparent 6px),
    radial-gradient(circle at 62% 76%, ${theme.sand} 0 9px, transparent 10px),
    linear-gradient(135deg, transparent 0 38%, ${theme.route} 39% 41%, transparent 42% 100%),
    linear-gradient(28deg, transparent 0 52%, rgba(96, 112, 128, 0.10) 53% 54%, transparent 55% 100%),
    linear-gradient(180deg, ${theme.base} 0%, #ffffff 58%, #f3faf8 100%)
  `;
}

export function getMapMagazineSpotVisual(index: number) {
  return getMapMagazineVisual(`spot-${index}`);
}
