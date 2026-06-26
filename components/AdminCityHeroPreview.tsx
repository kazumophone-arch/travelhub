"use client";

import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import canvasStyles from "./AdminCityHeroPreview.module.css";
import {
  getCssImagePosition,
  getImageBackground,
  type ImagePosition,
} from "@/lib/url-fields";

const DESIGN_WIDTH = 1120;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type CtaPreview = {
  label: string;
  href: string;
  isVisible: boolean;
};

type Props = {
  title: string;
  country: string;
  imageUrl: string;
  imagePosition?: ImagePosition;
  isPublished: boolean;
  publicPath: string;
  ctas?: CtaPreview[];
};

type PreviewSpot = {
  title: string;
};

const previewSpots: PreviewSpot[] = [
  { title: "Featured landmark" },
  { title: "Cultural district" },
];

function useScaledPreview() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const viewport = viewportRef.current;
    const page = pageRef.current;

    if (!viewport || !page) return;

    function update() {
      if (!viewport || !page) return;

      const containerWidth = viewport.clientWidth;
      const nextScale = containerWidth > 0 ? containerWidth / DESIGN_WIDTH : 1;

      setScale(nextScale);
      setScaledHeight(page.scrollHeight * nextScale);
    }

    update();

    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    observer.observe(page);

    return () => observer.disconnect();
  }, []);

  return { viewportRef, pageRef, scale, scaledHeight };
}

export function AdminCityHeroPreview({
  title,
  country,
  imageUrl,
  imagePosition,
  isPublished,
  publicPath,
  ctas = [],
}: Props) {
  const { viewportRef, pageRef, scale, scaledHeight } = useScaledPreview();
  const safePublicPath = publicPath || "";
  const visibleCtas = ctas.filter((cta) => cta.isVisible);
  const cityLabel = title || "this city";

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

      <div
        ref={viewportRef}
        className={canvasStyles.previewViewport}
        style={{ height: scaledHeight || undefined }}
      >
        <div
          ref={pageRef}
          className={canvasStyles.previewPage}
          style={{ transform: `scale(${scale})` }}
        >
          <div
            className={canvasStyles.hero}
            style={{
              backgroundImage: getImageBackground(
                imageUrl,
                "linear-gradient(180deg, rgba(13, 43, 82, 0) 32%, rgba(13, 43, 82, 0.82) 100%)",
                "linear-gradient(135deg, #26352f 0%, #b68b5e 52%, #f3e3cb 100%)"
              ),
              backgroundPosition: getCssImagePosition(imagePosition),
            }}
          >
            <div className={canvasStyles.heroCopy}>
              <div className={canvasStyles.eyebrow}>🎬 Featured in our videos</div>
              <h1 className={canvasStyles.heroTitle}>{title || "都市名未入力"}</h1>
              <p className={canvasStyles.heroCountry}>{country || "国未入力"}</p>
            </div>
          </div>

          {ctas.length > 0 ? (
            <div className={canvasStyles.ctaRow}>
              {ctas.map((cta) => (
                <a
                  key={cta.label}
                  href={cta.href}
                  className={
                    cta.isVisible ? canvasStyles.ctaPill : canvasStyles.ctaPillMuted
                  }
                >
                  {cta.label}
                  {cta.isVisible ? null : " (暫定リンクで表示)"}
                </a>
              ))}
            </div>
          ) : null}

          <div className={canvasStyles.body}>
            <section className={canvasStyles.tierSection}>
              <div className={canvasStyles.sectionIntro}>
                <div>
                  <div className={canvasStyles.label}>Explore next</div>
                  <h2 className={canvasStyles.sectionTitle}>
                    Popular spots in {cityLabel}
                  </h2>
                </div>

                <p className={canvasStyles.sectionLead}>
                  Start with the places visitors usually want to understand first.
                </p>
              </div>

              <div className={canvasStyles.spotGrid}>
                {previewSpots.map((spot) => (
                  <div key={spot.title} className={canvasStyles.spotTile}>
                    <div className={canvasStyles.spotCityBadge}>{cityLabel}</div>
                    <div className={canvasStyles.spotPanel}>
                      <h3 className={canvasStyles.spotTitle}>{spot.title}</h3>
                      <p className={canvasStyles.spotText}>No summary yet.</p>
                      <div className={canvasStyles.spotAction}>Open spot guide →</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
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
