import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { isAdminPasswordConfigured } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "管理ログイン | Taleglen Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  searchParams: Promise<{
    error?: string;
    logout?: string;
    next?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const query = await searchParams;
  const nextPath = getSafeNextPath(query.next ?? "");
  const errorMessage = getErrorMessage(query.error);
  const isConfigured = isAdminPasswordConfigured();

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <div style={eyebrowStyle}>Taleglen 管理画面</div>
        <h1 style={titleStyle}>ログイン</h1>
        <p style={textStyle}>
          管理画面を表示するには、管理パスワードを入力してください。
        </p>

        {!isConfigured ? (
          <div style={errorStyle}>
            ADMIN_PASSWORD が設定されていません。開発環境では .env.local に
            ADMIN_PASSWORD を追加してください。本番環境ではログインできません。
          </div>
        ) : null}

        {query.logout ? (
          <div style={noticeStyle}>ログアウトしました。</div>
        ) : null}

        {errorMessage ? <div style={errorStyle}>{errorMessage}</div> : null}

        <form method="post" action="/api/admin/auth/login" style={formStyle}>
          <input type="hidden" name="next" value={nextPath} />

          <label style={labelStyle}>
            管理パスワード
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              style={inputStyle}
              disabled={!isConfigured}
            />
          </label>

          <button type="submit" style={buttonStyle} disabled={!isConfigured}>
            ログイン
          </button>
        </form>
      </section>
    </main>
  );
}

function getErrorMessage(error?: string) {
  if (error === "invalid-password") {
    return "パスワードが正しくありません。";
  }

  if (error === "missing-password") {
    return "ADMIN_PASSWORD が設定されていないためログインできません。";
  }

  return "";
}

function getSafeNextPath(value: string) {
  if (
    value.startsWith("/admin") &&
    !value.startsWith("/admin/login") &&
    !value.startsWith("//")
  ) {
    return value;
  }

  return "/admin";
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#f8faf7",
  color: "#17202a",
  padding: 16,
};

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 460,
  padding: 24,
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
  boxShadow: "0 18px 50px rgba(30,64,88,.08)",
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
  fontWeight: 850,
};

const titleStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: 40,
  letterSpacing: "-0.055em",
};

const textStyle: CSSProperties = {
  margin: "0 0 18px",
  color: "#607080",
  fontSize: 14,
  lineHeight: 1.7,
};

const formStyle: CSSProperties = {
  display: "grid",
  gap: 14,
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 7,
  color: "#607080",
  fontSize: 12,
  fontWeight: 850,
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 13px",
  borderRadius: 16,
  border: "1px solid rgba(23,32,42,.08)",
  background: "#f8faf7",
  color: "#17202a",
  fontSize: 14,
};

const buttonStyle: CSSProperties = {
  padding: "11px 14px",
  borderRadius: 999,
  border: 0,
  background: "#138a72",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
};

const noticeStyle: CSSProperties = {
  marginBottom: 14,
  padding: 12,
  borderRadius: 16,
  background: "#edf8f5",
  color: "#138a72",
  fontSize: 13,
  fontWeight: 750,
};

const errorStyle: CSSProperties = {
  ...noticeStyle,
  background: "#fff4f0",
  color: "#9a3d2f",
};
