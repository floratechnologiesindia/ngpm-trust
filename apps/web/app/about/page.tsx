export const metadata = {
  title: "About NGPM",
  description: "Vision, ethos and mission statement of NGPM and SMPM."
};

export default function AboutPage() {
  return (
    <div className="section grid" style={{ gap: "1rem" }}>
      <section className="hero" style={{ backgroundImage: "linear-gradient(120deg, rgba(15,118,110,0.9), rgba(20,184,166,0.85)), url(https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1600&q=80)" }}>
        <h1>Our Ethos</h1>
        <p style={{ maxWidth: 760 }}>
          Obedience to God&apos;s Word, Faith, Holiness, Sacrifice, Simple Living, Real Fellowship.
        </p>
      </section>

      <section className="grid grid-2">
        <article className="card">
          <h2>Vision Statement</h2>
          <p className="muted">
            NGPM & SMPM is an indigenous missionary movement raised by God to fulfill the Great
            Commission of our Lord Jesus Christ (Mark 16:15).
          </p>
        </article>
        <article className="card">
          <h2>Mission Focus</h2>
          <ul>
            <li>8,950 first-generation believers reached.</li>
            <li>880 village congregations established.</li>
            <li>59 churches built and dedicated.</li>
            <li>Pastoral and community development programs.</li>
          </ul>
        </article>
      </section>

      <section className="cta-band">
        <h2 style={{ marginTop: 0 }}>A call to action</h2>
        <p>
          No Indian should perish without hearing the Gospel. Join this mission through prayer,
          giving, and active participation.
        </p>
      </section>
    </div>
  );
}
