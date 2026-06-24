import Link from "next/link";
import type { CSSProperties } from "react";
import { AdminNavigation } from "@/components/AdminNavigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "管理画面 | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

function hasText(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

async function getUnmonetizedSpotCount(): Promise<number | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("spots")
      .select("affiliate_hotel_url, affiliate_tour_url");

    if (error || !data) return null;

    return data.filter(
      (spot) => !hasText(spot.affiliate_hotel_url) && !hasText(spot.affiliate_tour_url)
    ).length;
  } catch {
    return null;
  }
}

async function getCitiesMissingAffiliateCount(): Promise<number | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("cities")
      .select("affiliate_hotel_url, affiliate_tour_url");

    if (error || !data) return null;

    return data.filter(
      (city) => !hasText(city.affiliate_hotel_url) && !hasText(city.affiliate_tour_url)
    ).length;
  } catch {
    return null;
  }
}

async function getPublishedCount(table: "cities" | "spots"): Promise<number | null> {
  try {
    const { count, error } = await supabaseAdmin
      .from(table)
      .select("id", { count: "exact", head: true })
      .eq("is_published", true);

    if (error) return null;

    return count ?? null;
  } catch {
    return null;
  }
}

async function getClickCountSince(since: string): Promise<number | null> {
  try {
    const { count, error } = await supabaseAdmin
      .from("click_logs")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since);

    if (error) return null;

    return count ?? null;
  } catch {
    return null;
  }
}

function formatStatNumber(value: number) {
  return new Intl.NumberFormat("ja-JP").format(value);
}

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

function getStartOfTodayJstIso(): string {
  const now = new Date();
  const jstNow = new Date(now.getTime() + JST_OFFSET_MS);
  const jstMidnightUtcMs =
    Date.UTC(jstNow.getUTCFullYear(), jstNow.getUTCMonth(), jstNow.getUTCDate()) -
    JST_OFFSET_MS;

  return new Date(jstMidnightUtcMs).toISOString();
}

const adminItems = [
  {
    title: "国管理",
    label: "コンテンツ",
    description: "都市に紐づける国データを管理します。",
    href: "/admin/countries",
  },
  {
    title: "都市管理",
    label: "コンテンツ",
    description: "Supabase に保存された都市データを管理します。",
    href: "/admin/cities",
  },
  {
    title: "スポット管理",
    label: "コンテンツ",
    description: "スポットの作成、編集、公開、削除を行います。",
    href: "/admin/spots",
  },
  {
    title: "タグ管理",
    label: "コンテンツ",
    description: "都市やスポットに使う再利用可能なタグを管理します。",
    href: "/admin/tags",
  },
  {
    title: "クリック分析",
    label: "レポート",
    description: "ホテルとツアーの外部リンククリックを確認します。",
    href: "/admin/analytics",
  },
  {
    title: "公開サイトへ",
    label: "サイト",
    description: "公開中の TravelHub サイトへ戻ります。",
    href: "/",
  },
];

