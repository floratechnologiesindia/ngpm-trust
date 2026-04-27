"use client";

import { useMemo, useState } from "react";

type CountryKey = "nepal" | "bhutan" | "bangladesh";

const countryTabs: { key: CountryKey; label: string }[] = [
  { key: "nepal", label: "Nepal" },
  { key: "bhutan", label: "Bhutan" },
  { key: "bangladesh", label: "Bangladesh" }
];

const countryImages: Record<CountryKey, string[]> = {
  nepal: [
    "/images/countries/nepal/Nepal 1.jpg",
    "/images/countries/nepal/Nepal 2.jpg",
    "/images/countries/nepal/Nepal 3.jpg",
    "/images/countries/nepal/Nepal 4.jpg",
    "/images/countries/nepal/Nepal 5.jpg",
    "/images/countries/nepal/Nepal 6.jpg",
    "/images/countries/nepal/Nepal 7.jpg",
    "/images/countries/nepal/Nepal 8.jpg",
    "/images/countries/nepal/Nepal 9.jpg",
    "/images/countries/nepal/Nepal 10.jpg"
  ],
  bhutan: [
    "/images/countries/bhutan/Bhuton 1.png",
    "/images/countries/bhutan/Bhuton 2.png",
    "/images/countries/bhutan/Bhuton 3.png",
    "/images/countries/bhutan/Bhuton 4.png",
    "/images/countries/bhutan/Bhuton 5.png",
    "/images/countries/bhutan/Bhuton 6.png",
    "/images/countries/bhutan/Bhuton 7.jpg"
  ],
  bangladesh: [
    "/images/countries/bangladesh/Bengal.jpg",
    "/images/countries/bangladesh/Bengal 1.jpg",
    "/images/countries/bangladesh/Bengal 2.jpg",
    "/images/countries/bangladesh/Bengal 3.jpg",
    "/images/countries/bangladesh/Bengal 4.jpg"
  ]
};

