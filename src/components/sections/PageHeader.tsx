import { Container } from "@/components/ui/Section";

export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden bg-brand-900">
      <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-brand-500/30" />
      <div aria-hidden className="absolute -right-6 -top-6 size-36 rounded-full bg-accent-400/40" />
      <Container className="relative py-16 sm:py-20">
        {eyebrow && (
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-accent-400">{eyebrow}</p>
        )}
        <h1 className="max-w-3xl text-4xl font-extrabold text-white sm:text-5xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{intro}</p>}
      </Container>
    </section>
  );
}
