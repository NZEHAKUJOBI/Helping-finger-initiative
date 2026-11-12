import { Container, Eyebrow } from "@/components/ui/Section";

export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div aria-hidden className="absolute -right-24 -top-28 hidden size-80 rounded-full bg-brand-500 md:block" />
      <div aria-hidden className="absolute -right-4 -top-8 hidden size-40 rounded-full bg-accent-400 md:block" />
      <Container className="relative pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div className="max-w-3xl animate-rise">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="text-5xl font-medium leading-[1.03] sm:text-6xl">{title}</h1>
          {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{intro}</p>}
        </div>
      </Container>
      <div aria-hidden className="flex h-1.5">
        <div className="flex-[3] bg-brand-500" />
        <div className="flex-1 bg-accent-400" />
      </div>
    </section>
  );
}
