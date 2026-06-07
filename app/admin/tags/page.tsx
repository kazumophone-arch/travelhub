import Link from "next/link";
import type { CSSProperties } from "react";
import { AdminNavigation } from "@/components/AdminNavigation";
import { AdminTagManager } from "@/components/AdminTagManager";

export const metadata = {
  title: "タグ管理 | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminTagsPage() {
  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <AdminNavigation />

        <Link href="/admin" style={backStyle}>← 管理メニューへ戻る</Link>

        <div style={eyebrowStyle}>タグ管理</div>

        <h1 style={titleStyle}>タグを管理</h1>

        <p style={textStyle}>
          都市とスポットに割り当てるための再利用可能なタグを作成、編集、アーカイブします。
        </p>

        <AdminTagManager />
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
  letterSpacing: 0,
  textTransform: "uppercase",
  fontWeight: 850,
};

const titleStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: "clamp(38px, 8vw, 64px)",
  lineHeight: 1.02,
  letterSpacing: 0,
  fontWeight: 850,
};

const textStyle: CSSProperties = {
  margin: "0 0 20px",
  maxWidth: 640,
  fontSize: 15,
  lineHeight: 1.75,
  color: "#607080",
};
