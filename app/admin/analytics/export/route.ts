import { supabaseAdmin } from "@/lib/supabase-admin";

const PAGE_SIZE = 1000;
const MAX_ROWS = 10000;

const RANGE_MS: Record<RangeKey, number | undefined> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  all: undefined,
};

type RangeKey = "24h" | "7d" | "30d" | "all";

type ClickLogExportRow = {
  created_at: string;
  type: string | null;
  city_slug: string | null;
  spot_slug: string | null;
  src: string | null;
  v: string | null;
  target_url: string | null;
  referer: string | null;
};

const CSV_COLUMNS: (keyof ClickLogExportRow)[] = [
  "created_at",
  "type",
  "city_slug",
  "spot_slug",
  "src",
  "v",
  "target_url",
  "referer",
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const range = parseRange(url.searchParams.get("range"));
  const since = getRangeSince(range);

  const rows = await fetchClickLogsForExport(since);
  const csv = buildCsv(rows);
  const filename = buildFilename(range);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

function parseRange(value: string | null): RangeKey {
  if (value === "24h" || value === "7d" || value === "30d" || value === "all") {
    return value;
  }

  return "7d";
}

function getRangeSince(range: RangeKey): string | undefined {
  const ms = RANGE_MS[range];

  if (!ms) return undefined;

  return new Date(Date.now() - ms).toISOString();
}

async function fetchClickLogsForExport(since: string | undefined) {
  const rows: ClickLogExportRow[] = [];

  for (let start = 0; start < MAX_ROWS; start += PAGE_SIZE) {
    const end = start + PAGE_SIZE - 1;
    let query = supabaseAdmin
      .from("click_logs")
      .select("created_at, type, city_slug, spot_slug, src, v, target_url, referer")
      .order("created_at", { ascending: false });

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data, error } = await query.range(start, end);

    if (error || !data) break;

    rows.push(...(data as ClickLogExportRow[]));

    if (data.length < PAGE_SIZE) break;
  }

  return rows;
}

function buildCsv(rows: ClickLogExportRow[]) {
  const header = CSV_COLUMNS.join(",");
  const lines = rows.map((row) =>
    CSV_COLUMNS.map((column) => escapeCsvField(row[column])).join(",")
  );

  return [header, ...lines].join("\r\n");
}

function escapeCsvField(value: string | null | undefined) {
  let text = value == null ? "" : String(value);

  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

function buildFilename(range: RangeKey) {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}`;

  return `click-logs-${range}-${datePart}-${timePart}.csv`;
}
