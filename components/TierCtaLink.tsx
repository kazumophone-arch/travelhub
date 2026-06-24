"use client";

import type { CSSProperties, MouseEvent, ReactNode } from "react";

type AffiliateType = "hotels" | "tours";

type Props = {
  href: string;
  className?: string;
  style?: CSSProperties;
  affiliateType: AffiliateType;
  citySlug: string;
  source: string;
  children: ReactNode;
};

type PermissiveGtag = (
  command: "event",
  eventName: "affiliate_click",
  params: Record<string, unknown>
) => void;

function getGtag(): PermissiveGtag | undefined {
  if (typeof window === "undefined") return undefined;

  return (window as unknown as { gtag?: PermissiveGtag }).gtag;
}

export function TierCtaLink({
  href,
  className,
  style,
  affiliateType,
  citySlug,
  source,
  children,
}: Props) {
  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={(event) =>
        handleTierCtaClick(event, { affiliateType, citySlug, source })
      }
    >
      {children}
    </a>
  );
}

function handleTierCtaClick(
  event: MouseEvent<HTMLAnchorElement>,
  { affiliateType, citySlug, source }: { affiliateType: AffiliateType; citySlug: string; source: string }
) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const gtag = getGtag();

  if (typeof gtag !== "function") {
    return;
  }

  event.preventDefault();

  const href = event.currentTarget.href;
  let didNavigate = false;

  const navigate = () => {
    if (didNavigate) return;
    didNavigate = true;
    window.location.href = href;
  };

  gtag("event", "affiliate_click", {
    affiliate_type: affiliateType,
    city_slug: citySlug,
    source,
    variant: "tier-cta",
    value: href,
    event_callback: navigate,
    event_timeout: 300,
  });

  window.setTimeout(navigate, 350);
}
