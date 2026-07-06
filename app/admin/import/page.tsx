import type { CSSProperties } from "react";
import { AdminImportDesk } from "@/components/AdminImportDesk";
import { AdminNavigation } from "@/components/AdminNavigation";

export const metadata = {
  title: "AIコンテンツ取り込み | Taleglen Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminImportPage() {
  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <AdminNavigation />

        <div style={eyebrowStyle}>AI Content Import Desk</div>
        <h1 style={titleStyle}>AIコンテンツ取り込み（プレビュー）</h1>
        <p style={textStyle}>
          Claude等のAIに作成させた Taleglen Content Packet（JSON）を貼り付けて検証します。
          このバージョンはプレビューのみで、Supabaseへの書き込みは行いません。
        </p>

        <AdminImportDesk />
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
  padding: "48px 16px 96px",
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
  fontSize: "clamp(30px, 5vw, 44px)",
  lineHeight: 1.05,
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const textStyle: CSSProperties = {
  margin: "0 0 28px",
  maxWidth: 640,
  fontSize: 15,
  lineHeight: 1.75,
  color: "#607080",
};
