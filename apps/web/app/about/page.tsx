import fs from "node:fs/promises";
import path from "node:path";

type OfficeBearer = {
  name: string;
  role: string;
  image: string;
};

const officeBearers: OfficeBearer[] = [
  {
    name: "Rev. M. Koilraj",
    role: "Managing Trustee and General Secretary",
    image: "/images/office-bearers/rev-m-koilraj.jpg"
  },
  {
    name: "Rev Dr. V. David",
    role: "President",
    image: "/images/office-bearers/rev-dr-v-david.jpg"
  },
  {
    name: "Rev. Dr. Simon Ponnaiah",
    role: "Vice President",
    image: "/images/office-bearers/rev-dr-simon-ponnaiah.jpg"
  },
  {
    name: "Mr. Israel Ponraj",
    role: "Vice President",
    image: "/images/office-bearers/mr-israel-ponraj.jpg"
  },
  {
    name: "Mr. Berlin",
    role: "Secretary",
    image: "/images/office-bearers/mr-berlin.jpg"
  },
  {
    name: "Mr. Devadas Mani Moses",
    role: "Treasurer",
    image: "/images/office-bearers/mr-devadas-mani-moses.jpg"
  },
  {
    name: "Mr. Kanagaraj Associate",
    role: "Associate Treasurer",
    image: "/images/office-bearers/mr-kanagaraj-associate.jpg"
  }
];

export const metadata = {
  title: "About NGPM",
  description: "Vision, ethos and mission statement of NGPM and SMPM."
};

async function resolveImage(localImage: string, name: string) {
  const imageFilePath = path.join(process.cwd(), "public", localImage.replace(/^\//, ""));
  try {
    await fs.access(imageFilePath);
    return localImage;
  } catch {
    return `https://ui-avatars.com/api/?background=0f766e&color=ffffff&size=512&name=${encodeURIComponent(name)}`;
  }
}

export default async function AboutPage() {
  const officeBearersWithImages = await Promise.all(
    officeBearers.map(async (person) => ({
      ...person,
      resolvedImage: await resolveImage(person.image, person.name)
    }))
  );

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

      <section className="grid" style={{ gap: "0.75rem" }}>
        <article className="card">
          <h2 style={{ marginTop: 0 }}>Office Bearers</h2>
          <p className="muted" style={{ marginBottom: 0 }}>
            Meet the leadership team serving the vision and mission of NGPM & SMPM.
          </p>
        </article>
        <div className="grid grid-3">
          {officeBearersWithImages.map((person) => (
            <article className="card" key={person.name}>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4 / 3",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#e2e8f0"
                }}
              >
                <img
                  src={person.resolvedImage}
                  alt={person.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <h3 style={{ marginBottom: "0.25rem" }}>{person.name}</h3>
              <p className="muted" style={{ marginTop: 0 }}>
                {person.role}
              </p>
            </article>
          ))}
        </div>
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
