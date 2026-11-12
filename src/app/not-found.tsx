import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Section>
      <div className="mx-auto max-w-xl py-10 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-600">404</p>
        <h1 className="mt-3 text-4xl font-extrabold">Page not found</h1>
        <p className="mt-4 text-lg text-muted">The page you are looking for doesn&apos;t exist or has moved.</p>
        <ButtonLink href="/" className="mt-8">
          Back to home
        </ButtonLink>
      </div>
    </Section>
  );
}
