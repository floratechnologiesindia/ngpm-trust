"use client";

import { useEffect, useMemo, useState } from "react";

type Announcement = {
  _id: string;
  title: string;
  pinned: boolean;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6661";

export default function AnnouncementTicker() {
  const [items, setItems] = useState<Announcement[]>([]);

  useEffect(() => {
    fetch(`${apiBase}/api/announcements`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data.filter((x) => x?.pinned) : []))
      .catch(() => setItems([]));
  }, []);

  const text = useMemo(() => items.map((x) => x.title).join("          ✦          "), [items]);
  if (!text) return null;

  return (
    <section className="announcement-ticker" aria-label="Pinned announcements">
      <div className="container announcement-ticker-inner">
        <div className="announcement-ticker-marquee">
          <div className="announcement-ticker-track-wrap">
            <p className="announcement-ticker-track">{text}</p>
            <p className="announcement-ticker-track" aria-hidden>
              {text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
