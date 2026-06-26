export type ClimateDemand = "low" | "mid" | "high" | "peak";

export type ClimateMonth = {
  month: string;
  high: number | null;
  low: number | null;
  demand: ClimateDemand;
};

export type CityClimate = {
  months: ClimateMonth[];
  peak_season: string;
  value_season: string;
  weather_summary: string;
};

export const CLIMATE_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const DEMAND_VALUES: ClimateDemand[] = ["low", "mid", "high", "peak"];

export const DEMAND_META: Record<
  ClimateDemand,
  { label: string; short: string; color: string }
> = {
  low: { label: "Quietest · best value", short: "Best value", color: "#1f9d6b" },
  mid: { label: "Comfortable · fewer crowds", short: "Comfortable", color: "#3b6fb0" },
  high: { label: "Busy · prices rising", short: "Busy", color: "#BF9B30" },
  peak: { label: "Peak · book early", short: "Peak", color: "#c2542f" },
};

function toDemand(value: unknown): ClimateDemand {
  const demand = String(value ?? "").trim().toLowerCase();
  return (DEMAND_VALUES as string[]).includes(demand) ? (demand as ClimateDemand) : "mid";
}

function toTemp(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export function emptyClimateMonths(): ClimateMonth[] {
  return CLIMATE_MONTHS.map((month) => ({
    month,
    high: null,
    low: null,
    demand: "mid" as ClimateDemand,
  }));
}

export function normalizeClimate(value: unknown): CityClimate {
  const record = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;

  const byMonth = new Map<string, Record<string, unknown>>();

  if (Array.isArray(record.months)) {
    for (const item of record.months) {
      if (!item || typeof item !== "object") continue;
      const monthValue = String((item as { month?: unknown }).month ?? "").trim();
      const key = monthValue.slice(0, 3).toLowerCase();
      const matched = CLIMATE_MONTHS.find((m) => m.toLowerCase() === key);
      if (matched) byMonth.set(matched, item as Record<string, unknown>);
    }
  }

  const months: ClimateMonth[] = CLIMATE_MONTHS.map((month) => {
    const item = byMonth.get(month);
    return {
      month,
      high: toTemp(item?.high),
      low: toTemp(item?.low),
      demand: toDemand(item?.demand),
    };
  });

  return {
    months,
    peak_season: String(record.peak_season ?? "").trim(),
    value_season: String(record.value_season ?? "").trim(),
    weather_summary: String(record.weather_summary ?? "").trim(),
  };
}

export function hasClimateData(climate: CityClimate | null | undefined): boolean {
  if (!climate) return false;

  const hasTemps = climate.months.some(
    (month) => month.high !== null || month.low !== null
  );

  return (
    hasTemps ||
    Boolean(climate.peak_season) ||
    Boolean(climate.value_season) ||
    Boolean(climate.weather_summary)
  );
}
