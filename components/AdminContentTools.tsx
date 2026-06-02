"use client";

import type { CSSProperties, ReactNode } from "react";
import { getOptionalHttpUrl } from "@/lib/url-fields";

type GuidanceKind = "city" | "spot";

const guidanceItems: Record<GuidanceKind, string[]> = {
  city: [
    "都市名と国は公開ページの見出しに使われます。",
    "スラッグは英小文字・数字・ハイフンのみ。例: new-york-city",
    "概要は短く、説明文は英語の1文から始めると量産しやすいです。",
    "画像URLと画像出典URLは https の実URLを入れて、リンクテストで確認します。",
    "公開前は下書きのままプレビューと公開URLを確認します。",
  ],
  spot: [
    "スポット名と都市を選ぶと、公開URLとプレビューの文脈が決まります。",
    "スラッグはスポット名から生成し、同じ都市内で重複しないようにします。",
    "説明文は英語の1文で、ホテル・ツアーリンクの用途が伝わると便利です。",
    "画像URL、画像出典URL、アフィリエイトURLはリンクテストで確認します。",
    "ホテルURLやツアーURLを入れると、プレビューにCTA表示予定が出ます。",
  ],
};

export function AdminContentGuidance({ kind }: { kind: GuidanceKind }) {
  return (
    <aside style={guidanceStyle}>
      <div style={guidanceTitleStyle}>
        {kind === "city" ? "都市入力テンプレート" : "スポット入力テンプレート"}
      </div>
      <ul style={guidanceListStyle}>
        {guidanceItems[kind].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}

export function AdminFieldHint({ children }: { children: ReactNode }) {
  return <p style={hintStyle}>{children}</p>;
}

export function AdminUrlTestLink({ url }: { url: string }) {
  const safeUrl = getOptionalHttpUrl(url);

  if (!safeUrl) {
    return null;
  }

  return (
    <a href={safeUrl} target="_blank" rel="noreferrer" style={testLinkStyle}>
      リンクを開く
    </a>
  );
}

export function AdminInlineButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} style={inlineButtonStyle}>
      {children}
    </button>
  );
}

export function buildCityDescription(city: string, country: string) {
  const place = [city.trim(), country.trim()].filter(Boolean).join(", ");

  return `Explore travel links, featured spots, hotels, and tours for ${
    place || "this city"
  }.`;
}

export function buildSpotDescription(
  spotName: string,
  city: string,
  country: string
) {
  const place = [city.trim(), country.trim()].filter(Boolean).join(", ");

  return `Explore ${spotName.trim() || "this spot"} in ${
    place || "this city"
  } with useful hotel and tour links for planning your trip.`;
}

const guidanceStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  marginBottom: 16,
  padding: 14,
  borderRadius: 20,
  background: "#fffdf8",
  border: "1px solid rgba(168,116,50,.14)",
  color: "#607080",
};

const guidanceTitleStyle: CSSProperties = {
  color: "#9a6a2f",
  fontSize: 12,
  fontWeight: 850,
  letterSpacing: ".1em",
};

const guidanceListStyle: CSSProperties = {
  display: "grid",
  gap: 6,
  margin: 0,
  paddingLeft: 18,
  fontSize: 13,
  lineHeight: 1.55,
};

const hintStyle: CSSProperties = {
  margin: "-4px 0 12px",
  color: "#7a8795",
  fontSize: 12,
  lineHeight: 1.55,
  letterSpacing: 0,
  textTransform: "none",
  fontWeight: 650,
};

const testLinkStyle: CSSProperties = {
  width: "fit-content",
  marginTop: -6,
  marginBottom: 12,
  padding: "7px 10px",
  borderRadius: 999,
  background: "#ffffff",
  color: "#138a72",
  border: "1px solid rgba(19,138,114,.16)",
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 850,
};

const inlineButtonStyle: CSSProperties = {
  width: "fit-content",
  padding: "8px 10px",
  borderRadius: 999,
  border: "1px solid rgba(19,138,114,.16)",
  background: "#ffffff",
  color: "#138a72",
  fontSize: 12,
  fontWeight: 850,
  cursor: "pointer",
};
