import Link from "next/link";

const highlights = [
  { value: "270", label: "Missionaries across India" },
  { value: "880", label: "Village congregations" },
  { value: "59", label: "Churches built" },
  { value: "58", label: "Tribal children supported" }
];

export default function HomePage() {
  return (
    <div className="section">
      <section className="hero">
        <h1>Giving hope to unreached villages and vulnerable communities</h1>
        <p style={{ maxWidth: 700, opacity: 0.95 }}>
          Nehemiah New Generation Partakers Movement Trust (NGPM) and SMPM are committed to the
          Great Commission through Gospel outreach, education, church planting, and social upliftment.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
          <Link className="btn" href="/contact">
            Donate now
          </Link>
          <Link className="btn secondary" href="/about">
            About our mission
          </Link>
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
