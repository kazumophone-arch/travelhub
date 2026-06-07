import Link from "next/link";
import type { CSSProperties } from "react";
import { AdminNavigation } from "@/components/AdminNavigation";

export const metadata = {
  title: "管理画面 | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

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

export default function AdminPage() {
  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <AdminNavigation />

        <div style={eyebrowStyle}>TravelHub 管理画面</div>

        <h1 style={titleStyle}>管理メニュー</h1>

        <p style={textStyle}>
          国、都市、スポット、クリック分析をここから管理できます。
        </p>

        <div style={gridStyle}>
          {adminItems.map((item) => (
            <Link key={item.href} href={item.href} style={cardStyle}>
              <span style={labelStyle}>{item.label}</span>
              <strong style={cardTitleStyle}>{item.title}</strong>
              <p style={cardTextStyle}>{item.description}</p>
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
