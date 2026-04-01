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
  title: "Office Bearers | NGPM Trust",
  description: "Leadership team of Nehemiah New Generation Partakers Movement Trust."
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

export default async function OfficeBearersPage() {
  const officeBearersWithImages = await Promise.all(
    officeBearers.map(async (person) => ({
      ...person,
      resolvedImage: await resolveImage(person.image, person.name)
    }))
  );

  return (
    <div className="section grid" style={{ gap: "1rem" }}>
      <section className="hero">
        <h1>Office Bearers</h1>
        <p style={{ maxWidth: 760 }}>
          Meet the leadership team serving the vision and mission of NGPM & SMPM.
        </p>
      </section>

      <section className="grid grid-3">
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
            <small className="muted">Image path: {person.image}</small>
          </article>
        ))}
      </section>
    </div>
  );
}
