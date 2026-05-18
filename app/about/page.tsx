import type { Metadata } from "next";
import { InfoPageShell, InfoSection } from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "About | TravelHub",
  description:
    "Learn what TravelHub is and how it helps travelers find destinations, spots, hotel links, and tour links.",
};

export default function AboutPage() {
  return (
    <InfoPageShell
      eyebrow="About"
      title="About TravelHub"
      description="TravelHub is a lightweight travel discovery hub built around short-form travel videos, city pages, featured spots, and quick booking links."
    >
      <InfoSection title="What TravelHub does">
        <p>
          TravelHub helps people discover cities and travel spots through simple
          destination pages. Each city page highlights a few places, then gives
          quick access to hotel and tour links.
        </p>
      </InfoSection>

      <InfoSection title="How it is intended to be used">
        <p>
          The site is designed as a companion to short travel videos. After a
          viewer sees a city or spot in a video, they can open TravelHub to find
          related links and continue planning.
        </p>
      </InfoSection>

      <InfoSection title="Current status">
        <p>
          TravelHub is still being developed. Destination information, links,
          images, and features may be updated over time.
        </p>
      </InfoSection>
    </InfoPageShell>
  );
}
