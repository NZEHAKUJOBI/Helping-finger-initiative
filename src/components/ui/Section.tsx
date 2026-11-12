import { cn } from "@/lib/cn";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10", className)}>{children}</div>;
}

type Tone = "cream" | "white" | "sand" | "forest";

const tones: Record<Tone, string> = {
  cream: "bg-cream",
  white: "bg-surface",
  sand: "bg-sand",
  forest: "grain bg-brand-900 text-white/85 [&_h2]:text-white [&_h3]:text-white",
};

interface SectionProps {
  id?: string;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}

export function Section({ id, tone = "cream", className, children }: SectionProps) {
  return (
    <section id={id} className={cn("relative py-20 sm:py-28", tones[tone], className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children, invert }: { children: React.ReactNode; invert?: boolean }) {
  return (
    <p
      className={cn(
        "mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]",
        invert ? "text-accent-300" : "text-brand-700",
      )}
    >
      <span aria-hidden className="h-0.5 w-8 rounded-full bg-accent-400" />
      {children}
    </p>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: string;
  align?: "left" | "center";
  invert?: boolean;
  action?: React.ReactNode;
}

export function SectionHeading({ eyebrow, title, intro, align = "left", invert, action }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-6 sm:mb-16",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "flex flex-col items-center")}>
        {eyebrow && <Eyebrow invert={invert}>{eyebrow}</Eyebrow>}
        <h2 className="text-4xl font-medium leading-[1.05] sm:text-5xl">{title}</h2>
        {intro && (
          <p className={cn("mt-5 text-lg leading-relaxed", invert ? "text-white/75" : "text-muted")}>{intro}</p>
        )}
      </div>
      {action}
    </div>
  );
}
