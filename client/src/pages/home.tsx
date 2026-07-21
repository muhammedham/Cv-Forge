import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, RotateCcw, FileDown, Sparkles, ScanText } from "lucide-react";
import CvForm from "@/components/CvForm";
import CvPreview from "@/components/CvPreview";
import ThemeToggle from "@/components/ThemeToggle";
import { useCvData } from "@/lib/cv";

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="2" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="2.2" />
      <path d="M9 9h14M9 14h14M9 19h9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="22" cy="22" r="5.5" fill="var(--cv-logo-accent, #2563eb)" />
      <path d="M19.5 22l2 2 3.5-3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  const { data, setData, reset, loadSample } = useCvData();
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [fitOnePage, setFitOnePage] = useState(true);

  // Guarantee the printed CV fits on a single A4 page.
  const PAGE_PX = 1122; // A4 height at 96dpi
  useEffect(() => {
    if (!fitOnePage) return;
    const apply = () => {
      const sheet = document.getElementById("cv-sheet");
      if (!sheet) return;
      sheet.style.transform = "";
      sheet.style.transformOrigin = "";
      const h = sheet.getBoundingClientRect().height;
      if (h > PAGE_PX) {
        sheet.style.transform = `scale(${PAGE_PX / h})`;
        sheet.style.transformOrigin = "top center";
      }
    };
    const clear = () => {
      const sheet = document.getElementById("cv-sheet");
      if (sheet) {
        sheet.style.transform = "";
        sheet.style.transformOrigin = "";
      }
    };
    window.addEventListener("beforeprint", apply);
    window.addEventListener("afterprint", clear);
    return () => {
      window.removeEventListener("beforeprint", apply);
      window.removeEventListener("afterprint", clear);
      clear();
    };
  }, [fitOnePage]);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="text-primary">
              <Logo />
            </span>
            <div className="leading-tight">
              <h1 className="text-base font-bold tracking-tight" style={{ ["--cv-logo-accent" as string]: data.accent }}>
                CV Forge
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Answer questions → generate CV → save as PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={loadSample} className="flex" data-testid="button-sample">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Sample</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground" data-testid="button-reset">
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
            <Button
              variant={fitOnePage ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFitOnePage((v) => !v)}
              className="hidden sm:flex"
              data-testid="button-fit"
              title="Shrink the CV to fit one printed page"
            >
              <ScanText className="h-4 w-4" />
              Fit 1 page
            </Button>
            <ThemeToggle />
            <Button size="sm" onClick={handlePrint} data-testid="button-print">
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print / Save PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile view toggle */}
      <div className="md:hidden sticky top-[57px] z-20 flex gap-1 border-b border-border bg-background px-4 py-2 print:hidden">
        <button
          onClick={() => setMobileView("edit")}
          className={`flex-1 rounded-md py-1.5 text-sm font-medium ${
            mobileView === "edit" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setMobileView("preview")}
          className={`flex-1 rounded-md py-1.5 text-sm font-medium ${
            mobileView === "preview" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          Preview
        </button>
      </div>

      {/* Main layout */}
      <main className="mx-auto max-w-[1400px] px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {/* Form pane */}
          <section
            className={`${mobileView === "edit" ? "block" : "hidden"} md:block print:hidden`}
            aria-label="CV editor"
          >
            <div className="rounded-xl border border-border bg-card p-4 md:p-5">
              <div className="mb-3">
                <h2 className="text-lg font-semibold">Build your CV</h2>
                <p className="text-xs text-muted-foreground">
                  Fill the sections — your CV updates live on the right.
                </p>
              </div>
              <CvForm data={data} setData={setData} />
            </div>
          </section>

          {/* Preview pane */}
          <section
            className={`${mobileView === "preview" ? "block" : "hidden"} md:block`}
            aria-label="CV preview"
          >
            <div className="mb-2 flex items-center justify-between print:hidden">
              <span className="text-xs font-medium text-muted-foreground">Live preview</span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Tip: use “Print / Save PDF” → Save as PDF
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              <div className="cv-scroll">
                <CvPreview data={data} />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-[1400px] px-4 py-6 text-center print:hidden">
        <p className="text-xs text-muted-foreground">
          <FileDown className="inline h-3 w-3" /> Your data stays in your browser — nothing is uploaded. Built with React + Vite + Tailwind.
        </p>
      </footer>
    </div>
  );
}
