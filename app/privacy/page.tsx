import type { Metadata } from "next";
import { InfoPageShell, InfoSection } from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy | TravelHub",
  description:
    "Privacy information for TravelHub, including basic site usage and outbound click logging.",
};

export default function PrivacyPage() {
  return (
    <InfoPageShell
      eyebrow="Privacy"
      title="Privacy Policy"
      description="This page explains the basic types of information TravelHub may process while the site is being used."
    >
      <InfoSection title="Information from normal site usage">
        <p>
          When you use TravelHub, basic technical information may be processed by
          the hosting platform and related services. This can include pages
          visited, device or browser information, referrer information, and
          approximate request timing.
        </p>
      </InfoSection>

      <InfoSection title="Outbound click logging">
        <p>
          TravelHub uses outbound link routes to understand which city, spot,
          link type, source, or video parameter led to a click. This helps
          improve destination pages and booking-link placement.
        </p>
      </InfoSection>

      <InfoSection title="Third-party websites">
        <p>
          TravelHub links to third-party travel websites. Those websites may have
          their own privacy policies, analytics tools, cookies, and account
          systems. Review the third-party site before making a booking.
        </p>
      </InfoSection>

      <InfoSection title="Future updates">
        <p>
          This policy may be updated as TravelHub adds analytics, account
          features, image storage, a management dashboard, or other services.
        </p>
      </InfoSection>
    </InfoPageShell>
  );
}


