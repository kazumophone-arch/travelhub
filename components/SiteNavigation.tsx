"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const publicNavLinks = [
  { href: "/discover", label: "Discover" },
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

  if (href === "/discover") {
    return pathname === "/discover";
  }

  if (href === "/cities") {
    return pathname === "/cities" || pathname.startsWith("/c/");
  }

  if (href === "/themes") {
    return pathname === "/themes" || pathname.startsWith("/themes/");
  }

  if (href === "/guides") {
    return pathname === "/guides";
  }

  if (href === "/journal") {
    return pathname === "/journal" || pathname.startsWith("/journal/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "/";
  const isAdminRoute = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  useEffect(() => {
    const shell = document.querySelector(".travelhub-site-page-shell");

    if (!shell) return;

    shell.classList.remove("travelhub-site-shell-has-sidebar");
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return null;
  }

  const headerClassName = isHome
    ? "travelhub-public-header travelhub-public-header-home"
    : "travelhub-public-header";

  return (
    <>
      <header className={headerClassName} aria-label="Main navigation">
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

