import Link from "next/link";
import type { CSSProperties } from "react";
import { AdminNavigation } from "@/components/AdminNavigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "クリック分析 | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

const CLICK_LOG_SELECT =
  "id, created_at, type, city_id, spot_id, city_slug, spot_slug, target_url, src, v, referer";
const PAGE_SIZE = 1000;
const MAX_AGGREGATION_ROWS = 10000;
const UNSET_LABEL = "未設定";
const RANGE_OPTIONS: RangeOption[] = [
  { key: "24h", label: "24時間", milliseconds: 24 * 60 * 60 * 1000 },
  { key: "7d", label: "7日間", milliseconds: 7 * 24 * 60 * 60 * 1000 },
  { key: "30d", label: "30日間", milliseconds: 30 * 24 * 60 * 60 * 1000 },
  { key: "all", label: "全期間" },
];

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

type RangeKey = "24h" | "7d" | "30d" | "all";

type RangeOption = {
  key: RangeKey;
  label: string;
  milliseconds?: number;
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

type TrackingBreakdownRow = {
  key: string;
  src?: string;
  v?: string;
  count: number;
  hotels: number;
  tours: number;
  latestAt: string;
};

type NameMaps = {
  cities: Map<string, string>;
  spots: Map<string, string>;
};

type AdminAnalyticsPageProps = {
  searchParams: Promise<{
    range?: string | string[];
  }>;
};

export default async function AdminAnalyticsPage({ searchParams }: AdminAnalyticsPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedRange = getRangeOption(readSearchParam(resolvedSearchParams.range));
  const now = new Date();
  const selectedSince = getRangeSince(selectedRange, now);
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const selectedLast24Hours = getLaterSince(selectedSince, last24Hours);
  const selectedLast7Days = getLaterSince(selectedSince, last7Days);

  const [
    totalResult,
    hotelResult,
    tourResult,
    last7DaysResult,
    last24HoursResult,
    logsResult,
  ] = await Promise.all([
    countClickLogs({ since: selectedSince }),
    countClickLogs({ type: "hotels", since: selectedSince }),
    countClickLogs({ type: "tours", since: selectedSince }),
    countClickLogs({ since: selectedLast7Days }),
    countClickLogs({ since: selectedLast24Hours }),
    fetchClickLogsForAggregation({ since: selectedSince }),
  ]);

  const logs = logsResult.rows;
  const nameMaps = await getNameMaps(logs);
  const totalClicks = getCount(totalResult, logs.length);
  const metrics = [
    { label: "合計クリック", value: totalClicks },
    { label: "ホテルクリック", value: getCount(hotelResult, countType(logs, "hotels")) },
    { label: "ツアークリック", value: getCount(tourResult, countType(logs, "tours")) },
    { label: "過去7日", value: getCount(last7DaysResult, countSince(logs, last7Days)) },
    {
      label: "過去24時間",
      value: getCount(last24HoursResult, countSince(logs, last24Hours)),
    },
  ];
  const cityBreakdown = getCityBreakdown(logs, nameMaps).slice(0, 20);
  const spotBreakdown = getSpotBreakdown(logs, nameMaps).slice(0, 20);
  const sourceBreakdown = getSourceBreakdown(logs).slice(0, 20);
  const versionBreakdown = getVersionBreakdown(logs).slice(0, 20);
  const sourceVersionBreakdown = getSourceVersionBreakdown(logs).slice(0, 30);
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
        <AdminNavigation />

        <Link href="/admin" style={backStyle}>
          ← 管理メニューへ戻る
        </Link>

        <div style={eyebrowStyle}>クリック分析</div>

        <h1 style={titleStyle}>外部リンククリック</h1>

        <p style={textStyle}>
          TravelHub の外部リンク経由で記録されたホテルとツアーのクリックを選択中の期間で確認します。
        </p>

        <RangeFilter selectedRange={selectedRange.key} />

        <Link
          href={`/admin/analytics/export?range=${selectedRange.key}`}
          style={exportLinkStyle}
        >
          CSV をエクスポート ↓
        </Link>

        <SnsGuide />

        {errorMessage ? (
          <div style={noticeStyle}>分析データを読み込めませんでした: {errorMessage}</div>
        ) : null}

        {!errorMessage && totalClicks === 0 ? (
          <div style={noticeStyle}>外部リンククリックはまだ記録されていません。</div>
        ) : null}

        <section style={metricGridStyle} aria-label="クリック概要">
          {metrics.map((metric) => (
            <div key={metric.label} style={metricCardStyle}>
              <span style={metricLabelStyle}>{metric.label}</span>
              <strong style={metricValueStyle}>{formatNumber(metric.value)}</strong>
            </div>
          ))}
        </section>

        {logsResult.isCapped ? (
          <p style={smallNoteStyle}>
            内訳は最新 {formatNumber(MAX_AGGREGATION_ROWS)} 件のログを使っています。
          </p>
        ) : null}

        <AnalyticsTable
          title="都市別クリック"
          emptyText="都市別クリックデータはまだありません。"
          headers={["都市", "スラッグ", "クリック", "ホテル", "ツアー"]}
          rows={cityBreakdown.map((row) => [
            row.cityName,
            row.citySlug,
            formatNumber(row.count),
            formatNumber(row.hotels),
            formatNumber(row.tours),
          ])}
        />

        <AnalyticsTable
          title="スポット別クリック"
          emptyText="スポット別クリックデータはまだありません。"
          headers={["都市", "スポット", "クリック", "ホテル", "ツアー"]}
          rows={spotBreakdown.map((row) => [
            row.citySlug,
            row.spotName ? `${row.spotName} (${row.spotSlug})` : row.spotSlug ?? "不明なスポット",
            formatNumber(row.count),
            formatNumber(row.hotels),
            formatNumber(row.tours),
          ])}
        />

        <AnalyticsTable
          title="流入元別クリック"
          emptyText="流入元別クリックデータはまだありません。"
          headers={["流入元", "クリック", "ホテル", "ツアー", "最新クリック"]}
          rows={sourceBreakdown.map((row) => [
            row.src ?? UNSET_LABEL,
            formatNumber(row.count),
            formatNumber(row.hotels),
            formatNumber(row.tours),
            formatDate(row.latestAt),
          ])}
        />

        <AnalyticsTable
          title="投稿ID別クリック"
          emptyText="投稿ID別クリックデータはまだありません。"
          headers={["投稿ID", "クリック", "ホテル", "ツアー", "最新クリック"]}
          rows={versionBreakdown.map((row) => [
            row.v ?? UNSET_LABEL,
            formatNumber(row.count),
            formatNumber(row.hotels),
            formatNumber(row.tours),
            formatDate(row.latestAt),
          ])}
        />

        <AnalyticsTable
          title="流入元 × 投稿ID 別クリック"
          emptyText="流入元と投稿IDの組み合わせ別クリックデータはまだありません。"
          headers={["流入元", "投稿ID", "クリック", "ホテル", "ツアー"]}
          rows={sourceVersionBreakdown.map((row) => [
            row.src ?? UNSET_LABEL,
            row.v ?? UNSET_LABEL,
            formatNumber(row.count),
            formatNumber(row.hotels),
            formatNumber(row.tours),
          ])}
        />

        <AnalyticsTable
          title="最新20件のクリックログ"
          emptyText="外部リンククリックはまだ記録されていません。"
          headers={["日時", "種類", "都市", "スポット", "流入元", "投稿ID", "遷移先", "参照元"]}
          rows={latestLogs.map((log) => [
            formatDate(log.created_at),
            formatClickType(log.type),
            log.city_slug || "不明な都市",
            log.spot_slug || "",
            displayTrackingValue(log.src),
            displayTrackingValue(log.v),
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

async function fetchClickLogsForAggregation(options: { since?: string } = {}) {
  const rows: ClickLogRow[] = [];

  for (let start = 0; start < MAX_AGGREGATION_ROWS; start += PAGE_SIZE) {
    const end = start + PAGE_SIZE - 1;
    let query = supabaseAdmin
      .from("click_logs")
      .select(CLICK_LOG_SELECT)
      .order("created_at", { ascending: false });

    if (options.since) {
      query = query.gte("created_at", options.since);
    }

    const { data, error } = await query.range(start, end);

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

function readSearchParam(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const trimmed = rawValue?.trim();
  return trimmed || "";
}

function getRangeOption(value: string) {
  return RANGE_OPTIONS.find((option) => option.key === value) ?? RANGE_OPTIONS[1];
}

function getRangeSince(range: RangeOption, now: Date) {
  if (!range.milliseconds) return undefined;

  return new Date(now.getTime() - range.milliseconds).toISOString();
}

function getLaterSince(first: string | undefined, second: string) {
  if (!first) return second;

  return new Date(first).getTime() > new Date(second).getTime() ? first : second;
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
        citySlug: log.city_slug || "不明な都市",
        cityName:
          (log.city_id ? nameMaps.cities.get(log.city_id) : "") ||
          log.city_slug ||
          "不明な都市",
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
        citySlug: log.city_slug || "不明な都市",
        cityName:
          (log.city_id ? nameMaps.cities.get(log.city_id) : "") ||
          log.city_slug ||
          "不明な都市",
        spotSlug: log.spot_slug || "不明なスポット",
        spotName: log.spot_id ? nameMaps.spots.get(log.spot_id) : "",
      });

    incrementBreakdown(current, log.type);
    breakdown.set(key, current);
  }

  return sortBreakdown(Array.from(breakdown.values()));
}

function getSourceBreakdown(logs: ClickLogRow[]) {
  const breakdown = new Map<string, TrackingBreakdownRow>();

  for (const log of logs) {
    const src = displayTrackingValue(log.src);
    const current =
      breakdown.get(src) ??
      createTrackingBreakdownRow({
        key: src,
        src,
      });

    incrementTrackingBreakdown(current, log);
    breakdown.set(src, current);
  }

  return sortTrackingBreakdown(Array.from(breakdown.values()));
}

function getVersionBreakdown(logs: ClickLogRow[]) {
  const breakdown = new Map<string, TrackingBreakdownRow>();

  for (const log of logs) {
    const v = displayTrackingValue(log.v);
    const current =
      breakdown.get(v) ??
      createTrackingBreakdownRow({
        key: v,
        v,
      });

    incrementTrackingBreakdown(current, log);
    breakdown.set(v, current);
  }

  return sortTrackingBreakdown(Array.from(breakdown.values()));
}

function getSourceVersionBreakdown(logs: ClickLogRow[]) {
  const breakdown = new Map<string, TrackingBreakdownRow>();

  for (const log of logs) {
    const src = displayTrackingValue(log.src);
    const v = displayTrackingValue(log.v);
    const key = `${src}:${v}`;
    const current =
      breakdown.get(key) ??
      createTrackingBreakdownRow({
        key,
        src,
        v,
      });

    incrementTrackingBreakdown(current, log);
    breakdown.set(key, current);
  }

  return sortTrackingBreakdown(Array.from(breakdown.values()));
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

function createTrackingBreakdownRow(input: {
  key: string;
  src?: string;
  v?: string;
}): TrackingBreakdownRow {
  return {
    ...input,
    count: 0,
    hotels: 0,
    tours: 0,
    latestAt: "",
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

function incrementTrackingBreakdown(row: TrackingBreakdownRow, log: ClickLogRow) {
  row.count += 1;

  if (log.type === "hotels") {
    row.hotels += 1;
  }

  if (log.type === "tours") {
    row.tours += 1;
  }

  if (!row.latestAt || new Date(log.created_at).getTime() > new Date(row.latestAt).getTime()) {
    row.latestAt = log.created_at;
  }
}

function sortBreakdown(rows: BreakdownRow[]) {
  return rows.sort((first, second) => second.count - first.count);
}

function sortTrackingBreakdown(rows: TrackingBreakdownRow[]) {
  return rows.sort((first, second) => {
    if (second.count !== first.count) {
      return second.count - first.count;
    }

    return new Date(second.latestAt).getTime() - new Date(first.latestAt).getTime();
  });
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
  return new Intl.NumberFormat("ja-JP").format(value);
}

function displayTrackingValue(value: string | null) {
  const trimmed = value?.trim();
  return trimmed || UNSET_LABEL;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || "";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatClickType(value: string) {
  if (value === "hotels") return "ホテル";
  if (value === "tours") return "ツアー";
  return value || "不明";
}

function RangeFilter({ selectedRange }: { selectedRange: RangeKey }) {
  return (
    <nav aria-label="分析期間" style={rangeFilterStyle}>
      {RANGE_OPTIONS.map((option) => {
        const isActive = option.key === selectedRange;
        return (
          <Link
            key={option.key}
            href={`/admin/analytics?range=${option.key}`}
            style={{
              ...rangeLinkStyle,
              ...(isActive ? rangeLinkActiveStyle : {}),
            }}
            aria-current={isActive ? "page" : undefined}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SnsGuide() {
  return (
    <section style={guideStyle} aria-labelledby="sns-guide-title">
      <h2 id="sns-guide-title" style={guideTitleStyle}>
        SNS用リンクの使い方
      </h2>
      <p style={guideTextStyle}>
        <strong>src</strong> は流入元、<strong>v</strong> は投稿ID・動画IDです。TikTok は{" "}
        <code style={codeStyle}>src=tiktok</code>、YouTube Shorts は{" "}
        <code style={codeStyle}>src=youtube</code>、Instagram は{" "}
        <code style={codeStyle}>src=instagram</code> を使います。
      </p>
      <div style={exampleGridStyle}>
        <code style={exampleCodeStyle}>/c/kyoto-jp?src=tiktok&amp;v=kyoto_001</code>
        <code style={exampleCodeStyle}>
          /c/kyoto-jp/spot/fushimi-inari-shrine?src=tiktok&amp;v=kyoto_fushimi_001
        </code>
      </div>
      <p style={guideNoteStyle}>
        命名例: 都市動画は <code style={codeStyle}>kyoto_001</code>、スポット動画は{" "}
        <code style={codeStyle}>kyoto_fushimi_001</code>。小文字、数字、アンダースコアでそろえます。
      </p>
    </section>
  );
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

const rangeFilterStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  margin: "0 0 18px",
};

const rangeLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 36,
  padding: "8px 13px",
  borderRadius: 999,
  border: "1px solid rgba(23,32,42,.1)",
  background: "#ffffff",
  color: "#607080",
  fontSize: 13,
  fontWeight: 850,
  textDecoration: "none",
};

const rangeLinkActiveStyle: CSSProperties = {
  background: "#17202a",
  borderColor: "#17202a",
  color: "#ffffff",
};

const exportLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 36,
  marginBottom: 24,
  padding: "8px 13px",
  borderRadius: 999,
  border: "1px solid rgba(19,138,114,.2)",
  background: "#ffffff",
  color: "#138a72",
  fontSize: 13,
  fontWeight: 850,
  textDecoration: "none",
};

const guideStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  margin: "0 0 24px",
  padding: 18,
  borderRadius: 22,
  border: "1px solid rgba(19,138,114,.15)",
  background: "#ffffff",
  boxShadow: "0 8px 24px rgba(30,64,88,.05)",
};

const guideTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
  letterSpacing: "-.02em",
};

const guideTextStyle: CSSProperties = {
  margin: 0,
  color: "#607080",
  fontSize: 14,
  lineHeight: 1.75,
};

const exampleGridStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

const codeStyle: CSSProperties = {
  padding: "2px 5px",
  borderRadius: 6,
  background: "#f8faf7",
  color: "#17202a",
  fontSize: 13,
};

const exampleCodeStyle: CSSProperties = {
  display: "block",
  padding: "10px 12px",
  borderRadius: 12,
  background: "#f8faf7",
  color: "#17202a",
  fontSize: 13,
  overflowWrap: "anywhere",
};

const guideNoteStyle: CSSProperties = {
  margin: 0,
  color: "#607080",
  fontSize: 13,
  lineHeight: 1.7,
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
