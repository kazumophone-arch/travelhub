"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  ariaLabel?: string;
  placeholder?: string;
  style?: CSSProperties;
};

const baseStyle: CSSProperties = {
  font: "inherit",
  color: "inherit",
  letterSpacing: "inherit",
  lineHeight: "inherit",
  textAlign: "inherit",
  background: "rgba(127, 127, 127, 0.08)",
  border: "1px dashed rgba(127, 127, 127, 0.55)",
  borderRadius: 8,
  padding: "2px 8px",
  margin: 0,
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  display: "block",
  outlineColor: "#138a72",
};

export function EditableText({
  value,
  onChange,
  multiline = false,
  ariaLabel,
  placeholder,
  style,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    if (!multiline) return;

    const element = textareaRef.current;
    if (!element) return;

    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [multiline, value]);

  if (multiline) {
    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        placeholder={placeholder}
        rows={1}
        style={{ ...baseStyle, resize: "none", overflow: "hidden", ...style }}
      />
    );
  }

  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={ariaLabel}
      placeholder={placeholder}
      style={{ ...baseStyle, ...style }}
    />
  );
}
