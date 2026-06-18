import Link from "next/link";
import type { Metadata } from "next";
import styles from "./ContactPage.module.css";

export const metadata: Metadata = {
  title: "Contact | TravelHub",
  description:
    "Contact TravelHub for partnerships, corrections, destination suggestions, and general inquiries.",
};

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

const contactTypes = [
  {
    title: "Partnerships",
    text: "For hotel, tour, travel service, or destination collaboration inquiries.",
  },
  {
    title: "Corrections",
    text: "For outdated information, broken links, image concerns, or page corrections.",
  },
  {
    title: "Suggestions",
    text: "For city, spot, seasonal idea, or guide suggestions that may improve TravelHub.",
  },
];

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>Contact</div>
          <h1>For notes, corrections, and thoughtful partnerships.</h1>
          <p>
            TravelHub is built as a calm travel discovery site. Use this page
            for partnership inquiries, corrections, destination suggestions, or
            other messages related to the site.
          </p>

          {contactEmail ? (
            <a href={`mailto:${contactEmail}`} className={styles.primaryLink}>
              Send an email →
            </a>
          ) : (
            <span className={styles.primaryLink}>
              Contact email will be added before launch
            </span>
          )}
        </div>

        <div
          className={styles.heroImage}
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(31, 26, 23, 0.04) 0%, rgba(31, 26, 23, 0.36) 100%), url("/assets/home/rome-preview.jpg")',
          }}
        />
      </section>

      <section className={styles.contactPanel}>
        <div>
          <div className={styles.eyebrow}>Email</div>
          <h2>{contactEmail ?? "Contact email coming soon"}</h2>
        </div>
        <p>
          A public contact address should be added before launch. When it is
          ready, this page will become the main route for partnerships,
          corrections, destination suggestions, and general inquiries.
        </p>
      </section>

      <section className={styles.types}>
        {contactTypes.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.notice}>
        <div>
          <div className={styles.eyebrow}>Before contacting</div>
          <h2>For affiliate and privacy information, use the legal pages.</h2>
        </div>

        <div className={styles.noticeLinks}>
          <Link href="/affiliate-disclosure">Affiliate Disclosure →</Link>
          <Link href="/privacy">Privacy Policy →</Link>
          <Link href="/terms">Terms →</Link>
        </div>
      </section>
    </main>
  );
}
