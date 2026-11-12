import type { ApproachStep } from "@/domain/types";

export function ApproachSteps({ steps }: { steps: ApproachStep[] }) {
  return (
    <ol className="grid gap-5 md:grid-cols-3">
      {steps.map((s) => (
        <li key={s.step} className="rounded-card border border-white/15 bg-white/5 p-7">
          <span className="inline-flex size-11 items-center justify-center rounded-full bg-accent-400 text-lg font-extrabold text-brand-900">
            {s.step}
          </span>
          <h3 className="mt-5 text-2xl font-extrabold">{s.title}</h3>
          <p className="mt-2 leading-relaxed text-white/80">{s.description}</p>
        </li>
      ))}
    </ol>
  );
}
