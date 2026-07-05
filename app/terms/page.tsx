import Link from "next/link";
import type { Metadata } from "next";
import styles from "./TermsPage.module.css";

export const metadata: Metadata = {
  title: "Terms | Taleglen",
  description:
    "Taleglen terms explaining site use, external links, affiliate links, travel information, and limitations.",
};

const sections = [
  {
    label: "Use of the site",
    title: "Taleglen is an editorial travel discovery site.",
    body: [
      "Taleglen provides destination inspiration, city guides, spot guides, planning notes, travel essentials, and links to third-party services.",
      "By using the site, readers agree to use Taleglen for lawful, personal, and informational purposes only.",
    ],
  },
  {
    label: "Travel information",
    title: "Information may change.",
    body: [
      "Travel information can change quickly. Prices, opening hours, transport routes, seasonal conditions, availability, safety information, and booking rules may differ from what appears on Taleglen.",
      "Readers should confirm important details directly with official sources, booking platforms, venues, hotels, tour providers, transport operators, or local authorities before making decisions.",
    ],
  },
  {
    label: "Third-party services",
    title: "Bookings happen outside Taleglen.",
    body: [
      "Taleglen may link to third-party websites, including hotel platforms, tour providers, travel services, maps, transport providers, and other planning tools.",
      "Those third parties control their own prices, availability, cancellation rules, payment processes, customer support, privacy policies, and terms. Taleglen is not responsible for third-party services or transactions.",
    ],
  },
  {
    label: "Affiliate links",
    title: "Some links may be affiliate links.",
    body: [
      "Taleglen may earn a commission if a reader books or purchases through certain links, at no additional cost to the reader.",
      "Affiliate links help support the site, but readers should always review the details, prices, cancellation terms, and conditions on the third-party site before booking.",
    ],
  },
  {
    label: "No professional advice",
    title: "Taleglen does not replace professional advice.",
    body: [
      "Taleglen does not provide legal, medical, immigration, visa, financial, safety, or professional travel advice.",
      "Readers are responsible for checking entry requirements, visa rules, insurance needs, health guidance, safety conditions, and local regulations before traveling.",
    ],
  },
  {
    label: "Content and intellectual property",
    title: "Site content belongs to Taleglen or its sources.",
    body: [
      "Text, layouts, design elements, images, logos, and other materials on Taleglen may be protected by copyright, trademark, or other rights.",
      "Readers may use the site for personal planning, but may not copy, republish, scrape, sell, or redistribute substantial parts of the site without permission.",
    ],
  },
  {
    label: "Acceptable use",
    title: "Do not misuse the site.",
    body: [
      "Readers must not interfere with the operation of Taleglen, attempt unauthorized access, scrape the site aggressively, submit malicious content, or use the site in a way that harms the service or other users.",
      "Taleglen may block or restrict access if misuse, abuse, security risk, or unlawful activity is suspected.",
    ],
  },
  {
    label: "Changes",
    title: "These terms may be updated.",
    body: [
      "Taleglen may update these terms as the site changes, including when new features, affiliate partners, analytics tools, contact methods, or services are added.",
      "The latest version posted on this page will apply to use of the site after it is published.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>Terms</div>
          <h1>The conditions for using Taleglen.</h1>
          <p>
            These terms explain how Taleglen should be used, how external links
            work, how affiliate links may support the site, and why important
            travel decisions should be confirmed with the relevant provider or
            official source.
          </p>
          <span>Last updated: June 18, 2026</span>
        </div>

        <div
          className={styles.heroImage}
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(31, 26, 23, 0.04) 0%, rgba(31, 26, 23, 0.38) 100%), url("/assets/home/rome-preview.jpg")',
          }}
        />
      </section>

      <section className={styles.notice}>
        <div>
          <div className={styles.eyebrow}>Important note</div>
          <h2>These terms are a practical site policy, not legal advice.</h2>
        </div>
        <p>
          The final terms should be reviewed again when Taleglen&apos;s public
          contact address, affiliate partners, analytics tools, cookie behavior,
          and target regions are finalized.
        </p>
      </section>

      <section className={styles.content}>
        {sections.map((section) => (
          <article key={section.label}>
            <div>
              <div className={styles.eyebrow}>{section.label}</div>
              <h2>{section.title}</h2>
            </div>

            <div className={styles.copy}>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className={styles.related}>
        <div>
          <div className={styles.eyebrow}>Related pages</div>
          <h2>Review the connected policies.</h2>
        </div>

        <div className={styles.relatedLinks}>
          <Link href="/affiliate-disclosure">Affiliate Disclosure →</Link>
          <Link href="/privacy">Privacy Policy →</Link>
          <Link href="/contact">Contact →</Link>
        </div>
      </section>
    </main>
  );
}
