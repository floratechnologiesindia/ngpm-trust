import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "NGPM Trust | Transformation of India",
  description:
    "Nehemiah New Generation Partakers Movement Trust and Salvation Mission Partakers Movement.",
  keywords: ["NGPM", "SMPM", "Mission India", "Gospel", "Charity"]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: "rgba(247, 248, 251, 0.9)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid #e2e8f0"
          }}
        >
          <nav className="container nav-shell">
            <Link
              className="nav-logo-badge"
              href="/"
            >
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
              <span className="nav-brand-line">
                Nehemiah New Generation Partakers Movement Trust, NGPM
              </span>
              <span className="nav-brand-line nav-brand-line-secondary">
                Salvation Mission Partaker Movement SMPM
              </span>
            </Link>

            <details className="mobile-menu">
              <summary>Menu</summary>
              <div className="mobile-menu-links">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/office-bearers">Office Bearers</Link>
                <Link href="/events">Events</Link>
                <Link href="/sermons">Sermons</Link>
                <Link href="/magazines">Magazines</Link>
                <Link href="/gallery">Gallery</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </details>

            <div className="desktop-menu-links">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/office-bearers">Office Bearers</Link>
              <Link href="/events">Events</Link>
              <Link href="/sermons">Sermons</Link>
              <Link href="/magazines">Magazines</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="section" style={{ background: "#0f172a", marginTop: "2rem" }}>
          <section className="container grid grid-2" style={{ color: "#e2e8f0" }}>
            <div>
              <h3 style={{ color: "#f8fafc" }}>NGPM & SMPM Headquarters</h3>
              <p className="muted" style={{ color: "#cbd5e1" }}>
                2, MGR Street, Padhuvancheri, Chennai - 600126 | +91 9444737550 / 8056827550
              </p>
              <p className="muted" style={{ color: "#cbd5e1" }}>
                Email: office@smpm.co.in | koilraj@smpm.co.in
              </p>
            </div>
            <div>
              <h3 style={{ color: "#f8fafc" }}>Donation Accounts</h3>
              <p className="muted" style={{ color: "#cbd5e1" }}>
                SBI A/C 42178020691 (SBIN0061767)
              </p>
              <p className="muted" style={{ color: "#cbd5e1" }}>
                Canara A/C 120034549490 (CNR0005652)
              </p>
              <p style={{ color: "#f8fafc", fontWeight: 700 }}>
                Pray, plan, and participate in Mission India.
              </p>
            </div>
          </section>
          <section className="container" style={{ color: "#94a3b8", paddingBottom: "1.5rem" }}>
            <small>Copyright {new Date().getFullYear()} NGPM Trust. All rights reserved.</small>
          </section>
        </footer>
      </body>
    </html>
  );
}
