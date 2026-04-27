import "./globals.css";
import AnnouncementTicker from "../components/AnnouncementTicker";
import SiteHeader from "../components/SiteHeader";

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
        <SiteHeader />
        <AnnouncementTicker />
        <main className="container">{children}</main>
        <footer className="section" style={{ background: "#0f172a", marginTop: "2rem" }}>
          <section className="container grid grid-2" style={{ color: "#e2e8f0" }}>
            <div>
              <h3 style={{ color: "#f8fafc" }}>NGPM & SMPM Headquarters</h3>
              <p className="muted" style={{ color: "#cbd5e1" }}>
                2, MGR Street, Padhuvancheri, Chennai - 600126 | +91 9444737550 / 8056827550 /
                9043867550
              </p>
              <p className="muted" style={{ color: "#cbd5e1" }}>
                Email: office@smpm.co.in | koilraj@smpm.co.in
              </p>
            </div>
            <div>
              <h3 style={{ color: "#f8fafc" }}>Donation Accounts</h3>
              <p className="muted" style={{ color: "#cbd5e1" }}>
                Nehemiah New Generation Partakers Movement Trust - SBI A/C 42178020691 (SBIN0061767)
              </p>
              <p className="muted" style={{ color: "#cbd5e1" }}>
                Salvation Mission Partaker Movement - Canara A/C 120034549490 (CNR0005652)
              </p>
              <p style={{ color: "#f8fafc", fontWeight: 700 }}>
                Pray, plan, and participate in Mission India.
              </p>
              <p className="muted" style={{ color: "#cbd5e1", marginTop: 0 }}>
                For abroad sponsers and 80G exception, please contact the General Secretary at
                9043867550
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
