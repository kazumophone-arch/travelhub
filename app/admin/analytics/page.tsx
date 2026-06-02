import Link from "next/link";
import type { CSSProperties } from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Analytics | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

const CLICK_LOG_SELECT =
  "id, created_at, type, city_id, spot_id, city_slug, spot_slug, target_url, src, v, referer";
const PAGE_SIZE = 1000;
const MAX_AGGREGATION_ROWS = 10000;

type ClickLogRow = {
  id: string;
  created_at: string;
  type: string;
  city_id: string | null;
  spot_id: string | null;
  city_slug: string | null;
  spot_slug: string | null;
  target_url: string | null;
  src: string | null;
  v: string | null;
  referer: string | null;
};

type CountResult = {
  count: number | null;
  error: { message?: string } | null;
};

type BreakdownRow = {
  key: string;
  citySlug: string;
  cityName: string;
  spotSlug?: string;
  spotName?: string;
  count: number;
  hotels: number;
  tours: number;
};

type NameMaps = {
  cities: Map<string, string>;
  spots: Map<string, string>;
};

export default async function AdminAnalyticsPage() {
  const now = Date.now();
  const last24Hours = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const last7Days = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    totalResult,
    hotelResult,
    tourResult,
    last7DaysResult,
    last24HoursResult,
    logsResult,
  ] = await Promise.all([
    countClickLogs(),
    countClickLogs({ type: "hotels" }),
    countClickLogs({ type: "tours" }),
    countClickLogs({ since: last7Days }),
    countClickLogs({ since: last24Hours }),
    fetchClickLogsForAggregation(),
  ]);

  const logs = logsResult.rows;
  const nameMaps = await getNameMaps(logs);
  const totalClicks = getCount(totalResult, logs.length);
  const metrics = [
    { label: "Total clicks", value: totalClicks },
    { label: "Hotel clicks", value: getCount(hotelResult, countType(logs, "hotels")) },
    { label: "Tour clicks", value: getCount(tourResult, countType(logs, "tours")) },
    { label: "Last 7 days", value: getCount(last7DaysResult, countSince(logs, last7Days)) },
    {
      label: "Last 24 hours",
      value: getCount(last24HoursResult, countSince(logs, last24Hours)),
    },
  ];
  const cityBreakdown = getCityBreakdown(logs, nameMaps).slice(0, 20);
  const spotBreakdown = getSpotBreakdown(logs, nameMaps).slice(0, 20);
  const latestLogs = logs.slice(0, 20);
  const errorMessage =
    logsResult.error ??
    totalResult.error?.message ??
    hotelResult.error?.message ??
    tourResult.error?.message ??
    last7DaysResult.error?.message ??
    last24HoursResult.error?.message ??
    "";

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <Link href="/admin" style={backStyle}>
          ← Back to admin
        </Link>

        <div style={eyebrowStyle}>Analytics</div>

        <h1 style={titleStyle}>Outbound clicks</h1>

        <p style={textStyle}>
          Review recent hotel and tour redirects logged through TravelHub&apos;s
          outbound route.
        </p>

        {errorMessage ? (
          <div style={noticeStyle}>Analytics could not load: {errorMessage}</div>
        ) : null}

        {!errorMessage && totalClicks === 0 ? (
          <div style={noticeStyle}>No outbound clicks have been logged yet.</div>
        ) : null}

        <section style={metricGridStyle} aria-label="Click summary">
          {metrics.map((metric) => (
            <div key={metric.label} style={metricCardStyle}>
              <span style={metricLabelStyle}>{metric.label}</span>
              <strong style={metricValueStyle}>{formatNumber(metric.value)}</strong>
            </div>
          ))}
        </section>

        {logsResult.isCapped ? (
          <p style={smallNoteStyle}>
            Breakdowns use the latest {formatNumber(MAX_AGGREGATION_ROWS)} logs.
          </p>
        ) : null}

        <AnalyticsTable
          title="Clicks by city"
          emptyText="No city click data yet."
          headers={["City", "Slug", "Clicks", "Hotels", "Tours"]}
          rows={cityBreakdown.map((row) => [
            row.cityName,
            row.citySlug,
            formatNumber(row.count),
            formatNumber(row.hotels),
            formatNumber(row.tours),
          ])}
        />

        <AnalyticsTable
          title="Clicks by spot"
          emptyText="No spot click data yet."
          headers={["City", "Spot", "Clicks", "Hotels", "Tours"]}
          rows={spotBreakdown.map((row) => [
            row.citySlug,
            row.spotName ? `${row.spotName} (${row.spotSlug})` : row.spotSlug ?? "Unknown spot",
            formatNumber(row.count),
            formatNumber(row.hotels),
            formatNumber(row.tours),
          ])}
        />

        <AnalyticsTable
          title="Latest 20 click logs"
          emptyText="No outbound clicks have been logged yet."
          headers={["Time", "Type", "City", "Spot", "Src", "Version", "Target", "Referer"]}
          rows={latestLogs.map((log) => [
            formatDate(log.created_at),
            log.type || "Unknown",
            log.city_slug || "Unknown city",
            log.spot_slug || "",
            log.src || "",
            log.v || "",
            log.target_url || "",
            log.referer || "",
          ])}
        />
      </section>
    </main>
  );
}

