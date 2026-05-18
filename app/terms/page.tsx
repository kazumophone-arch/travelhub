import type { Metadata } from "next";
import { InfoPageShell, InfoSection } from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "Terms | TravelHub",
  description:
    "Basic terms for using TravelHub destination pages and travel links.",
};

export default function TermsPage() {
  return (
    <InfoPageShell
      eyebrow="Terms"
      title="Terms"
      description="These basic terms describe how TravelHub should be used while it is being developed."
    >
      <InfoSection title="Informational use">
        <p>
          TravelHub provides destination, spot, hotel, and tour link information
          for general travel discovery. Information may change and may not always
          be complete, current, or suitable for every traveler.
        </p>
      </InfoSection>

      <InfoSection title="Bookings and external services">
        <p>
          TravelHub does not directly provide hotel stays, tours, transport, or
          travel services. Bookings are handled by third-party websites, and
          their terms apply.
        </p>
      </InfoSection>

      <InfoSection title="No travel guarantee">
        <p>
          Travel conditions, prices, availability, opening hours, weather, safety
          conditions, and entry rules can change. Always confirm important
          details with official or booking-provider sources before traveling.
        </p>
      </InfoSection>

      <InfoSection title="Changes to the site">
        <p>
          TravelHub may update, remove, or reorganize pages, links, features, and
          content as the service develops.
        </p>
      </InfoSection>
    </InfoPageShell>
  );
}
