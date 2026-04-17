export default function ContactPage() {
  return (
    <div className="section grid" style={{ gap: "1rem" }}>
      <section className="hero" style={{ backgroundImage: "linear-gradient(120deg, rgba(15,118,110,0.9), rgba(20,184,166,0.85)), url(https://images.unsplash.com/photo-1484981184820-2e84ea0af5e0?auto=format&fit=crop&w=1600&q=80)" }}>
        <h1>Contact & Donations</h1>
        <p style={{ maxWidth: 700 }}>
          Pray, plan, and participate. Join hands with us so that no one perishes without hearing
          the Gospel.
        </p>
        <a className="btn secondary" href="https://www.google.com/maps?q=12.888553,80.1459702&z=17&hl=en" target="_blank" rel="noreferrer">
          Visit location map
        </a>
      </section>

      <section className="grid grid-2">
        <article className="card">
          <h3>Contact</h3>
          <p>Whatsapp: +91 9444737550, +91 8056827550</p>
          <p>Email: office@smpm.co.in, koilraj@smpm.co.in</p>
          <p>Address: 2, MGR Street, Paduanchery, Chennai - 600126</p>
        </article>
        <article className="card">
          <h3>Bank Details</h3>
          <p>Nehemiah New Generation Partakers Movement Trust - SBI Account: 42178020691</p>
          <p>IFSC: SBIN0061767 (Tiruanchery)</p>
          <p>Salvation Mission Partaker Movement - Canara Account: 120034549490</p>
          <p>IFSC: CNR0005652 (Chennai Salayur)</p>
        </article>
      </section>
      <section className="grid grid-2">
        <article className="card">
          <h3>Contact Us Form</h3>
          <p className="muted">Share your prayer request, support interest, or partnership query.</p>
          <form action="#" method="post" className="grid" style={{ gap: "0.75rem", marginTop: "0.75rem" }}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid #cbd5e1" }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid #cbd5e1" }}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid #cbd5e1" }}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              rows={5}
              style={{ padding: "0.75rem", borderRadius: 10, border: "1px solid #cbd5e1", resize: "vertical" }}
            />
            <button type="submit" className="btn" style={{ border: 0 }}>
              Submit
            </button>
          </form>
        </article>
        <article className="card">
          <h3>Find Us on Map</h3>
          <p className="muted">2, MGR Street, Paduanchery, Chennai - 600126</p>
          <iframe
            title="NGPM location map"
            src="https://maps.google.com/maps?q=12.888553,80.1459702&z=17&output=embed"
            width="100%"
            height="320"
            style={{ border: 0, borderRadius: 12 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </article>
      </section>
      <section className="cta-band">
        <h2 style={{ marginTop: 0 }}>Ways to partner with this mission</h2>
        <p style={{ marginTop: 0, marginBottom: "0.75rem", fontWeight: 700 }}>(eligible for 80G exemption)</p>
        <p style={{ marginBottom: "0.5rem" }}>Sponsor a missionary: Rs. 3,000/month</p>
        <p style={{ marginBottom: "0.5rem" }}>Educate a missionary child: Rs. 1,000/month</p>
        <p style={{ marginBottom: "0.5rem" }}>Support a tribal child: Rs. 600-Rs. 1,200/month</p>
        <p style={{ marginBottom: "0.4rem", fontWeight: 700 }}>Church Construction:</p>
        <p style={{ marginBottom: "0.5rem" }}>1000 sq. ft. - ₹8,00,000</p>
        <p style={{ marginBottom: "0.5rem" }}>600 sq. ft. - ₹5,00,000</p>
        <p style={{ marginBottom: 0 }}>Kacha Church - ₹3,00,000</p>
      </section>
    </div>
  );
}
