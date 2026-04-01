"use client";

import { useEffect, useState } from "react";

type EventItem = {
  _id: string;
  title: string;
  description: string;
  date: string;
  imageUrls: string[];
  imageUrl?: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6661";
const resolveImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${apiBase}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetch(`${apiBase}/api/events`)
      .then((r) => r.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]));
  }, []);

  return (
    <div className="section grid">
      <section className="hero">
        <h1>Events</h1>
        <p style={{ maxWidth: 760 }}>
          Mission gatherings, outreach meetings, and community transformation milestones.
        </p>
      </section>
      <section className="grid grid-3">
        {events.map((event) => (
          <article className="card" key={event._id}>
            <h3>{event.title}</h3>
            <p className="muted">{new Date(event.date).toLocaleDateString()}</p>
            <p className="muted">{event.description}</p>
            {(event.imageUrls?.[0] || event.imageUrl) ? (
              <img
                src={resolveImageUrl(event.imageUrls?.[0] || event.imageUrl)}
                alt={event.title}
                style={{ width: "100%", borderRadius: 12, marginTop: "0.5rem" }}
              />
            ) : null}
          </article>
        ))}
        {events.length === 0 ? (
          <article className="card">
            <p className="muted">No events yet. Admin can create events from dashboard.</p>
          </article>
        ) : null}
      </section>
    </div>
  );
}
