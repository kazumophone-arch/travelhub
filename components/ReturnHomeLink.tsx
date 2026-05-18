"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

type Props = {
  label?: string;
  style?: CSSProperties;
};

export function ReturnHomeLink({ label = "← Home", style }: Props) {
  function handleClick() {
    sessionStorage.setItem("travelhubRestoreHomeScroll", "1");
  }

  return (
    <Link href="/" onClick={handleClick} style={style}>
      {label}
    </Link>
  );
}