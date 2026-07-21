import { useCallback, useState } from "react";

/* ---------- Types ---------- */

export interface Personal {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  bullets: string; // newline-separated bullet points
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  start: string;
  end: string;
  details: string;
}

export interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface CvData {
  personal: Personal;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string; // comma separated
  projects: Project[];
  languages: Language[];
  accent: string; // hex accent color
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export const emptyCv = (): CvData => ({
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: "",
  projects: [],
  languages: [],
  accent: "#2563eb",
});

export const sampleCv = (): CvData => ({
  personal: {
    fullName: "Ada Yılmaz",
    title: "Senior Frontend Engineer",
    email: "ada.yilmaz@example.com",
    phone: "+90 532 000 00 00",
    location: "Istanbul, Türkiye",
    website: "adayilmaz.dev",
    linkedin: "linkedin.com/in/adayilmaz",
  },
  summary:
    "Senior Frontend Engineer with 7+ years building accessible, high-performance web applications. Specializes in React, TypeScript, and design systems. Passionate about mentoring and shipping product-fast without cutting corners on quality.",
  experience: [
    {
      id: uid(),
      role: "Senior Frontend Engineer",
      company: "Nimbus Labs",
      location: "Remote",
      start: "2022",
      end: "",
      current: true,
      bullets:
        "Led the rebuild of the core dashboard, improving load time by 45%.\nMentored 4 engineers and introduced a component-driven workflow.\nOwned the migration from JavaScript to TypeScript across 3 apps.",
    },
    {
      id: uid(),
      role: "Frontend Engineer",
      company: "Brightwave",
      location: "Istanbul, Türkiye",
      start: "2018",
      end: "2022",
      current: false,
      bullets:
        "Built a reusable design system adopted by 6 product teams.\nReduced bundle size by 38% through code-splitting and lazy loading.\nPartnered with design to ship 20+ features end-to-end.",
    },
  ],
  education: [
    {
      id: uid(),
      degree: "B.Sc. Computer Engineering",
      school: "Boğaziçi University",
      location: "Istanbul, Türkiye",
      start: "2013",
      end: "2017",
      details: "Graduated with honors. Thesis on accessible UI patterns.",
    },
  ],
  skills:
    "React, TypeScript, Next.js, Tailwind CSS, Node.js, GraphQL, Jest, Playwright, Accessibility, Design Systems",
  projects: [
    {
      id: uid(),
      name: "OpenResume",
      link: "github.com/ada/openresume",
      description: "Open-source resume builder with live preview and PDF export.",
    },
  ],
  languages: [
    { id: uid(), name: "Turkish", level: "Native" },
    { id: uid(), name: "English", level: "Professional" },
  ],
  accent: "#2563eb",
});

/* ---------- Summary suggestion (rule-based, not AI) ---------- */

export function suggestSummary(data: CvData): string {
  const t = data.personal.title.trim();
  const skillsList = data.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const topSkills = skillsList.slice(0, 3).join(", ");
  const expYears =
    data.experience.length > 0
      ? `${data.experience.length}+ role${data.experience.length > 1 ? "s" : ""} of experience`
      : "Hands-on project experience";

  if (!t && !topSkills) {
    return "A motivated professional with a track record of delivering results and collaborating across teams.";
  }
  const titlePart = t ? `${t}` : "Professional";
  const skillsPart = topSkills ? ` with expertise in ${topSkills}` : "";
  return `${titlePart}${skillsPart}, bringing ${expYears.toLowerCase()} and a focus on quality, collaboration, and continuous improvement. This is a generated starter — edit it to match your story.`;
}

/* ---------- In-memory state hook ---------- */

// Note: persistent storage (localStorage) is blocked in the sandboxed preview
// iframe, so the draft lives in memory for the session. The app is fully
// functional; the live preview + print/PDF export work without persistence.

export function useCvData() {
  const [data, setData] = useState<CvData>(() => sampleCv());

  const update = useCallback((patch: Partial<CvData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => setData(emptyCv()), []);
  const loadSample = useCallback(() => setData(sampleCv()), []);

  return { data, setData, update, reset, loadSample };
}
