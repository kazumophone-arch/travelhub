import Link from "next/link";
import type { CSSProperties } from "react";
import { AdminSpotPreview } from "@/components/AdminSpotPreview";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PreviewSpotPage({ params }: Props) {
  const { id } = await params;

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <Link href="/admin/spots" style={backStyle}>← Back to spots</Link>
        <AdminSpotPreview id={id} />
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f8faf7",
  color: "#17202a",
};

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 960,
  margin: "0 auto",
  padding: "44px 16px 64px",
};

const backStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 24,
  color: "#138a72",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 850,
};
