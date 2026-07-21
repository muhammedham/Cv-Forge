# CV Forge — Spec Document

**CV Forge** is a single-page web app that builds a clean, professional CV/resume by answering a guided set of questions. Answer the questions → watch a live CV render → print or save it as a PDF. No account, no backend, no data leaves the browser.

## Purpose

Turn the chore of writing a CV into a fast, guided flow. Instead of staring at a blank document, the user answers targeted questions (one section at a time) and immediately sees a polished, ATS-friendly resume update in a live preview pane. One click exports a print-ready PDF.

## Target Users

- Job seekers who want a structured CV quickly without wrestling with Word/Canva templates
- Students and new graduates with limited resume-writing experience
- Career switchers who want a clean, recruiter-friendly layout
- Anyone who wants a private, offline-friendly CV builder (no sign-up, no data sent anywhere)

## MVP Features

1. **Guided multi-step form (wizard)** — one focused section per step:
   - Personal info (name, title, email, phone, location, website/LinkedIn)
   - Professional summary / objective (with one-click starter suggestions based on the entered job title)
   - Work experience (add/remove repeated entries: role, company, dates, bullets)
   - Education (add/remove entries: degree, school, dates, details)
   - Skills (tag-style, comma separated)
   - Projects (add/remove optional entries)
   - Languages (optional)
2. **Live CV preview** — updates instantly as the user types, rendered in a real A4-style document layout.
3. **Accent color picker** — choose the heading/accent color to personalize the CV.
4. **Summary suggestion** — rule-based starter text generated from the target title (no fake AI; transparently a template helper).
5. **In-session draft** — the entered data lives in React state for the session; a “Sample” button loads example data and “Reset” clears it. (Browser storage is blocked inside the sandboxed preview iframe, so the draft is intentionally in-memory and won’t survive a page refresh.)
6. **Load sample data** — fill the form with example content so users can see how a complete CV looks.
7. **Reset / clear** — wipe the form and start over.
8. **Print / Save as PDF** — print-optimized CSS; the browser's "Save as PDF" produces a clean, margin-correct document (only the CV prints, not the app chrome).
9. **Dark mode** — UI chrome supports light/dark; the printed CV is always on a clean light sheet.

## Tech Stack

| Layer        | Choice                                            | Why                                                    |
| ------------ | ------------------------------------------------- | ------------------------------------------------------ |
| Framework    | React 18 + TypeScript                             | Component model, broad ecosystem                       |
| Build tool   | Vite                                              | Fast dev server + optimized production bundle          |
| Styling      | Tailwind CSS v3 + shadcn/ui primitives           | Consistent, accessible UI, fast to build               |
| Icons        | lucide-react                                      | Clean, lightweight icon set                            |
| Routing      | wouter (hash-based)                               | Works inside sandboxed iframes after deploy           |
| Persistence  | In-memory React state (no backend, fully client-side) | Sandbox-friendly; private, no storage APIs |
| PDF export   | Native browser print (`window.print`) + print CSS | No heavy PDF libs, pixel-perfect, free                |
| Deploy       | Static build on S3-backed host via deploy tool    | Zero server cost, instant                             |

## Architecture

- **Client-only SPA.** No server, no database, no API calls. All state lives in React.
- **Single source of truth** — a `CvData` object held in a top-level `useState`, passed to both the form and the preview. Editing any field updates the preview instantly.
- **In-memory only** — state lives in React for the session (no `localStorage`/cookies, which are blocked in the sandboxed preview iframe).
- **Print isolation** — a `@media print` stylesheet hides app chrome (form, header, controls) and shows only the CV sheet with correct page margins.

## Data & Privacy

- All data stays in the user's browser session (in-memory). Nothing is uploaded, transmitted, or stored on a server.
- No analytics, no cookies, no third-party trackers.

## Deployment

- Production build: `npm run build` → outputs static assets to `dist/public`.
- Deployed as a static site (S3-backed) reachable via a private preview URL.
- The same bundle can be published to a permanent `*.pplx.app` subdomain later if desired.

## Future Improvements

- Multiple CV templates / layouts (classic, two-column, modern)
- Real AI-assisted bullet rewriting (opt-in, with a user-provided API key)
- Drag-and-drop reordering of experience/education entries
- Export to JSON / import from JSON for portability
- Multi-language CV (e.g., Turkish/English toggle)
- Photo/avatar option for regions where it's customary
