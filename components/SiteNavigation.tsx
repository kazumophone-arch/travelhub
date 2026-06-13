"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const adminNavLinks = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/cities", label: "Cities" },
  { href: "/spots", label: "Spots" },
];

const publicNavLinks = [
  { href: "/cities", label: "Destinations" },
  { href: "/themes", label: "Themes" },
  { href: "/guides", label: "Guides" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
];

const publicSearchHref = "/discover";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </svg>
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";

  if (href === "/cities") {
    return pathname === "/cities" || /^\/c\/[^/]+$/.test(pathname);
  }

  if (href === "/journal") {
    return pathname === "/journal" || pathname === "/spots" || pathname.includes("/spot/");
  }

  if (href === "/guides") {
    return pathname === "/guides" || pathname === "/discover";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "/";
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    const shell = document.querySelector(".travelhub-site-page-shell");

    if (!shell) return;

    if (isAdminRoute) {
      shell.classList.add("travelhub-site-shell-has-sidebar");
    } else {
      shell.classList.remove("travelhub-site-shell-has-sidebar");
    }
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return (
      <>
        <nav className="travelhub-desktop-sidebar" aria-label="Main navigation">
          <Link href="/" className="travelhub-desktop-brand">
            <span className="travelhub-brand-mark">⌖</span>
            <span>TravelHub</span>
          </Link>

          <div className="travelhub-desktop-link-list">
            {adminNavLinks.map((link) => {
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

        <header className="travelhub-mobile-header" aria-label="Main navigation">
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
                {adminNavLinks.map((link) => {
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

  return (
    <>
      <header className="travelhub-public-header" aria-label="Main navigation">
        <Link href="/" className="travelhub-public-brand">
          <span className="travelhub-brand-mark">⌖</span>
          <span>TravelHub</span>
        </Link>

        <nav className="travelhub-public-nav" aria-label="Public navigation">
          {publicNavLinks.map((link) => {
            const isActive = isActivePath(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "travelhub-public-nav-link travelhub-public-nav-link-active"
                    : "travelhub-public-nav-link"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="travelhub-public-actions">
          <Link href={publicSearchHref} className="travelhub-public-search-link" aria-label="Search travel">
            <span className="travelhub-public-search-icon">
              <SearchIcon />
            </span>
          </Link>

          <button
            type="button"
            className="travelhub-public-menu-button"
            onClick={() => setIsOpen((current) => !current)}
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
          >
            <span className="travelhub-explore-text">Menu</span>
            <span className="travelhub-menu-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
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
                <div className="travelhub-mobile-menu-label">Menu</div>
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
              {publicNavLinks.map((link) => {
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
              Discover destinations, themes, guides, journal stories, and about.
            </p>
          </nav>
        </div>
      )}
    </>
  );
}
