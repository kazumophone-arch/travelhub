import Link from "next/link";
import type { CSSProperties } from "react";

export function AdminNavigation() {
  return (
    <nav style={navStyle} aria-label="管理メニュー">
      <Link href="/admin" style={linkStyle}>
        ダッシュボード
      </Link>
      <Link href="/admin/countries" style={linkStyle}>
        国管理
      </Link>
      <Link href="/admin/cities" style={linkStyle}>
        都市管理
      </Link>
      <Link href="/admin/spots" style={linkStyle}>
        スポット管理
      </Link>
      <Link href="/admin/tags" style={linkStyle}>
        タグ管理
      </Link>
      <Link href="/admin/import" style={linkStyle}>
        AIコンテンツ取り込み
      </Link>
      <Link href="/admin/analytics" style={linkStyle}>
        クリック分析
      </Link>
      <form method="post" action="/api/admin/auth/logout" style={formStyle}>
        <button type="submit" style={logoutStyle}>
          ログアウト
        </button>
      </form>
    </nav>
  );
}

const navStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 8,
  marginBottom: 24,
};

const linkStyle: CSSProperties = {
  padding: "9px 12px",
  borderRadius: 999,
  background: "#ffffff",
  color: "#138a72",
  border: "1px solid rgba(19,138,114,.16)",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
};

const formStyle: CSSProperties = {
  margin: 0,
};

const logoutStyle: CSSProperties = {
  ...linkStyle,
  color: "#9a3d2f",
  border: "1px solid rgba(154,61,47,.18)",
  cursor: "pointer",
};
