import { cn } from "@/lib/cn";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

type Tone = "canvas" | "white" | "brand" | "tint";

const tones: Record<Tone, string> = {
  canvas: "bg-canvas",
  white: "bg-surface",
  brand: "bg-brand-900 text-white [&_h2]:text-white [&_h3]:text-white",
  tint: "bg-brand-50",
};

interface SectionProps {
  id?: string;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}

export function Section({ id, tone = "canvas", className, children }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", tones[tone], className)}>
      <Container>{children}</Container>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  invert?: boolean;
}

export function SectionHeading({ eyebrow, title, intro, align = "left", invert }: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 max-w-2xl sm:mb-14", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-bold uppercase tracking-[0.14em]",
            invert ? "text-accent-400" : "text-brand-600",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
      {intro && (
        <p className={cn("mt-4 text-lg leading-relaxed", invert ? "text-white/80" : "text-muted")}>{intro}</p>
      )}
    </div>
  );
}
