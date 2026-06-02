import Link from "next/link";
import type { CSSProperties } from "react";
import { AdminNavigation } from "@/components/AdminNavigation";
import { AdminNewSpotForm } from "@/components/AdminNewSpotForm";

export const metadata = {
  title: "新しいスポット | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewSpotPage() {
  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <AdminNavigation />
        <Link href="/admin/spots" style={backStyle}>← スポット管理へ戻る</Link>
        <div style={eyebrowStyle}>作成</div>
        <h1 style={titleStyle}>新しいスポット</h1>
        <p style={textStyle}>
          現在のデータベース項目を使って Supabase にスポットを作成します。
        </p>
        <AdminNewSpotForm />
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
  maxWidth: 1180,
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
  margin: "0 0 28px",
  maxWidth: 640,
  fontSize: 15,
  lineHeight: 1.75,
  color: "#607080",
};


