import type { CSSProperties } from "react";

type Variant = "city" | "spot";

type Props = {
  cityName: string;
  spotName?: string;
  variant?: Variant;
};

export function BookingConfidencePanel({
  cityName,
  spotName,
  variant = "city",
}: Props) {
  const items =
    variant === "spot"
      ? [
          {
            label: "Route first",
            title: "Use the spot as an anchor",
            text: `${spotName ?? "This spot"} helps you decide which nearby places, tours, or hotel areas make sense.`,
          },
          {
            label: "Compare before booking",
            title: "Do not choose the first option blindly",
            text: "Open the travel links to compare timing, location, price, and cancellation conditions before deciding.",
          },
          {
            label: "Reduce planning effort",
            title: "Tours are useful when the route is unclear",
            text: `If you want to connect multiple places in ${cityName}, a guided route can reduce the amount of planning.`,
          },
        ]
      : [
          {
            label: "Area first",
            title: "Choose where to stay before comparing hotels",
            text: `In ${cityName}, the best hotel option depends on the route, not only the price.`,
          },
          {
            label: "Compare before booking",
            title: "Use links as a comparison step",
            text: "Check location, price, cancellation conditions, and reviews before making a final decision.",
          },
          {
            label: "Route clarity",
            title: "Tours help when the city feels too broad",
            text: `If ${cityName} feels hard to plan, tours can help connect the main sights into one route.`,
          },
        ];

  return (
    <section style={wrapStyle}>
      <div style={headerStyle}>
        <div>
          <div style={smallLabelStyle}>Before booking</div>
          <h2 style={titleStyle}>Make the next click a comparison step.</h2>
        </div>
      </div>

      <div style={gridStyle}>
        {items.map((item) => (
          <article key={item.label} style={cardStyle}>
            <div style={labelStyle}>{item.label}</div>
            <h3 style={cardTitleStyle}>{item.title}</h3>
            <p style={textStyle}>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const wrapStyle: CSSProperties = {
  marginTop: 36,
};

const headerStyle: CSSProperties = {
  marginBottom: 16,
};

const smallLabelStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  opacity: 0.5,
  marginBottom: 7,
};

const titleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 720,
  fontSize: "clamp(26px, 6vw, 36px)",
  lineHeight: 1.04,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
  gap: 14,
};

const cardStyle: CSSProperties = {
  padding: 18,
  borderRadius: 26,
  background: "rgba(255, 255, 255, 0.78)",
  border: "1px solid rgba(0, 0, 0, 0.07)",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.06)",
};

const labelStyle: CSSProperties = {
  marginBottom: 10,
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fontWeight: 850,
  opacity: 0.52,
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 22,
  lineHeight: 1.08,
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const textStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 14,
  lineHeight: 1.6,
  opacity: 0.68,
};
