import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grain flex flex-1 items-center justify-center bg-cream px-4 py-24">
      <div className="max-w-md text-center">
        <p className="font-display text-7xl font-semibold text-brand-200">404</p>
        <h1 className="mt-4 text-4xl font-semibold">This page has wandered off</h1>
        <p className="mt-4 text-lg text-muted">The page you are looking for doesn&apos;t exist or has moved.</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-brand-800 px-6 font-semibold text-white hover:bg-brand-900"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
