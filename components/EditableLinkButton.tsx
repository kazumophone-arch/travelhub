"use client";

import { useState, type CSSProperties } from "react";

type LinkField = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type Props = {
  buttonLabel?: string;
  fields: LinkField[];
  tone?: "light" | "dark";
};

export function EditableLinkButton({
  buttonLabel = "🔗 リンクを編集",
  fields,
  tone = "light",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div style={wrapStyle}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={tone === "dark" ? toggleDarkStyle : toggleStyle}
      >
        {buttonLabel}
      </button>

      {open ? (
        <div style={panelStyle}>
          {fields.map((field) => (
            <label key={field.label} style={labelStyle}>
              {field.label}
              <input
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                placeholder={field.placeholder ?? "https://..."}
                style={inputStyle}
              />
            </label>
          ))}
          <p style={hintStyle}>
            空欄にすると、そのCTAは公開ページで非表示になります（提携前は仮の検索URLでも可）。
          </p>
        </div>
      ) : null}
    </div>
  );
}

const wrapStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "start",
  marginTop: 10,
};

const toggleStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid rgba(23,32,42,.16)",
  background: "#ffffff",
  color: "#138a72",
  fontSize: 12,
  fontWeight: 850,
  cursor: "pointer",
};

const toggleDarkStyle: CSSProperties = {
  ...toggleStyle,
  border: "1px solid rgba(255,255,255,.4)",
  background: "rgba(13, 43, 82, 0.55)",
  color: "#ffffff",
};

const panelStyle: CSSProperties = {
  width: "min(360px, 100%)",
  display: "grid",
  gap: 10,
  padding: 14,
  borderRadius: 16,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.12)",
  boxShadow: "0 18px 40px rgba(13,43,82,.18)",
  color: "#17202a",
  textAlign: "left",
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 6,
  fontSize: 11,
  fontWeight: 850,
  color: "#607080",
  letterSpacing: ".06em",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "9px 10px",
  borderRadius: 12,
  border: "1px solid rgba(23,32,42,.12)",
  background: "#f8faf7",
  color: "#17202a",
  fontSize: 13,
  boxSizing: "border-box",
};

const hintStyle: CSSProperties = {
  margin: 0,
  fontSize: 11,
  lineHeight: 1.55,
  color: "#8d6139",
};