async function countClickLogs(options: { type?: string; since?: string } = {}) {
  let query = supabaseAdmin
    .from("click_logs")
    .select("id", { count: "exact", head: true });

  if (options.type) {
    query = query.eq("type", options.type);
  }

  if (options.since) {
    query = query.gte("created_at", options.since);
  }

  const { count, error } = await query;

  return {
    count,
    error: error ? { message: error.message } : null,
  };
}

async function fetchClickLogsForAggregation() {
  const rows: ClickLogRow[] = [];

  for (let start = 0; start < MAX_AGGREGATION_ROWS; start += PAGE_SIZE) {
    const end = start + PAGE_SIZE - 1;
    const { data, error } = await supabaseAdmin
      .from("click_logs")
      .select(CLICK_LOG_SELECT)
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) {
      return {
        rows,
        error: error.message,
        isCapped: false,
      };
    }

    const pageRows = (data ?? []) as ClickLogRow[];
    rows.push(...pageRows);

    if (pageRows.length < PAGE_SIZE) {
      return {
        rows,
        error: "",
        isCapped: false,
      };
    }
  }

  return {
    rows,
    error: "",
    isCapped: true,
  };
}

async function getNameMaps(logs: ClickLogRow[]): Promise<NameMaps> {
  const cityIds = uniqueValues(logs.map((log) => log.city_id));
  const spotIds = uniqueValues(logs.map((log) => log.spot_id));
  const [cityRows, spotRows] = await Promise.all([
    cityIds.length > 0 ? fetchCityNames(cityIds) : Promise.resolve([]),
    spotIds.length > 0 ? fetchSpotNames(spotIds) : Promise.resolve([]),
  ]);

  return {
    cities: new Map(cityRows.map((city) => [city.id, city.city])),
    spots: new Map(spotRows.map((spot) => [spot.id, spot.name])),
  };
}

async function fetchCityNames(cityIds: string[]) {
  const { data, error } = await supabaseAdmin
    .from("cities")
    .select("id, city")
    .in("id", cityIds);

  if (error || !data) {
    return [];
  }

  return data as { id: string; city: string }[];
}

async function fetchSpotNames(spotIds: string[]) {
  const { data, error } = await supabaseAdmin
    .from("spots")
    .select("id, name")
    .in("id", spotIds);

  if (error || !data) {
    return [];
  }

  return data as { id: string; name: string }[];
}

