import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderGit2,
  Languages as LangIcon,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Wand2,
} from "lucide-react";
import type {
  CvData,
  Experience,
  Education,
  Project,
  Language,
} from "@/lib/cv";
import { uid, suggestSummary } from "@/lib/cv";

const STEPS = [
  { id: "basics", label: "Basics", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "languages", label: "Languages", icon: LangIcon },
] as const;

type StepId = (typeof STEPS)[number]["id"];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function RepeatCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive h-7 px-2"
          data-testid="button-remove"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </Button>
      </div>
      {children}
    </div>
  );
}

export default function CvForm({
  data,
  setData,
}: {
  data: CvData;
  setData: React.Dispatch<React.SetStateAction<CvData>>;
}) {
  const [step, setStep] = useState<StepId>("basics");
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const setPersonal = (patch: Partial<CvData["personal"]>) =>
    setData((d) => ({ ...d, personal: { ...d.personal, ...patch } }));

  /* arrays */
  const updateArr = <K extends "experience" | "education" | "projects" | "languages">(
    key: K,
    id: string,
    patch: Partial<CvData[K][number]>
  ) =>
    setData((d) => ({
      ...d,
      [key]: d[key].map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }) as CvData);

  const addExperience = () =>
    setData((d) => ({
      ...d,
      experience: [
        ...d.experience,
        { id: uid(), role: "", company: "", location: "", start: "", end: "", current: false, bullets: "" },
      ],
    }));
  const addEducation = () =>
    setData((d) => ({
      ...d,
      education: [
        ...d.education,
        { id: uid(), degree: "", school: "", location: "", start: "", end: "", details: "" },
      ],
    }));
  const addProject = () =>
    setData((d) => ({
      ...d,
      projects: [...d.projects, { id: uid(), name: "", link: "", description: "" }],
    }));
  const addLanguage = () =>
    setData((d) => ({
      ...d,
      languages: [...d.languages, { id: uid(), name: "", level: "" }],
    }));

  const remove = (key: "experience" | "education" | "projects" | "languages", id: string) =>
    setData((d) => ({ ...d, [key]: d[key].filter((it) => it.id !== id) }) as CvData);

  const go = (dir: number) => {
    const next = STEPS[stepIndex + dir];
    if (next) setStep(next.id);
  };

  return (
    <div className="flex flex-col">
      {/* Step nav */}
      <div className="flex flex-wrap gap-1 pb-3">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const active = s.id === step;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              data-testid={`tab-${s.id}`}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="pr-1">
        <div className="space-y-4 pb-2">
          {step === "basics" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Full name">
                  <Input
                    value={data.personal.fullName}
                    onChange={(e) => setPersonal({ fullName: e.target.value })}
                    placeholder="Ada Yılmaz"
                    data-testid="input-fullName"
                  />
                </Field>
                <Field label="Target job title">
                  <Input
                    value={data.personal.title}
                    onChange={(e) => setPersonal({ title: e.target.value })}
                    placeholder="Senior Frontend Engineer"
                    data-testid="input-title"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Email">
                  <Input
                    type="email"
                    value={data.personal.email}
                    onChange={(e) => setPersonal({ email: e.target.value })}
                    placeholder="ada@example.com"
                    data-testid="input-email"
                  />
                </Field>
                <Field label="Phone">
                  <Input
                    value={data.personal.phone}
                    onChange={(e) => setPersonal({ phone: e.target.value })}
                    placeholder="+90 5xx xxx xx xx"
                    data-testid="input-phone"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Location">
                  <Input
                    value={data.personal.location}
                    onChange={(e) => setPersonal({ location: e.target.value })}
                    placeholder="Istanbul, Türkiye"
                    data-testid="input-location"
                  />
                </Field>
                <Field label="Website">
                  <Input
                    value={data.personal.website}
                    onChange={(e) => setPersonal({ website: e.target.value })}
                    placeholder="yoursite.dev"
                    data-testid="input-website"
                  />
                </Field>
              </div>
              <Field label="LinkedIn / profile URL">
                <Input
                  value={data.personal.linkedin}
                  onChange={(e) => setPersonal({ linkedin: e.target.value })}
                  placeholder="linkedin.com/in/you"
                  data-testid="input-linkedin"
                />
              </Field>
              <Field label="Accent color">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={data.accent}
                    onChange={(e) => setData((d) => ({ ...d, accent: e.target.value }))}
                    className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent p-1"
                    data-testid="input-accent"
                  />
                  <div className="flex gap-1.5">
                    {["#2563eb", "#0f766e", "#7c3aed", "#b91c1c", "#c2410c", "#0f172a"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setData((d) => ({ ...d, accent: c }))}
                        className="h-6 w-6 rounded-full border border-border/60 ring-offset-1 hover:scale-110 transition-transform"
                        style={{ backgroundColor: c }}
                        aria-label={`Accent ${c}`}
                      />
                    ))}
                  </div>
                </div>
              </Field>
            </div>
          )}

          {step === "summary" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">
                  Professional summary
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7"
                  onClick={() => setData((d) => ({ ...d, summary: suggestSummary(d) }))}
                  data-testid="button-suggest"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  Suggest
                </Button>
              </div>
              <Textarea
                value={data.summary}
                onChange={(e) => setData((d) => ({ ...d, summary: e.target.value }))}
                rows={7}
                placeholder="A short paragraph (2-4 sentences) about who you are and what you do."
                data-testid="input-summary"
              />
              <p className="text-xs text-muted-foreground">
                Tip: keep it tight. Recruiters scan this in a few seconds.
              </p>
            </div>
          )}

          {step === "experience" && (
            <div className="space-y-3">
              {data.experience.map((e: Experience, i: number) => (
                <RepeatCard
                  key={e.id}
                  title={e.role || e.company || `Experience ${i + 1}`}
                  onRemove={() => remove("experience", e.id)}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Role">
                      <Input
                        value={e.role}
                        onChange={(ev) => updateArr("experience", e.id, { role: ev.target.value })}
                        placeholder="Senior Engineer"
                      />
                    </Field>
                    <Field label="Company">
                      <Input
                        value={e.company}
                        onChange={(ev) => updateArr("experience", e.id, { company: ev.target.value })}
                        placeholder="Nimbus Labs"
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Location">
                      <Input
                        value={e.location}
                        onChange={(ev) => updateArr("experience", e.id, { location: ev.target.value })}
                        placeholder="Remote"
                      />
                    </Field>
                    <Field label="Start">
                      <Input
                        value={e.start}
                        onChange={(ev) => updateArr("experience", e.id, { start: ev.target.value })}
                        placeholder="2022"
                      />
                    </Field>
                    <Field label="End">
                      <Input
                        value={e.end}
                        disabled={e.current}
                        onChange={(ev) => updateArr("experience", e.id, { end: ev.target.value })}
                        placeholder="2024"
                      />
                    </Field>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={e.current}
                      onChange={(ev) => updateArr("experience", e.id, { current: ev.target.checked })}
                      className="h-3.5 w-3.5 accent-primary"
                    />
                    I currently work here
                  </label>
                  <Field label="Achievements (one per line)">
                    <Textarea
                      value={e.bullets}
                      onChange={(ev) => updateArr("experience", e.id, { bullets: ev.target.value })}
                      rows={4}
                      placeholder={"Led the rebuild of the dashboard, improving load time by 45%.\nMentored 4 engineers."}
                    />
                  </Field>
                </RepeatCard>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExperience}
                className="w-full border-dashed"
                data-testid="button-add-experience"
              >
                <Plus className="h-4 w-4" />
                Add experience
              </Button>
            </div>
          )}

          {step === "education" && (
            <div className="space-y-3">
              {data.education.map((e: Education, i: number) => (
                <RepeatCard
                  key={e.id}
                  title={e.degree || e.school || `Education ${i + 1}`}
                  onRemove={() => remove("education", e.id)}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Degree">
                      <Input
                        value={e.degree}
                        onChange={(ev) => updateArr("education", e.id, { degree: ev.target.value })}
                        placeholder="B.Sc. Computer Engineering"
                      />
                    </Field>
                    <Field label="School">
                      <Input
                        value={e.school}
                        onChange={(ev) => updateArr("education", e.id, { school: ev.target.value })}
                        placeholder="Boğaziçi University"
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Location">
                      <Input
                        value={e.location}
                        onChange={(ev) => updateArr("education", e.id, { location: ev.target.value })}
                        placeholder="Istanbul"
                      />
                    </Field>
                    <Field label="Start">
                      <Input
                        value={e.start}
                        onChange={(ev) => updateArr("education", e.id, { start: ev.target.value })}
                        placeholder="2013"
                      />
                    </Field>
                    <Field label="End">
                      <Input
                        value={e.end}
                        onChange={(ev) => updateArr("education", e.id, { end: ev.target.value })}
                        placeholder="2017"
                      />
                    </Field>
                  </div>
                  <Field label="Details (optional)">
                    <Textarea
                      value={e.details}
                      onChange={(ev) => updateArr("education", e.id, { details: ev.target.value })}
                      rows={2}
                      placeholder="Honors, relevant coursework, thesis…"
                    />
                  </Field>
                </RepeatCard>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEducation}
                className="w-full border-dashed"
                data-testid="button-add-education"
              >
                <Plus className="h-4 w-4" />
                Add education
              </Button>
            </div>
          )}

          {step === "skills" && (
            <div className="space-y-3">
              <Field label="Skills (comma separated)">
                <Textarea
                  value={data.skills}
                  onChange={(e) => setData((d) => ({ ...d, skills: e.target.value }))}
                  rows={4}
                  placeholder="React, TypeScript, Node.js, GraphQL"
                  data-testid="input-skills"
                />
              </Field>
              <p className="text-xs text-muted-foreground">
                Separate each skill with a comma. They render as tags on the CV.
              </p>
            </div>
          )}

          {step === "projects" && (
            <div className="space-y-3">
              {data.projects.map((e: Project, i: number) => (
                <RepeatCard
                  key={e.id}
                  title={e.name || `Project ${i + 1}`}
                  onRemove={() => remove("projects", e.id)}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Name">
                      <Input
                        value={e.name}
                        onChange={(ev) => updateArr("projects", e.id, { name: ev.target.value })}
                        placeholder="OpenResume"
                      />
                    </Field>
                    <Field label="Link">
                      <Input
                        value={e.link}
                        onChange={(ev) => updateArr("projects", e.id, { link: ev.target.value })}
                        placeholder="github.com/you/project"
                      />
                    </Field>
                  </div>
                  <Field label="Description">
                    <Textarea
                      value={e.description}
                      onChange={(ev) => updateArr("projects", e.id, { description: ev.target.value })}
                      rows={2}
                      placeholder="What it does and your role."
                    />
                  </Field>
                </RepeatCard>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProject}
                className="w-full border-dashed"
                data-testid="button-add-project"
              >
                <Plus className="h-4 w-4" />
                Add project
              </Button>
            </div>
          )}

          {step === "languages" && (
            <div className="space-y-3">
              {data.languages.map((e: Language, i: number) => (
                <RepeatCard
                  key={e.id}
                  title={e.name || `Language ${i + 1}`}
                  onRemove={() => remove("languages", e.id)}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Language">
                      <Input
                        value={e.name}
                        onChange={(ev) => updateArr("languages", e.id, { name: ev.target.value })}
                        placeholder="English"
                      />
                    </Field>
                    <Field label="Level">
                      <Input
                        value={e.level}
                        onChange={(ev) => updateArr("languages", e.id, { level: ev.target.value })}
                        placeholder="Professional"
                      />
                    </Field>
                  </div>
                </RepeatCard>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLanguage}
                className="w-full border-dashed"
                data-testid="button-add-language"
              >
                <Plus className="h-4 w-4" />
                Add language
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between border-t border-border pt-3 mt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => go(-1)}
          disabled={stepIndex === 0}
          data-testid="button-prev"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <span className="text-xs text-muted-foreground">
          {stepIndex + 1} / {STEPS.length}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => go(1)}
          disabled={stepIndex === STEPS.length - 1}
          data-testid="button-next"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
