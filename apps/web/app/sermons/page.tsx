"use client";

import { useEffect, useState } from "react";
import { youtubeEmbedSrc } from "../../lib/youtube";

type Sermon = {
  _id: string;
  title: string;
  description: string;
  youtubeUrl: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6661";

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);

  useEffect(() => {
    fetch(`${apiBase}/api/sermons`)
      .then((r) => r.json())
      .then((data) => setSermons(Array.isArray(data) ? data : []))
      .catch(() => setSermons([]));
  }, []);

  return (
    <div className="section grid">
      <section className="hero">
        <h1>Sermons</h1>
        <p style={{ maxWidth: 760 }}>
          Teaching and messages to strengthen faith and mission. Videos open from our YouTube
          channel.
        </p>
      </section>
      <section className="grid grid-2" style={{ gap: "1.25rem" }}>
        {sermons.map((sermon) => {
          const embed = youtubeEmbedSrc(sermon.youtubeUrl);
          return (
            <article className="card" key={sermon._id}>
              <h2 style={{ marginTop: 0, fontSize: "1.15rem" }}>{sermon.title}</h2>
              {sermon.description ? <p className="muted">{sermon.description}</p> : null}
              {embed ? (
                <div
                  className="video-embed"
                  style={{
                    marginTop: "0.75rem",
                    borderRadius: 12,
                    overflow: "hidden",
                    aspectRatio: "16 / 9",
                    background: "#0f172a"
                  }}
                >
                  <iframe
                    title={sermon.title}
                    src={embed}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ width: "100%", height: "100%", border: 0 }}
                  />
                </div>
              ) : (
                <p className="muted" style={{ marginTop: "0.75rem" }}>
                  Invalid or missing YouTube URL. Please contact the administrator.
                </p>
              )}
            </article>
          );
        })}
        {sermons.length === 0 ? (
          <article className="card">
            <p className="muted">No sermons yet. Add them from the admin panel.</p>
          </article>
        ) : null}
      </section>
    </div>
  );
}
