import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        fontFamily: "system-ui",
      }}
    >
      <section style={{ maxWidth: 720, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 12 }}>
          Travel affiliate city hub
        </div>

        <h1 style={{ fontSize: 42, lineHeight: 1.1, margin: "0 0 16px" }}>
          Find travel links by city.
        </h1>

        <p style={{ fontSize: 18, opacity: 0.75, margin: "0 0 28px" }}>
          Quick hotel and tour links for places featured in our short videos.
        </p>

        <Link
          href="/c/rome-it?src=home&v=home_rome"
          style={{
            display: "inline-block",
            padding: "14px 18px",
            borderRadius: 14,
            border: "1px solid #ddd",
            textDecoration: "none",
            color: "inherit",
            fontWeight: 600,
          }}
        >
          Explore Rome
        </Link>

        <p style={{ marginTop: 28, fontSize: 12, opacity: 0.6 }}>
          Some links may be affiliate links. Original 3D characters • AI-assisted visuals.
        </p>
      </section>
    </main>
  );
}