export default async function AdminPage() {
  const now = new Date();
  const startOfTodayJst = getStartOfTodayJstIso();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    unmonetizedSpotCount,
    citiesMissingAffiliateCount,
    publishedCityCount,
    publishedSpotCount,
    todayClicks,
    last24HoursClicks,
    last7DaysClicks,
    last30DaysClicks,
  ] = await Promise.all([
    getUnmonetizedSpotCount(),
    getCitiesMissingAffiliateCount(),
    getPublishedCount("cities"),
    getPublishedCount("spots"),
    getClickCountSince(startOfTodayJst),
    getClickCountSince(twentyFourHoursAgo),
    getClickCountSince(sevenDaysAgo),
    getClickCountSince(thirtyDaysAgo),
  ]);

  const stats: { label: string; value: number | null }[] = [
    { label: "公開都市", value: publishedCityCount },
    { label: "公開スポット", value: publishedSpotCount },
    { label: "収益化未設定の都市", value: citiesMissingAffiliateCount },
    { label: "収益化未設定のスポット", value: unmonetizedSpotCount },
    { label: "本日のクリック", value: todayClicks },
    { label: "過去24時間のクリック", value: last24HoursClicks },
    { label: "過去7日のクリック", value: last7DaysClicks },
    { label: "過去30日のクリック", value: last30DaysClicks },
  ];

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <AdminNavigation />

        <div style={eyebrowStyle}>TravelHub 管理画面</div>

        <h1 style={titleStyle}>管理メニュー</h1>

        <p style={textStyle}>
          国、都市、スポット、クリック分析をここから管理できます。
        </p>

        <div style={statGridStyle} aria-label="運用サマリー">
          {stats.map((stat) => (
            <div key={stat.label} style={statCardStyle}>
              <span style={statLabelStyle}>{stat.label}</span>
              <strong style={stat.value === null ? statPlaceholderStyle : statValueStyle}>
                {stat.value === null ? "—" : formatStatNumber(stat.value)}
              </strong>
            </div>
          ))}
        </div>

        <div style={gridStyle}>
          {adminItems.map((item) => (
            <Link key={item.href} href={item.href} style={cardStyle}>
              <span style={labelStyle}>{item.label}</span>
              <strong style={cardTitleStyle}>{item.title}</strong>
              <p style={cardTextStyle}>{item.description}</p>
              {item.href === "/admin/spots" && unmonetizedSpotCount ? (
                <span style={warningStyle}>{unmonetizedSpotCount} 件が収益化未設定</span>
              ) : null}
              {item.href === "/admin/cities" && citiesMissingAffiliateCount ? (
                <span style={warningStyle}>{citiesMissingAffiliateCount} 件が収益化未設定</span>
              ) : null}
              <span style={openStyle}>開く →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f8faf7",
  color: "#17202a",
};

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 960,
  margin: "0 auto",
  padding: "48px 16px 72px",
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "#f7efe2",
  border: "1px solid rgba(168, 116, 50, 0.16)",
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
  margin: "0 0 28px",
  maxWidth: 640,
  fontSize: 15,
  lineHeight: 1.75,
  color: "#607080",
};

const statGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
  gap: 12,
  marginBottom: 28,
};

const statCardStyle: CSSProperties = {
  display: "grid",
  gap: 6,
  padding: 16,
  borderRadius: 18,
  background: "#fffdf8",
  border: "1px solid rgba(168, 116, 50, 0.14)",
};

const statLabelStyle: CSSProperties = {
  fontSize: 11,
  color: "#9a6a2f",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

const statValueStyle: CSSProperties = {
  fontSize: 26,
  letterSpacing: "-0.04em",
  color: "#17202a",
};

const statPlaceholderStyle: CSSProperties = {
  fontSize: 26,
  letterSpacing: "-0.04em",
  color: "#9aa3ab",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 16,
};

const cardStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  padding: 18,
  borderRadius: 24,
  background: "#fffdf8",
  border: "1px solid rgba(168, 116, 50, 0.14)",
  boxShadow: "0 8px 24px rgba(96, 76, 48, 0.07)",
  color: "inherit",
  textDecoration: "none",
};

const warningStyle: CSSProperties = {
  width: "fit-content",
  padding: "4px 9px",
  borderRadius: 999,
  background: "#fff4df",
  color: "#9a5b12",
  fontSize: 12,
  fontWeight: 850,
};

const labelStyle: CSSProperties = {
  width: "fit-content",
  padding: "6px 9px",
  borderRadius: 999,
  background: "#f7efe2",
  color: "#9a6a2f",
  fontSize: 11,
  letterSpacing: "0.11em",
  textTransform: "uppercase",
  fontWeight: 850,
};

const cardTitleStyle: CSSProperties = {
  fontSize: 22,
  letterSpacing: "-0.04em",
};

const cardTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.6,
  color: "#607080",
};

const openStyle: CSSProperties = {
  marginTop: 8,
  color: "#138a72",
  fontSize: 13,
  fontWeight: 850,
};
