import { ImageResponse } from "next/og";

export const alt = "Taleglen - Find travel links by city";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

function Spark({
  left,
  top,
  size,
}: {
  left: number;
  top: number;
  size: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: size * 0.32,
          height: size,
          borderRadius: size,
          background: "#F2B84B",
          transform: "rotate(45deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: size * 0.32,
          height: size,
          borderRadius: size,
          background: "#F2B84B",
          transform: "rotate(-45deg)",
        }}
      />
    </div>
  );
}

function Dot({
  left,
  top,
  size,
  opacity = 0.3,
}: {
  left: number;
  top: number;
  size: number;
  opacity?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        borderRadius: 999,
        background: `rgba(23, 23, 23, ${opacity})`,
      }}
    />
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #F8E1B8 0%, #F7F0E4 48%, #B9D8EA 100%)",
          color: "#171717",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 14% 12%, rgba(255,255,255,0.54), transparent 28%), radial-gradient(circle at 86% 20%, rgba(255,255,255,0.46), transparent 26%), radial-gradient(circle at 74% 84%, rgba(255,255,255,0.38), transparent 30%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 72,
            top: 72,
            width: 486,
            height: 486,
            borderRadius: 108,
            background: "rgba(255, 255, 255, 0.36)",
            border: "2px solid rgba(255, 255, 255, 0.56)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 292,
              height: 292,
              borderRadius: 999,
              border: "16px solid rgba(23, 23, 23, 0.16)",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: 72,
              height: 252,
              background: "#171717",
              transform: "rotate(24deg)",
              borderRadius: 999,
            }}
          />

          <div
            style={{
              position: "absolute",
              width: 38,
              height: 132,
              background: "#F7F0E4",
              transform: "rotate(24deg)",
              borderRadius: 999,
              opacity: 0.88,
            }}
          />

          <div
            style={{
              position: "absolute",
              width: 34,
              height: 34,
              borderRadius: 999,
              background: "#171717",
            }}
          />

          <Dot left={104} top={112} size={14} opacity={0.34} />
          <Dot left={368} top={96} size={12} opacity={0.32} />
          <Dot left={392} top={350} size={16} opacity={0.26} />
          <Dot left={96} top={354} size={10} opacity={0.28} />

          <Spark left={366} top={58} size={64} />
          <Spark left={62} top={286} size={42} />
          <Spark left={388} top={284} size={34} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 620,
            top: 104,
            right: 82,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              marginBottom: 26,
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              opacity: 0.72,
            }}
          >
            Taleglen
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 76,
              lineHeight: 0.96,
              letterSpacing: "-0.07em",
              fontWeight: 900,
              marginBottom: 28,
            }}
          >
            Find your next destination.
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 28,
              lineHeight: 1.35,
              opacity: 0.72,
              maxWidth: 470,
            }}
          >
            Discover cities, featured spots, hotel links, and tour links from
            short travel videos.
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 34,
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "12px 18px",
                borderRadius: 999,
                background: "#171717",
                color: "#ffffff",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              Cities
            </div>

            <div
              style={{
                display: "flex",
                padding: "12px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.64)",
                color: "#171717",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              Spots
            </div>

            <div
              style={{
                display: "flex",
                padding: "12px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.64)",
                color: "#171717",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              Links
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

