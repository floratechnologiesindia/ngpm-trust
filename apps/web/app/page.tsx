"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const highlights = [
  { value: "270", label: "Missionaries across India" },
  { value: "880", label: "Village congregations" },
  { value: "59", label: "Churches built and dedicated" },
  { value: "458", label: "Tribal children supported" },
  { value: "28", label: "Day Care Centres" }
];

export default function HomePage() {
  const slides = [
    "https://images.unsplash.com/photo-1473172707857-f9e276582ab6?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=80"
  ];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="section">
      <section className="home-hero">
        <div className="home-hero-media">
          {slides.map((src, idx) => (
            <div
              className={`home-hero-slide ${idx === activeSlide ? "active" : ""}`}
              key={src}
              aria-hidden={idx !== activeSlide}
            >
              <img src={src} alt="" />
              <div className="home-hero-overlay" />
            </div>
          ))}
          <div className="home-hero-dots">
            {slides.map((_, idx) => (
              <button
                className={idx === activeSlide ? "active" : ""}
                key={`dot-${idx}`}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setActiveSlide(idx)}
              />
            ))}
          </div>
        </div>
        <div className="home-hero-content">
          <h1>Giving hope to unreached villages and vulnerable communities</h1>
          <p className="home-hero-lead">
            Nehemiah New Generation Partakers Movement Trust (NGPM) and Salvation Mission Partaker
            Movement (SMPM) are committed to the Great Commission through Gospel outreach,
            education, church planting, and social upliftment.
          </p>
          <div className="home-hero-actions">
            <Link className="btn" href="/contact">
              Donate now
            </Link>
            <Link className="btn secondary" href="/about">
              About our mission
            </Link>
          </div>
        </div>
      </section>

      <section className="stats">
        {highlights.map((item) => (
          <article className="stat" key={item.label}>
            <strong>{item.value}</strong>
            <span className="muted">{item.label}</span>
          </article>
        ))}
      </section>

      <section className="grid grid-2 section">
        <article className="card">
          <h2>Our Mission</h2>
          <p className="muted">
            To proclaim the Gospel, disciple believers, plant churches, and bring holistic
            transformation through education, compassion, and community care in every region we
            serve.
          </p>
          <p>
            We mobilize local believers and mission partners so that no village is left without a
            Gospel witness.
          </p>
        </article>
        <article className="card">
          <h2>Our Ethos</h2>
          <p className="muted">
            Obedience to God&apos;s Word, Faith, Holiness, Sacrifice, Simple Living, and Real Fellowship.
          </p>
          <p>
            Through Mission India, we challenge every believer and church to actively participate in
            spreading the Gospel and strengthening communities.
          </p>
        </article>
        <article className="card">
          <h2>Vision 2030</h2>
          <ul>
            <li>Develop 100 mission centres.</li>
            <li>Train and appoint 100 native missionaries.</li>
            <li>Raise 10 local missionaries in each assembly.</li>
            <li>Assign 1 missionary for every 5 villages.</li>
          </ul>
        </article>
      </section>

      <section className="cta-band">
        <h2 style={{ marginTop: 0 }}>Join us and make an eternal impact</h2>
        <p style={{ marginBottom: "1rem" }}>
          Sponsor a missionary, support tribal children, and partner in church construction across India.
        </p>
        <Link className="btn secondary" href="/contact">
          Become a partner
        </Link>
      </section>
    </div>
  );
}
