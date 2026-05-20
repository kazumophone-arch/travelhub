import type { Metadata } from "next";
import { InfoPageShell, InfoSection } from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | TravelHub",
  description:
    "Affiliate disclosure for TravelHub hotel, tour, and travel-related links.",
};

export default function AffiliateDisclosurePage() {
  return (
    <InfoPageShell
      eyebrow="Affiliate disclosure"
      title="Affiliate Disclosure"
      description="Some links on TravelHub may be affiliate links. This page explains what that means."
    >
      <InfoSection title="Affiliate links">
        <p>
          Some outbound links on TravelHub may be affiliate links. If you click
          one of these links and make a booking or purchase, TravelHub may earn a
          commission at no extra cost to you.
        </p>
      </InfoSection>

      <InfoSection title="Editorial approach">
        <p>
          TravelHub aims to organize travel destinations, spots, hotel links, and
          tour links in a useful way. Affiliate relationships do not change the
          basic goal of helping users find travel options more easily.
        </p>
      </InfoSection>

      <InfoSection title="External sites">
        <p>
          When you click an outbound link, you may be taken to a third-party
          website. Prices, availability, booking terms, cancellation policies,
          and service conditions are controlled by the third-party provider.
        </p>
      </InfoSection>
    </InfoPageShell>
  );
}


