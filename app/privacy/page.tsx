import Link from "next/link";
import type { Metadata } from "next";
import styles from "./PrivacyPage.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | TravelHub",
  description:
    "TravelHub privacy policy explaining how the site may handle contact information, analytics, cookies, affiliate links, and third-party services.",
};

const sections = [
  {
    label: "Information we may collect",
    title: "TravelHub is designed to collect only what is useful.",
    body: [
      "TravelHub may collect limited information when readers use the site, contact us, click affiliate links, or interact with pages. This may include page activity, referral information, browser or device information, approximate location signals, and information voluntarily provided through contact messages.",
      "If a public contact address or form is added later, messages may include the sender's email address, name, message content, and any page URL or context included by the sender.",
    ],
  },
  {
    label: "Cookies and analytics",
    title: "Cookies and analytics may help improve the site.",
    body: [
      "TravelHub may use cookies, analytics tools, server logs, or similar technologies to understand how pages are used, which destinations are viewed, and which links are clicked.",
      "These tools may help improve page quality, measure affiliate link performance, detect broken links, and understand general site usage. Where required, cookie notices or consent controls should be added before launch.",
    ],
  },
  {
    label: "Affiliate links",
    title: "Affiliate clicks may be measured.",
    body: [
      "Some links on TravelHub may lead to third-party booking platforms, tour providers, travel services, or planning tools. TravelHub may record limited click information to understand which pages and links are useful.",
      "Bookings, purchases, payments, cancellations, account creation, and customer support are handled by the third-party service, not by TravelHub.",
    ],
  },
  {
    label: "How information may be used",
    title: "Information is used to operate and improve TravelHub.",
    body: [
      "Information may be used to maintain the site, respond to inquiries, correct errors, improve guides, measure page performance, understand affiliate link activity, protect the site from misuse, and comply with legal obligations.",
      "TravelHub is not designed to sell reader personal information.",
    ],
  },
  {
    label: "Third-party services",
    title: "External services have their own policies.",
    body: [
      "TravelHub may link to external websites and services. Those third parties may collect information under their own privacy policies, cookie policies, terms, and booking conditions.",
      "Readers should review the privacy and booking terms of any third-party service before creating an account, making a booking, or completing a purchase.",
    ],
  },
  {
    label: "Retention and security",
    title: "Data should be kept only as long as needed.",
    body: [
      "TravelHub should retain information only for as long as reasonably necessary for site operation, analytics, security, legal compliance, or inquiry handling.",
      "No website can guarantee perfect security, but reasonable technical and organizational measures should be used to protect information from unauthorized access, loss, or misuse.",
    ],
  },
  {
    label: "Your choices",
    title: "Readers may control some information through their browser.",
    body: [
      "Readers can usually adjust browser settings to block or delete cookies. Some analytics, affiliate tracking, or site features may not work as expected if cookies or similar technologies are disabled.",
      "If a contact method is available, readers may use it to ask questions about privacy, corrections, or data-related requests.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>Privacy Policy</div>
          <h1>How TravelHub handles privacy and site data.</h1>
          <p>
            This page explains how TravelHub may handle contact information,
            analytics, cookies, affiliate link activity, and third-party
            services. It is written for transparency and should be reviewed
            before public launch.
          </p>
          <span>Last updated: June 18, 2026</span>
        </div>

        <div
          className={styles.heroImage}
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(31, 26, 23, 0.04) 0%, rgba(31, 26, 23, 0.38) 100%), url("/assets/home/find-peace.jpg")',
          }}
        />
      </section>

      <section className={styles.notice}>
        <div>
          <div className={styles.eyebrow}>Important note</div>
          <h2>This is a practical site policy, not legal advice.</h2>
        </div>
        <p>
          Privacy obligations can vary by country, audience, tools used,
          analytics settings, cookie behavior, affiliate networks, and contact
          methods. This policy should be checked again when those tools are
          finalized.
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
          <Link href="/terms">Terms →</Link>
          <Link href="/contact">Contact →</Link>
        </div>
      </section>
    </main>
  );
}
