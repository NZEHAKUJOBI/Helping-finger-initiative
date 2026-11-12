import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageHeader } from "@/components/sections/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { content } from "@/lib/content";

export async function generateStaticParams() {
  const programmes = await content.getProgrammes();
  return programmes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/programmes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const programme = await content.getProgramme(slug);
  return programme ? { title: programme.title, description: programme.summary } : {};
}

export default async function ProgrammePage({ params }: PageProps<"/programmes/[slug]">) {
  const { slug } = await params;
  const [programme, all, joinUs] = await Promise.all([
    content.getProgramme(slug),
    content.getProgrammes(),
    content.getJoinUs(),
  ]);
  if (!programme) notFound();

  const others = all.filter((p) => p.slug !== programme.slug);

  return (
    <>
      <PageHeader eyebrow={`Programme ${programme.letter}`} title={programme.title} intro={programme.summary} />
      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6 text-lg leading-relaxed text-ink/80">
            {programme.details.map((p, i) => (
              <p key={p} className={i === 0 ? "font-display text-2xl leading-snug text-brand-900 sm:text-3xl" : ""}>
                {p}
              </p>
            ))}
            <Link href="/programmes" className="inline-flex items-center gap-2 pt-4 font-semibold text-brand-700">
              <Icon name="arrow-right" className="size-4 rotate-180" /> All programmes
            </Link>
          </div>
          <aside aria-label="Other programmes" className="self-start rounded-card bg-sand p-6">
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Other programmes</h2>
            <ul className="mt-4 space-y-1">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/programmes/${p.slug}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 font-medium text-brand-900 hover:bg-white"
                  >
                    <Icon name={p.icon} className="size-5 shrink-0 text-brand-600" />
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>
      <CTABanner {...joinUs} />
    </>
  );
}
