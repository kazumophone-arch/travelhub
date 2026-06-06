"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

const STORAGE_KEY = "travelhub-hide-temp-admin-tab";

export function TemporaryAdminTab() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHidden(window.localStorage.getItem(STORAGE_KEY) === "1");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function hideTab() {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setHidden(true);
  }

  function showTabAgain() {
    window.localStorage.removeItem(STORAGE_KEY);
    setHidden(false);
  }

  if (hidden) {
    return (
      <button type="button" onClick={showTabAgain} style={restoreStyle}>
        Admin
      </button>
    );
  }

  return (
    <div style={wrapStyle}>
      <Link href="/admin" style={linkStyle}>
        Admin
      </Link>

      <button type="button" onClick={hideTab} style={closeStyle} aria-label="Hide admin tab">
        ×
      </button>
    </div>
  );
}

const wrapStyle: CSSProperties = {
  position: "fixed",
  right: 14,
  bottom: 14,
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: 6,
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.88)",
  border: "1px solid rgba(23, 32, 42, 0.10)",
  boxShadow: "0 12px 30px rgba(30, 64, 88, 0.18)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

const linkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 34,
  padding: "8px 13px",
  borderRadius: 999,
  background: "#138a72",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
};

const closeStyle: CSSProperties = {
  width: 30,
  height: 30,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  background: "#ffffff",
  color: "#607080",
  fontSize: 18,
  fontWeight: 850,
  cursor: "pointer",
};

const restoreStyle: CSSProperties = {
  position: "fixed",
  right: 14,
  bottom: 14,
  zIndex: 9999,
  minHeight: 34,
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid rgba(23, 32, 42, 0.10)",
  background: "rgba(255, 255, 255, 0.86)",
  color: "#138a72",
  boxShadow: "0 12px 30px rgba(30, 64, 88, 0.16)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  fontSize: 12,
  fontWeight: 850,
  cursor: "pointer",
};
