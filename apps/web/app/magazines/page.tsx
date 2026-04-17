"use client";

import { useEffect, useState } from "react";
import { formatMagazineMonth } from "../../lib/magazineMonth";

type Magazine = {
  _id: string;
  title: string;
  description: string;
  month: string;
  thumbnailUrl: string;
  pdfUrl: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6661";

const resolveAssetUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${apiBase}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function MagazinesPage() {
  const [items, setItems] = useState<Magazine[]>([]);

  useEffect(() => {
    fetch(`${apiBase}/api/magazines`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="section grid">
      <section className="hero">
        <h1>Magazines</h1>
        <p style={{ maxWidth: 760 }}>
          Mission magazines and publications. Click a cover to open or download the PDF.
        </p>
      </section>
      <section className="grid grid-3">
        {items.map((mag) => (
          <article className="card" key={mag._id} style={{ display: "flex", flexDirection: "column" }}>
            <a
              href={resolveAssetUrl(mag.pdfUrl)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block" }}
            >
              <img
                src={resolveAssetUrl(mag.thumbnailUrl)}
                alt={mag.title}
                style={{
                  width: "100%",
                  aspectRatio: "3 / 4",
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid var(--border)"
                }}
              />
            </a>
            <p className="muted" style={{ marginBottom: "0.25rem", marginTop: "0.75rem" }}>
              {formatMagazineMonth(mag.month)}
            </p>
            <h3 style={{ margin: "0 0 0.35rem", fontSize: "1.05rem" }}>{mag.title}</h3>
            {mag.description ? <p className="muted" style={{ marginTop: 0, flex: 1 }}>{mag.description}</p> : null}
            <a className="btn secondary" href={resolveAssetUrl(mag.pdfUrl)} target="_blank" rel="noopener noreferrer" style={{ marginTop: "0.75rem", textAlign: "center" }}>
              Open PDF
            </a>
          </article>
        ))}
        {items.length === 0 ? (
          <article className="card">
            <p className="muted">No magazines yet. Add them from the admin panel.</p>
          </article>
        ) : null}
      </section>
    </div>
  );
}