const countryContent: Record<CountryKey, React.ReactNode> = {
  nepal: (
    <>
      <p>
        நமது அருகாமை நாடான நேபாள், பூட்டான், வங்காளதேஷ் நாடுகளில் 22 விதமான ஜாதிகளுக்கு சுவிசேஷம்
        அறிவிக்கிறோம்.
      </p>
      <p>
        நேபாள் உலகிலேயே இந்து நாடு பெருமையுடன் பேசும் இந்நாட்டில், வறுமை தலைவிரித்தாடுகிறது.
        முறையான விவசாயமோ தொழிற்சாலையோ இல்லாத பகுதிகளில் பல குழந்தைகள் மிகவும் பாதிப்பான சூழலில்
        வாழ்கிறார்கள்.
      </p>
      <p>
        SMPM & NGPM ஊழியத்தின் மூலம் ஜாஜர்கோட் பகுதியில் 68 குழந்தைகள் விடுதியில் தங்கி கல்வி
        பெறுகின்றனர். அவர்களில் 30 குழந்தைகள் அநாதைகள்; 15 குழந்தைகளுக்கு அப்பா அல்லது அம்மா இல்லை.
        48 இடங்களில் ஆராதனைகள் நடைபெறுகின்றன; 3 இடங்களில் ஆலயம் கட்டி பிரதிஷ்டை செய்யப்பட்டுள்ளது;
        மேலும் 3 இடங்களில் கட்டுமானம் நடைபெறுகிறது.
      </p>
      <p>
        2030 தரிசனம்: ஜாஜர்கோட் மற்றும் கோகுல்பூர் வட்டாரங்களில் 3 மிஷன் பயிற்சி வளாகங்கள்,
        500 ஆராதனை குழுக்கள், 100 ஆலயங்கள்.
      </p>
      <p>
        In our neighboring countries—Nepal, Bhutan, and Bangladesh—we are proclaiming the Gospel
        among 22 different communities.
      </p>
      <p>
        In Nepal, poverty is widespread and many children grow up in vulnerable conditions. In this
        need, the Lord has opened doors for SMPM & NGPM.
      </p>
      <p>
        In Jajarkot, we care for 68 children in our hostel and support their education. Among them,
        30 are orphans and 15 have lost one or both parents. Worship services are conducted in 48
        locations. Churches have already been built and inaugurated in 3 places, and construction is
        ongoing in 3 more locations.
      </p>
      <p>
        Vision 2030: establish 3 mission training centers in Jajarkot and Gokulpur, form 500 worship
        groups, and build churches in 100 locations. In such a God-given vision, what will be your
        part?
      </p>
    </>
  ),
  bhutan: (
    <>
      <p>
        பூட்டான் நாடு உலகிலேயே இன்று வரை பதிவு செய்யப்பட்ட கிறிஸ்தவ சபைகள் இல்லாத நாடாகக்
        கருதப்படுகிறது; பெரும்பான்மையாக புத்த மதம் பின்பற்றப்படுகிறது.
      </p>
      <p>
        SMPM & NGPM மூலம் 4 மிஷனரிகள் நியமிக்கப்பட்டு 14 இடங்களில் ரகசிய ஆராதனைகள் நடைபெற்று
        வருகின்றன.
      </p>
      <p>
        2030 தரிசனம்: பூட்டானில் 1 மிஷன் பயிற்சி வளாகம் உருவாக்கி, 100 ஆராதனை குழுக்கள் உருவாக்கி,
        50 இடங்களில் ஆலயம் கட்டுவதற்கு ஜெபத்துடன் திட்டமிடுகிறோம்.
      </p>
      <p>பூட்டான் நாட்டில் திறந்த வாசல் ஏற்பட ஜெபித்து கொள்ளுங்கள். இத்தரிசனத்தில் உங்கள் பங்கு என்ன?</p>
      <p>
        Bhutan is one of the least-open countries for the Gospel. SMPM & NGPM have appointed four
        missionaries, and worship is happening in 14 secret locations.
      </p>
      <p>
        Vision 2030: establish 1 mission training center, form 100 worship groups, and build churches
        in 50 locations. Pray for open doors in Bhutan.
      </p>
    </>
  ),
  bangladesh: (
    <>
      <p>
        வங்கதேசம் ஒரு இஸ்லாமிய நாடு. இந்நாட்டில் வறுமை அதிகமாக உள்ளது; பல குழந்தைகள் உணவுக்காக
        பிச்சை எடுக்க வேண்டிய நிலை ஏற்படுகிறது.
      </p>
      <p>
        SMPM & NGPM மூலம் வங்கதேசத்தில் 4 கிராமங்களில் ஆராதனை குடிசைகளில் நடத்தப்படுகிறது. 2 இடங்களில்
        பகல் நேர பராமரிப்பில் 60 குழந்தைகளுக்கு கல்வியும் பராமரிப்பும் வழங்கப்படுகிறது.
      </p>
      <p>
        2030 தரிசனம்: 1 மிஷன் பயிற்சி வளாகம், 50 ஆராதனை குழுக்கள், 10 இடங்களில் ஆலய கட்டுமானம்.
        திறந்த வாசல் ஏற்பட ஜெபியுங்கள்.
      </p>
      <p>
        Bangladesh is an Islamic country where poverty is widespread. In many places, children and
        girls are especially vulnerable.
      </p>
      <p>
        SMPM & NGPM currently conduct worship in huts in four villages. In two places, 60 children
        receive daytime care and education. By 2030, we are planning one mission training campus,
        50 worship groups, and church buildings in 10 locations.
      </p>
    </>
  )
};

export default function OtherCountriesMissionariesPage() {
  const [active, setActive] = useState<CountryKey>("nepal");
  const images = useMemo(() => countryImages[active], [active]);

  return (
    <div className="section grid" style={{ gap: "1rem" }}>
      <section className="hero">
        <h1>Neighbour Countries Visions</h1>
        <p style={{ maxWidth: 840 }}>
          Extending ministry into Nepal, Bhutan, Bangladesh, and other nations, 22 Missionaries
          working along with 25 ethnic groups.
        </p>
      </section>

      <section className="card">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "1rem" }}>
          {countryTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={tab.key === active ? "btn" : "btn secondary"}
              style={{ border: 0 }}
              onClick={() => setActive(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <article className="country-mission-content">{countryContent[active]}</article>
      </section>

      <section className="grid grid-3">
        {images.map((src, idx) => (
          <article className="card" key={src}>
            <img
              src={src}
              alt={`${active} mission ${idx + 1}`}
              style={{
                width: "100%",
                aspectRatio: "4 / 3",
                objectFit: "cover",
                borderRadius: 12
              }}
            />
          </article>
        ))}
      </section>
    </div>
  );
}
