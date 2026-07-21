import type { CvData, Experience, Education, Project } from "@/lib/cv";

function bullets(text: string): string[] {
  return text
    .split("\n")
    .map((b) => b.trim())
    .filter(Boolean);
}

function dateRange(start: string, end: string, current?: boolean): string {
  const s = start.trim();
  const e = current ? "Present" : end.trim();
  if (s && e) return `${s} — ${e}`;
  return s || e;
}

function ExperienceItem({ item, accent }: { item: Experience; accent: string }) {
  return (
    <div className="cv-item">
      <div className="cv-item-head">
        <span className="cv-item-title" style={{ color: accent }}>
          {item.role || "Role"}
        </span>
        <span className="cv-item-dates">{dateRange(item.start, item.end, item.current)}</span>
      </div>
      <div className="cv-item-sub">
        <span>{item.company || "Company"}</span>
        {item.location ? <span className="cv-item-loc"> · {item.location}</span> : null}
      </div>
      {bullets(item.bullets).length > 0 && (
        <ul className="cv-bullets">
          {bullets(item.bullets).map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EducationItem({ item, accent }: { item: Education; accent: string }) {
  return (
    <div className="cv-item">
      <div className="cv-item-head">
        <span className="cv-item-title" style={{ color: accent }}>
          {item.degree || "Degree"}
        </span>
        <span className="cv-item-dates">{dateRange(item.start, item.end)}</span>
      </div>
      <div className="cv-item-sub">
        <span>{item.school || "School"}</span>
        {item.location ? <span className="cv-item-loc"> · {item.location}</span> : null}
      </div>
      {item.details && <p className="cv-item-details">{item.details}</p>}
    </div>
  );
}

function ProjectItem({ item, accent }: { item: Project; accent: string }) {
  return (
    <div className="cv-item">
      <div className="cv-item-head">
        <span className="cv-item-title" style={{ color: accent }}>
          {item.name || "Project"}
        </span>
        {item.link && <span className="cv-item-dates cv-link">{item.link}</span>}
      </div>
      {item.description && <p className="cv-item-details">{item.description}</p>}
    </div>
  );
}

export default function CvPreview({ data }: { data: CvData }) {
  const p = data.personal;
  const skills = data.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const contactBits = [p.email, p.phone, p.location, p.website, p.linkedin].filter(Boolean);

  return (
    <div id="cv-sheet" className="cv-sheet" style={{ ["--cv-accent" as string]: data.accent }}>
      <header className="cv-header">
        <h1 className="cv-name">{p.fullName || "Your Name"}</h1>
        {p.title && <p className="cv-title" style={{ color: data.accent }}>{p.title}</p>}
        {contactBits.length > 0 && (
          <p className="cv-contact">
            {contactBits.map((c, i) => (
              <span key={i} className="cv-contact-item">
                {c}
              </span>
            ))}
          </p>
        )}
      </header>

      {data.summary && (
        <section className="cv-section">
          <h2 className="cv-section-title">Summary</h2>
          <p className="cv-summary">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Experience</h2>
          {data.experience.map((e) => (
            <ExperienceItem key={e.id} item={e} accent={data.accent} />
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Education</h2>
          {data.education.map((e) => (
            <EducationItem key={e.id} item={e} accent={data.accent} />
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Skills</h2>
          <div className="cv-skills">
            {skills.map((s, i) => (
              <span key={i} className="cv-skill">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Projects</h2>
          {data.projects.map((e) => (
            <ProjectItem key={e.id} item={e} accent={data.accent} />
          ))}
        </section>
      )}

      {data.languages.length > 0 && (
        <section className="cv-section">
          <h2 className="cv-section-title">Languages</h2>
          <p className="cv-langs">
            {data.languages.map((l, i) => (
              <span key={l.id}>
                {l.name}
                {l.level ? ` (${l.level})` : ""}
                {i < data.languages.length - 1 ? "  ·  " : ""}
              </span>
            ))}
          </p>
        </section>
      )}
    </div>
  );
}
