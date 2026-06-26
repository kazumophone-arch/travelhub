"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import canvasStyles from "./AdminPreviewCanvas.module.css";

const DESIGN_WIDTH = 1120;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Props = {
  children: ReactNode;
};

export function AdminPreviewCanvas({ children }: Props) {
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
  }, [children]);

  return (
    <div
      ref={viewportRef}
      className={canvasStyles.previewViewport}
      style={{ height: scaledHeight || undefined }}
    >
      <div
        ref={pageRef}
        className={canvasStyles.previewPage}
        style={pageStyle(scale)}
      >
        {children}
      </div>
    </div>
  );
}

function pageStyle(scale: number): CSSProperties {
  return {
    width: DESIGN_WIDTH,
    transform: `scale(${scale})`,
  };
}
