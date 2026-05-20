"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },  { href: "/cities", label: "Cities" },
  { href: "/spots", label: "Spots" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";

  if (href === "/cities") {
    return pathname === "/cities" || /^\/c\/[^/]+$/.test(pathname);
  }

  if (href === "/spots") {
    return pathname === "/spots" || pathname.includes("/spot/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="travelhub-desktop-sidebar" aria-label="Main navigation">
        <Link href="/" className="travelhub-desktop-brand">
          <span className="travelhub-brand-mark">⌖</span>
          <span>TravelHub</span>
        </Link>

        <div className="travelhub-desktop-link-list">
          {navLinks.map((link) => {
            const isActive = isActivePath(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "travelhub-desktop-link travelhub-desktop-link-active"
                    : "travelhub-desktop-link"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="travelhub-desktop-note">
          Find destinations by mood, season, city, or featured spot.
        </div>
      </nav>

      <header className="travelhub-mobile-header">
        <Link href="/" className="travelhub-mobile-brand">
          <span className="travelhub-brand-mark">⌖</span>
          <span>TravelHub</span>
        </Link>

        <button
          type="button"
          className="travelhub-explore-button"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
        >
          <span className="travelhub-explore-text">Explore</span>
          <span className="travelhub-menu-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </header>

      {isOpen && (
        <div className="travelhub-mobile-menu-wrap">
          <button
            type="button"
            className="travelhub-mobile-menu-backdrop"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
          />

          <nav className="travelhub-mobile-menu" aria-label="Mobile navigation">
            <div className="travelhub-mobile-menu-top">
              <div>
                <div className="travelhub-mobile-menu-label">Explore</div>
                <div className="travelhub-mobile-menu-title">TravelHub</div>
              </div>

              <button
                type="button"
                className="travelhub-close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation menu"
              >
                ×
              </button>
            </div>

            <div className="travelhub-mobile-link-list">
              {navLinks.map((link) => {
                const isActive = isActivePath(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={
                      isActive
                        ? "travelhub-mobile-link travelhub-mobile-link-active"
                        : "travelhub-mobile-link"
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <p className="travelhub-mobile-note">
              Discover cities, featured spots, seasonal timing, and travel links.
            </p>
          </nav>
        </div>
      )}
    </>
  );
}


