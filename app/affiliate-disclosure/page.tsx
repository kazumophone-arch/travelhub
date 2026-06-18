import Link from "next/link";
import type { Metadata } from "next";
import styles from "./AffiliateDisclosurePage.module.css";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | TravelHub",
  description:
    "TravelHub affiliate disclosure explaining how some links may support the site at no additional cost to readers.",
};

export default function AffiliateDisclosurePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>Affiliate Disclosure</div>
          <h1>Some links may support TravelHub.</h1>
          <p>
            TravelHub may include affiliate links to hotels, tours, travel
            services, and planning tools. If a reader books or purchases through
            those links, TravelHub may earn a commission at no additional cost
            to the reader.
          </p>
          <span>Last updated: June 18, 2026</span>
        </div>

        <div
          className={styles.heroImage}
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(31, 26, 23, 0.04) 0%, rgba(31, 26, 23, 0.36) 100%), url("/assets/home/venice-preview.jpg"), url("/assets/home/rome-preview.jpg")',
          }}
        />
      </section>

      <section className={styles.content}>
        <article>
          <div className={styles.eyebrow}>What this means</div>
          <h2>Affiliate links do not change the price you pay.</h2>
          <p>
            When TravelHub links to a booking platform, tour provider, travel
            product, or other third-party service, that link may be an affiliate
            link. This means TravelHub may receive a commission if a qualifying
            booking or purchase is made through that link.
          </p>
          <p>
            The commission is paid by the partner or affiliate network. It does
            not add an extra charge to the reader.
          </p>
        </article>

        <article>
          <div className={styles.eyebrow}>Editorial approach</div>
          <h2>Recommendations should remain useful first.</h2>
          <p>
            TravelHub is designed as an editorial travel discovery site. Links
            are placed to help readers move from inspiration to useful next
            steps: choosing a city, finding a place to stay, exploring tours, or
            preparing essentials before a trip.
          </p>
          <p>
            Affiliate relationships may influence which providers are available
            to link to, but they should not turn a page into a noisy booking
            engine or replace clear travel guidance.
          </p>
        </article>

        <article>
          <div className={styles.eyebrow}>Third-party services</div>
          <h2>Bookings happen outside TravelHub.</h2>
          <p>
            TravelHub may send readers to third-party websites. Prices,
            availability, cancellation rules, fees, taxes, safety information,
            and booking conditions are controlled by those third-party services.
          </p>
          <p>
            Readers should review the details on the partner site before making
            any booking or purchase.
          </p>
        </article>

        <article>
          <div className={styles.eyebrow}>Transparency</div>
          <h2>Affiliate notices may appear across the site.</h2>
          <p>
            TravelHub may include short affiliate notices near buttons, booking
            links, hotel links, tour links, or other commercial recommendations.
            This page provides the broader explanation.
          </p>
          <p>
            For corrections, broken links, or questions about this disclosure,
            use the contact page.
          </p>
          <Link href="/contact">Contact TravelHub →</Link>
        </article>
      </section>
    </main>
  );
}
