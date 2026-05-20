import type { Metadata } from "next";
import { InfoPageShell, InfoSection } from "@/components/InfoPageShell";

export const metadata: Metadata = {
  title: "Contact | TravelHub",
  description: "Contact information for TravelHub.",
};

export default function ContactPage() {
  return (
    <InfoPageShell
      eyebrow="Contact"
      title="Contact"
      description="For questions, corrections, partnership inquiries, or feedback, contact TravelHub through the social profile or channel where you found the site."
    >
      <InfoSection title="Corrections">
        <p>
          If you find outdated destination information, broken links, or a page
          that should be improved, send the relevant city or spot URL along with
          the correction.
        </p>
      </InfoSection>

      <InfoSection title="Partnerships">
        <p>
          TravelHub may later support partnerships with travel-related services,
          local businesses, hotels, tour operators, and destination brands.
        </p>
      </InfoSection>

      <InfoSection title="Current status">
        <p>
          A dedicated contact form may be added later. For now, use the social
          account or platform that linked you to TravelHub.
        </p>
      </InfoSection>
    </InfoPageShell>
  );
}


