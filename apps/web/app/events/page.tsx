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
type AnnouncementItem = {
  _id: string;
  title: string;
  description: string;
  pinned: boolean;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6661";
const resolveImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${apiBase}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`${apiBase}/api/events`).then((r) => r.json()),
      fetch(`${apiBase}/api/announcements`).then((r) => r.json())
    ])
      .then(([eventData, announcementData]) => {
        setEvents(Array.isArray(eventData) ? eventData : []);
        setAnnouncements(Array.isArray(announcementData) ? announcementData : []);
      })
      .catch(() => {
        setEvents([]);
        setAnnouncements([]);
      });
  }, []);

  return (
    <div className="section grid">
      <section className="hero">
        <h1>Events & Announcements</h1>
        <p style={{ maxWidth: 760 }}>
          Mission gatherings, prayer alerts, outreach meetings, and community transformation
          milestones.
        </p>
      </section>
      <section className="card" style={{ borderColor: "#99f6e4", background: "#f0fdfa" }}>
        <h2 style={{ marginTop: 0 }}>Announcements</h2>
        <div className="grid" style={{ gap: "0.6rem" }}>
          {announcements.map((announcement) => (
            <article
              key={announcement._id}
              style={{
                border: "1px solid #cbd5e1",
                borderRadius: 12,
                padding: "0.8rem 0.9rem",
                background: announcement.pinned ? "#d1fae5" : "#ffffff"
              }}
            >
              <p style={{ margin: 0, fontWeight: 700 }}>{announcement.title}</p>
              {announcement.description ? (
                <p className="muted" style={{ margin: "0.35rem 0 0" }}>
                  {announcement.description}
                </p>
              ) : null}
            </article>
          ))}
          {announcements.length === 0 ? (
            <p className="muted" style={{ margin: 0 }}>
              No announcements yet.
            </p>
          ) : null}
        </div>
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
