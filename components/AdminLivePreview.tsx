import Link from "next/link";
import type { CSSProperties } from "react";
import { getImageBackground, getOptionalHttpUrl } from "@/lib/url-fields";

type CtaPreview = {
  label: string;
  href: string;
  isVisible: boolean;
};

type Props = {
  label: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  isPublished: boolean;
  publicPath: string;
  ctas?: CtaPreview[];
};

export function AdminLivePreview({
  label,
  title,
  subtitle,
  description,
  imageUrl,
  isPublished,
  publicPath,
  ctas = [],
}: Props) {
  const safePublicPath = publicPath || "";
  const visibleCtas = ctas.filter((cta) => cta.isVisible);

  return (
    <section style={previewStyle}>
      <div style={previewLabelStyle}>{label}</div>

      <div style={linkRowStyle}>
        <code style={codeStyle}>{safePublicPath || "公開URLは未設定です"}</code>
        {safePublicPath ? (
          <Link
            href={safePublicPath}
            target="_blank"
            rel="noreferrer"
            style={smallButtonStyle}
          >
            公開ページを開く
          </Link>
        ) : null}
      </div>

      <div
        style={{
          ...cardStyle,
          backgroundImage: getImageBackground(
            imageUrl,
            "linear-gradient(180deg, rgba(10,18,24,.05), rgba(10,18,24,.76))",
            "linear-gradient(135deg, #dfeeea, #f7efe2)"
          ),
        }}
      >
        <div style={badgeStyle}>{isPublished ? "公開" : "下書き"}</div>

        <div style={panelStyle}>
          <div style={metaStyle}>{subtitle || "TravelHub"}</div>
          <h2 style={cardTitleStyle}>{title || "タイトル未入力"}</h2>
          <p style={cardTextStyle}>
            {description || "説明文や概要がここに表示されます。"}
          </p>

          {visibleCtas.length > 0 ? (
            <div style={ctaRowStyle}>
              {visibleCtas.map((cta) => (
                <Link key={cta.label} href={cta.href} style={ctaStyle}>
                  {cta.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function hasPreviewUrl(value: string) {
  return Boolean(getOptionalHttpUrl(value));
}

const previewStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const previewLabelStyle: CSSProperties = {
  fontSize: 12,
  color: "#9a6a2f",
  fontWeight: 850,
  letterSpacing: ".12em",
};

const linkRowStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  flexWrap: "wrap",
};

const codeStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 14,
  background: "#ffffff",
  color: "#607080",
  fontSize: 12,
  overflowWrap: "anywhere",
};

const smallButtonStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 999,
  background: "#138a72",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 850,
};

const cardStyle: CSSProperties = {
  minHeight: 430,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 26,
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#ffffff",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,.84)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
};

const panelStyle: CSSProperties = {
  margin: 12,
  padding: 16,
  borderRadius: 20,
  background: "rgba(12,22,30,.54)",
  border: "1px solid rgba(255,255,255,.24)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const metaStyle: CSSProperties = {
  marginBottom: 7,
  fontSize: 12,
  color: "rgba(255,255,255,.76)",
  fontWeight: 850,
  letterSpacing: ".1em",
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 28,
  lineHeight: 1.04,
  letterSpacing: "-.045em",
};

const cardTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "rgba(255,255,255,.84)",
};

const ctaRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 14,
};

const ctaStyle: CSSProperties = {
  padding: "9px 11px",
  borderRadius: 999,
  background: "#ffffff",
  color: "#17202a",
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 850,
};
