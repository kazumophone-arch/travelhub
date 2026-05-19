"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/seasonal", label: "Seasonal" },
  { href: "/cities", label: "Cities" },
  { href: "/spots", label: "Spots" },
  { href: "/about", label: "About" },
  { href: "/affiliate-disclosure", label: "Affiliate" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
];

export function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="desktop-sidebar" aria-label="Main navigation">
        <Link href="/" className="desktop-brand">
          <span className="brand-mark">⌖</span>
          <span>TravelHub</span>
        </Link>

        <div className="desktop-link-list">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="desktop-link">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="desktop-note">
          Find cities, spots, and travel links from short videos.
        </div>
      </nav>

      <header className="mobile-header">
        <Link href="/" className="mobile-brand">
          <span className="brand-mark">⌖</span>
          <span>TravelHub</span>
        </Link>

        <button
          type="button"
          className="hamburger-button"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {isOpen && (
        <div className="mobile-menu-wrap">
          <button
            type="button"
            className="mobile-menu-backdrop"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
          />

          <nav className="mobile-menu" aria-label="Mobile navigation">
            <div className="mobile-menu-top">
              <div>
                <div className="mobile-menu-label">Menu</div>
                <div className="mobile-menu-title">TravelHub</div>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation menu"
              >
                ×
              </button>
            </div>

            <div className="mobile-link-list">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mobile-link"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <p className="mobile-note">
              Discover cities, featured spots, hotel links, and tour links.
            </p>
          </nav>
        </div>
      )}
    </>
  );
}
