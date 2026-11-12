import type { ApproachStep } from "@/domain/types";

export function ApproachSteps({ steps }: { steps: ApproachStep[] }) {
  return (
    <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
      {/* Connecting line */}
      <div aria-hidden className="absolute left-7 right-7 top-7 hidden h-px bg-gradient-to-r from-accent-400 via-white/30 to-accent-400 md:block" />
      {steps.map((s) => (
        <li key={s.step} className="relative">
          <span className="relative inline-flex size-14 items-center justify-center rounded-full bg-accent-400 font-display text-2xl font-medium text-brand-950 ring-8 ring-brand-900">
            {s.step}
          </span>
          <h3 className="mt-6 text-3xl font-medium">{s.title}</h3>
          <p className="mt-3 max-w-xs leading-relaxed text-white/75">{s.description}</p>
        </li>
      ))}
    </ol>
  );
}
