import Link from "next/link";
import type { City } from "@/data/types";

type Primary = "hotels" | "tours";

type Props = {
  city: City;
  src?: string;
  v?: string;
  primary?: Primary;
};

export function StickyAffiliateBar({
  city,
  src = "site",
  v = "sticky",
  primary = "hotels",
}: Props) {
  const encodedCity = encodeURIComponent(city.slug);
  const encodedSrc = encodeURIComponent(src);
  const encodedV = encodeURIComponent(v);

  const links = [
    {
      key: "hotels" as const,
      href: `/out/hotels?c=${encodedCity}&src=${encodedSrc}&v=${encodedV}`,
      label: "Hotels",
      text: `Stays in ${city.city}`,
    },
    {
      key: "tours" as const,
      href: `/out/tours?c=${encodedCity}&src=${encodedSrc}&v=${encodedV}`,
      label: "Tours",
      text: `${city.city} tours`,
    },
  ];

  const orderedLinks = [
    ...links.filter((link) => link.key === primary),
    ...links.filter((link) => link.key !== primary),
  ];

  return (
    <div className="travelhub-sticky-affiliate-bar">
      {orderedLinks.map((link, index) => (
        <Link
          key={link.key}
          href={link.href}
          className={
            index === 0
              ? "travelhub-sticky-affiliate-link travelhub-sticky-affiliate-link-primary"
              : "travelhub-sticky-affiliate-link"
          }
        >
          <span className="travelhub-sticky-affiliate-label">{link.label}</span>
          <span className="travelhub-sticky-affiliate-text">{link.text}</span>
        </Link>
      ))}
    </div>
  );
}
