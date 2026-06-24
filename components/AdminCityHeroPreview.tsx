"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./SupabaseCityDetail.module.css";
import {
  getCssImagePosition,
  getImageBackground,
  type ImagePosition,
} from "@/lib/url-fields";

type CtaPreview = {
  label: string;
  href: string;
  isVisible: boolean;
};

type Props = {
  title: string;
  country: string;
  leadText: string;
  imageUrl: string;
  imagePosition?: ImagePosition;
  isPublished: boolean;
  publicPath: string;
  ctas?: CtaPreview[];
};

export function AdminCityHeroPreview({
  title,
  country,
  leadText,
  imageUrl,
  imagePosition,
  isPublished,
  publicPath,
  ctas = [],
}: Props) {
  const safePublicPath = publicPath || "";
  const visibleCtas = ctas.filter((cta) => cta.isVisible);

  return (
    <section style={wrapStyle}>
      <div style={previewLabelStyle}>都市ヒーロー プレビュー</div>

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
        <span style={isPublished ? statusOkStyle : statusDraftStyle}>
          {isPublished ? "公開" : "下書き"}
        </span>
      </div>

      {ctas.length > 0 ? (
        <div style={ctaStatusRowStyle}>
          {ctas.map((cta) => (
            <span
              key={cta.label}
              style={cta.isVisible ? ctaStatusVisibleStyle : ctaStatusHiddenStyle}
            >
              {cta.label}: {cta.isVisible ? "表示予定" : "非表示"}
            </span>
          ))}
        </div>
      ) : null}

      <div className={styles.page} style={previewFrameStyle}>
        <div
          className={styles.hero}
          style={{
            ...heroOverrideStyle,
            backgroundImage: getImageBackground(
              imageUrl,
              "linear-gradient(90deg, rgba(9, 16, 20, 0.82) 0%, rgba(9, 16, 20, 0.62) 45%, rgba(9, 16, 20, 0.18) 100%), linear-gradient(180deg, rgba(9, 16, 20, 0.08) 0%, rgba(9, 16, 20, 0.72) 100%)",
              "linear-gradient(135deg, #26352f 0%, #b68b5e 52%, #f3e3cb 100%)"
            ),
            backgroundPosition: getCssImagePosition(imagePosition),
          }}
        >
          <div className={styles.heroInner} style={heroInnerOverrideStyle}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>TravelHub city guide</div>
              <div className={styles.countryPill}>{country || "国未入力"}</div>
              <h1 className={styles.heroTitle} style={heroTitleOverrideStyle}>
                {title || "都市名未入力"}
              </h1>
              <p className={styles.heroLead}>
                {leadText || "概要や説明がここに表示されます。"}
              </p>
            </div>

            {visibleCtas.length > 0 ? (
              <div className={styles.heroCta}>
                <div className={styles.ctaKicker}>Plan this trip</div>
                <div style={ctaRowStyle}>
                  {visibleCtas.map((cta) => (
                    <a key={cta.label} href={cta.href} style={ctaPillStyle}>
                      {cta.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

const wrapStyle: CSSProperties = {
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

const statusOkStyle: CSSProperties = {
  padding: "6px 9px",
  borderRadius: 999,
  background: "#edf8f5",
  color: "#138a72",
  fontSize: 12,
  fontWeight: 850,
};

const statusDraftStyle: CSSProperties = {
  ...statusOkStyle,
  background: "#f3f5f4",
  color: "#7a8795",
};

const ctaStatusRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const ctaStatusVisibleStyle: CSSProperties = {
  padding: "6px 9px",
  borderRadius: 999,
  background: "#edf8f5",
  color: "#138a72",
  fontSize: 12,
  fontWeight: 850,
};

const ctaStatusHiddenStyle: CSSProperties = {
  ...ctaStatusVisibleStyle,
  background: "#f3f5f4",
  color: "#7a8795",
};

const previewFrameStyle: CSSProperties = {
  minHeight: "auto",
  borderRadius: 26,
  overflow: "hidden",
};

const heroOverrideStyle: CSSProperties = {
  minHeight: 430,
  padding: "40px 22px 26px",
};

const heroInnerOverrideStyle: CSSProperties = {
  gridTemplateColumns: "1fr",
};

const heroTitleOverrideStyle: CSSProperties = {
  fontSize: "clamp(32px, 6vw, 50px)",
};

const ctaRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 4,
};

const ctaPillStyle: CSSProperties = {
  padding: "9px 11px",
  borderRadius: 999,
  background: "#ffffff",
  color: "#17202a",
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 850,
};
