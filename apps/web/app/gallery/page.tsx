"use client";

import { useEffect, useState } from "react";

type GalleryItem = { _id: string; title: string; imageUrl: string };
const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6661";
const resolveImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${apiBase}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetch(`${apiBase}/api/gallery`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="section grid">
      <section className="hero">
        <h1>Photo Gallery</h1>
        <p style={{ maxWidth: 760 }}>
          Moments from ministry, outreach, and community transformation. This page now auto-loads
          all images from `apps/web/public/images`.
        </p>
      </section>
      <section className="masonry">
        {items.map((item, index) => (
          <article className="card masonry-item" key={item._id}>
            <img
              src={resolveImageUrl(item.imageUrl)}
              alt={item.title || `NGPM gallery image ${index + 1}`}
              style={{ width: "100%", borderRadius: 12 }}
            />
            <p className="muted" style={{ marginBottom: 0 }}>
              {item.title}
            </p>
          </article>
        ))}
        {items.length === 0 && (
          <article className="card masonry-item">
            <p className="muted">
              No gallery images found yet. Add them from admin dashboard.
            </p>
          </article>
        )}
      </section>
    </div>
  );
}
