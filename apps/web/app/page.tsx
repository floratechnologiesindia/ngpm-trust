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
  const [showFullMission, setShowFullMission] = useState(false);
  const [galleryItems, setGalleryItems] = useState<
    { _id: string; title: string; imageUrl: string }[]
  >([]);
  const slides = [
    "/images/home-carousel/ngpm-1.jpg",
    "/images/home-carousel/ngpm-2.jpg",
    "/images/home-carousel/ngpm-3.jpg",
    "/images/home-carousel/ngpm-4.jpg"
  ];
  const [activeSlide, setActiveSlide] = useState(0);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6661";

  const resolveImageUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${apiBase}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    fetch(`${apiBase}/api/gallery`)
      .then((r) => r.json())
      .then((data) => setGalleryItems(Array.isArray(data) ? data : []))
      .catch(() => setGalleryItems([]));
  }, [apiBase]);

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

      <section className="card mission-content-block">
        <h2 style={{ marginTop: 0 }}>மறுரூப இந்தியா</h2>
        <p>
          <strong>SMPM & NGPM OUR ETHOS:</strong> Obedience to God&apos;s Word · Faith · Holiness ·
          Sacrifice · Simple Living · Real Fellowship.
        </p>

        <h3>VISION STATEMENT</h3>
        <p>
          தேவனால் எழுப்பபட்ட ஒரு சுதேச உள்நாட்டு மிஷனெரி இயக்கம் இயேசு தமது சீஷர்களை நோக்கி
          உலகமெங்கும் போய் சர்வ சிருஸ்டிக்கும் சுவிசேஷத்தைப் பிரசங்கியுங்கள். விசுவாசமுள்ளவனாகி
          திருமுழக்கு பெற்றவன் இரட்சிக்கப்படுவான் மாற்கு 16:15 கிறிஸ்துவின் இறுதிகட்டளைக்கு
          கீழ்படிந்து நமது தாய் நாட்டை சுவிசேஷ வசனத்தால் நிரப்ப இந்தியர்கள் ஒருவர் கூட நரகம்
          போகக்கூடாது என்ற பாரத்துடன் SMPM & NGPM-ன் மிஷனெரி இயக்கம் இந்தியாவின் 25 மாநிலத்தில்
          270 மிஷனெரிகள் 178 பணித்தளம் அமைத்து 138 விதமான மக்கள் இனங்களுக்கும், நேபாள், பூட்டான்,
          வங்காளதேஷ் நாடுகளில் 22 விதமான ஜாதிகளுக்கு சுவிசேஷம் அறிவிக்கிறோம்.
        </p>

        <h3>MISSION STATEMENT</h3>
        <p>
          இயக்கம் ஆரம்பித்த கடந்த 7 ஆண்டுகளில் 8950 பேருக்கு திருமுழுக்கு கொடுத்து 880 கிராமங்களில்
          சபை உருவாக்கி 59 கிராமங்களில் ஆலயம் கட்டி பிரதிஷ்டை செய்து முதல் தலைமுறை கிறிஸ்தவர்களாக
          உயிர்தெழுந்த தேவனை ஆராதிக்க வழிவகை செய்துள்ளோம்.
        </p>

        {showFullMission ? (
          <>
            <p>
              ஜெபம், தியாகம், எளியவாழ்க்கை, பரிசுத்தம், வேதவசனத்திற்கு கீழ்படிதல் என்ற கொள்கையுடன்
              ஜெபியுங்கள் புறப்பட்டு போங்கள் என்ற சவால்களை அனைத்து பிரிவு திருச்சபைகளுக்கும்
              கொடுக்கிறோம்.
            </p>
            <p>
              பாரதம் என்றால் 148 கோடி மக்கள் கூட்டம் என்று பொருள்; 6154 ஜாதிகள், 1600 பாஷைகள்,
              பலவிதமான வழிபாடு கலாச்சாரம் கொண்ட அகன்ற நாட்டில் 4 லட்சம் கிராமங்களில் ஆலயம் இல்லை.
              இந்தியாவில் 28000 கோட்டில் 180000 பின்கோட்டில் ஒரு ஆராதனை ஸ்தலம் இல்லை. நீங்கள் தேடும்
              நிம்மதி இயேசு கிறிஸ்துவில் மட்டுமே உண்டு என்பதை நம் தாய் நாட்டு மக்களுக்கு அறிவிக்கிறோம்.
            </p>

            <h3>SOCIAL ECONOMIC</h3>
            <p>
              முதியோர் கல்வி, டெய்லரிங், கணனி பயிற்சி கொடுத்து சுய வருமானம் பெற உதவுகிறோம். உள்ளூர்
              தலைமையத்துவம் உருவாக சபைகளை நடத்த முறையான இறையியல் கல்வி கொடுக்கிறோம்.
            </p>
            <p>
              8 விடுதிகளில் 458 ஆதிவாசி விசுவாச குழந்தைகள், மணிப்பூர் கலவரத்தில் பாதிக்கப்பட்டு
              காடுகளில் வாழும் விசுவாசிகளின் குழந்தைகள் 58 பேருக்கு உணவு, உறைவிடம், ஆங்கில வழி
              கல்வி வழங்குகிறோம்.
            </p>

            <h3>TRIBAL & POOR CHILDREN&apos;S EDUCATION</h3>
            <p>
              மஹராஷ்டிரா–மத்திய பிரதேச எல்லையில் Powra ஆதிவாசி குழந்தைகளின் கல்வி முன்னேற்றத்திற்காக
              நந்தூர்பார் பகுதியில் 15x10 ஹால் கட்ட ரூ.1,00,000 தேவை. ஸ்பான்சர் குடும்ப பெயர் அந்த
              ஹாலில் பதிக்கப்பட்டு தினமும் ஜெபம் ஏறெடுக்கப்படும்.
            </p>

            <h3>VISION-2030</h3>
            <p>
              2030-க்குள் மிஷன் இந்தியா திட்டத்தின் மூலம் 100 பயிற்சி வளாகம் உருவாக்கி, அதன் மூலம்
              100 சுதேச மிஷனெரிகளை உருவாக்கி, ஒரு உள்ளூர் மிஷனெரி 10 சபைகளை எழுப்பி, 5 கிராமத்திற்கு
              ஒரு சுதேச மிஷனெரி என நியமிக்க விசுவாசத்துடன் உழைக்கிறோம்.
            </p>

            <h3>MAGAZINE</h3>
            <p>
              மாதம் தோறும் ஆத்தும சவால் என்ற பத்ரிகை வெளியிட்டு கர்த்தராகிய இயேசு தாம் சொன்னபடி
              சீக்கிரமாக வரப்போகிறார்; அவரை சந்திக்கும்போது வெறுங்கையுடன் செல்லக்கூடாது என்பதை
              அறிவுறுத்துகிறோம்.
            </p>

            <h3>Church Construction</h3>
            <p>
              MAHARASTRA, RAJASTHAN, GUJARAT, WEST BENGAL, ODISHA, ANDHRA PRADESH, TAMIL NADU,
              KARNATAKA, CHATTISGHAR, UDHRA PRADESH, UDHRAKANT, NEPAL, PUNJAB, HIMACHEL, JAMMU &
              KASHMIR, CHAHNGHAR, HARIYANA ஆகிய மாநிலங்களில் 25 இடங்களில் ஆலயம் கட்டுமானம் நடந்து
              வருகிறது. ஆலயம் கட்ட ரூ.7,00,000 / ரூ.5,00,000; கட்சா ஆலயம் ரூ.3,00,000 / ரூ.2,00,000
              தேவை. 80G Exception Available.
            </p>

            <h3>WHAT IS YOUR INVOLVEMENT?</h3>
            <p>
              ஒரு மிஷனெரியை ஜெபித்து அனுப்ப மாதம் 3000, ஒரு மிஷனெரி குழந்தை படிக்க வைக்க மாதம் 1000,
              ஒரு ஆதிவாசி குழந்தை படிக்க வைக்க மாதம் 600/1200. உங்கள் சிறப்பு நன்கொடைக்கு 80G
              Exception Available.
            </p>
            <p>
              முகவரி: 2 MGR தெரு, பதுவஞ்சேரி, சென்னை-600126 / 9444737550
            </p>

            <h3>BANK DETAILS</h3>
            <p>
              Nehemiah New Generation Partakers Movement (NGPM), SBI Ac. 42178020691, IFSC:
              SBIN0061767, Tiruanchery Branch.
            </p>
            <p style={{ marginBottom: 0 }}>
              Salvation Mission Partakers Movement (SMPM), Canara Bank Ac. 120034549490, IFSC:
              CNR0005652, Chennai Salayur Branch, 9444737550 / 9043867550.
            </p>
          </>
        ) : null}
        <button
          type="button"
          className="btn secondary"
          onClick={() => setShowFullMission((v) => !v)}
          style={{ marginTop: "1rem" }}
        >
          {showFullMission ? "Show less" : "Read more"}
        </button>
      </section>

      <section className="section" style={{ paddingBottom: "1rem" }}>
        <article className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ marginTop: 0 }}>Gallery</h2>
          <p className="muted" style={{ marginBottom: 0 }}>
            Moments from ministry, outreach, prayer gatherings, and community transformation.
          </p>
        </article>
        <div className="masonry">
          {galleryItems.map((item, index) => (
            <article className="card masonry-item" key={item._id}>
              <img
                src={resolveImageUrl(item.imageUrl)}
                alt={item.title || `NGPM gallery image ${index + 1}`}
                style={{ width: "100%", borderRadius: 12 }}
              />
              {item.title ? (
                <p className="muted" style={{ marginBottom: 0 }}>
                  {item.title}
                </p>
              ) : null}
            </article>
          ))}
          {galleryItems.length === 0 ? (
            <article className="card masonry-item">
              <p className="muted">No gallery images found yet. Add them from admin dashboard.</p>
            </article>
          ) : null}
        </div>
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