function uniqueValues(values: Array<string | null>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function getCityBreakdown(logs: ClickLogRow[], nameMaps: NameMaps) {
  const breakdown = new Map<string, BreakdownRow>();

  for (const log of logs) {
    const key = log.city_id ?? log.city_slug ?? "unknown-city";
    const current =
      breakdown.get(key) ??
      createBreakdownRow({
        key,
        citySlug: log.city_slug || "Unknown city",
        cityName:
          (log.city_id ? nameMaps.cities.get(log.city_id) : "") ||
          log.city_slug ||
          "Unknown city",
      });

    incrementBreakdown(current, log.type);
    breakdown.set(key, current);
  }

  return sortBreakdown(Array.from(breakdown.values()));
}

function getSpotBreakdown(logs: ClickLogRow[], nameMaps: NameMaps) {
  const breakdown = new Map<string, BreakdownRow>();

  for (const log of logs) {
    if (!log.spot_id && !log.spot_slug) continue;

    const key = `${log.city_id ?? log.city_slug ?? "unknown-city"}:${
      log.spot_id ?? log.spot_slug ?? "unknown-spot"
    }`;
    const current =
      breakdown.get(key) ??
      createBreakdownRow({
        key,
        citySlug: log.city_slug || "Unknown city",
        cityName:
          (log.city_id ? nameMaps.cities.get(log.city_id) : "") ||
          log.city_slug ||
          "Unknown city",
        spotSlug: log.spot_slug || "Unknown spot",
        spotName: log.spot_id ? nameMaps.spots.get(log.spot_id) : "",
      });

    incrementBreakdown(current, log.type);
    breakdown.set(key, current);
  }

  return sortBreakdown(Array.from(breakdown.values()));
}

function createBreakdownRow(input: {
  key: string;
  citySlug: string;
  cityName: string;
  spotSlug?: string;
  spotName?: string;
}): BreakdownRow {
  return {
    ...input,
    count: 0,
    hotels: 0,
    tours: 0,
  };
}

function incrementBreakdown(row: BreakdownRow, type: string) {
  row.count += 1;

  if (type === "hotels") {
    row.hotels += 1;
  }

  if (type === "tours") {
    row.tours += 1;
  }
}

function sortBreakdown(rows: BreakdownRow[]) {
  return rows.sort((first, second) => second.count - first.count);
}

function countType(logs: ClickLogRow[], type: string) {
  return logs.filter((log) => log.type === type).length;
}

function countSince(logs: ClickLogRow[], since: string) {
  const sinceTime = new Date(since).getTime();

  return logs.filter((log) => new Date(log.created_at).getTime() >= sinceTime)
    .length;
}

function getCount(result: CountResult, fallback: number) {
  if (result.error) {
    return fallback;
  }

  return result.count ?? fallback;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || "";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function AnalyticsTable({
  title,
  headers,
  rows,
  emptyText,
}: {
  title: string;
  headers: string[];
  rows: string[][];
  emptyText: string;
}) {
  return (
    <section style={tableSectionStyle}>
      <h2 style={sectionTitleStyle}>{title}</h2>

      {rows.length === 0 ? (
        <div style={noticeStyle}>{emptyText}</div>
      ) : (
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header} style={thStyle}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${title}-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${title}-${rowIndex}-${cellIndex}`} style={tdStyle}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f8faf7",
  color: "#17202a",
};

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1120,
  margin: "0 auto",
  padding: "44px 16px 64px",
};

const backStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 24,
  color: "#138a72",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 850,
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "#f7efe2",
  color: "#9a6a2f",
  fontSize: 12,
  letterSpacing: "0.13em",
  textTransform: "uppercase",
  fontWeight: 850,
};

const titleStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: "clamp(38px, 8vw, 64px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const textStyle: CSSProperties = {
  margin: "0 0 24px",
  maxWidth: 680,
  fontSize: 15,
  lineHeight: 1.75,
  color: "#607080",
};

const metricGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
  gap: 12,
  marginBottom: 16,
};

const metricCardStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  padding: 18,
  borderRadius: 22,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
  boxShadow: "0 8px 24px rgba(30,64,88,.05)",
};

const metricLabelStyle: CSSProperties = {
  fontSize: 12,
  color: "#9a6a2f",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".1em",
};

const metricValueStyle: CSSProperties = {
  fontSize: 34,
  letterSpacing: "-.055em",
};

const tableSectionStyle: CSSProperties = {
  marginTop: 28,
};

const sectionTitleStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: 24,
  letterSpacing: "-.04em",
};

const tableWrapStyle: CSSProperties = {
  overflowX: "auto",
  borderRadius: 22,
  border: "1px solid rgba(23,32,42,.08)",
  background: "#ffffff",
  boxShadow: "0 8px 24px rgba(30,64,88,.05)",
};

const tableStyle: CSSProperties = {
  width: "100%",
  minWidth: 760,
  borderCollapse: "collapse",
};

const thStyle: CSSProperties = {
  padding: "12px 14px",
  textAlign: "left",
  background: "#fffdf8",
  borderBottom: "1px solid rgba(23,32,42,.08)",
  color: "#9a6a2f",
  fontSize: 12,
  letterSpacing: ".08em",
  textTransform: "uppercase",
};

const tdStyle: CSSProperties = {
  maxWidth: 280,
  padding: "12px 14px",
  borderBottom: "1px solid rgba(23,32,42,.06)",
  color: "#607080",
  fontSize: 13,
  lineHeight: 1.5,
  overflowWrap: "anywhere",
};

const noticeStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: "#fffdf8",
  border: "1px solid rgba(168,116,50,.14)",
  color: "#607080",
};

const smallNoteStyle: CSSProperties = {
  margin: "0 0 8px",
  color: "#607080",
  fontSize: 13,
};
