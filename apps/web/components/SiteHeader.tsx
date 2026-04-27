"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/other-countries-missionaries", label: "Neighbour Countries Visions" },
  { href: "/sermons", label: "Sermons" },
  { href: "/magazines", label: "Magazines" },
  { href: "/events", label: "Events & Announcements" },
  { href: "/contact", label: "Contact" }
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header">
      <section className="container nav-top-row">
        <Link className="nav-logo-badge" href="/">
          <div className="nav-logo-circle">
            <Image
              src="/images/logo.webp"
              alt="NGPM Logo"
              width={88}
              height={88}
              priority
              sizes="(max-width: 767px) 56px, 88px"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </Link>
        <Link href="/" className="nav-brand-title">
          <span className="nav-brand-line">Nehemiah New Generation Partakers Movement Trust, NGPM</span>
          <span className="nav-brand-line nav-brand-line-secondary">
            Salvation Mission Partaker Movement, SMPM
          </span>
        </Link>
        <div className="mobile-menu-wrap">
          <button
            type="button"
            className={`mobile-menu-trigger ${mobileOpen ? "open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
          {mobileOpen ? (
            <div className="mobile-menu-links">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={pathname === item.href ? "active" : ""}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <nav className="container desktop-menu-links">
        {navItems.map((item, idx) => (
          <span className="desktop-nav-item" key={item.href}>
            <Link href={item.href} className={pathname === item.href ? "active" : ""}>
              {item.label}
            </Link>
            {idx < navItems.length - 1 ? <span className="desktop-nav-sep">|</span> : null}
          </span>
        ))}
      </nav>
    </header>
  );
}
