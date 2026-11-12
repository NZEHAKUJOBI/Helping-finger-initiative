import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/features/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="grid flex-1 lg:grid-cols-2">
      <section className="grain relative hidden overflow-hidden bg-brand-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="absolute -right-32 -top-32 size-[28rem] rounded-full bg-brand-500/40" />
        <div aria-hidden className="absolute -right-8 -top-8 size-48 rounded-full bg-accent-400/70" />
        <Link href="/" className="relative flex items-center gap-3">
          <span className="rounded-lg bg-white p-1">
            <Image src="/brand/logo.png" alt="" width={328} height={280} className="h-10 w-auto" />
          </span>
          <span className="font-display text-xl">Helping Fingers</span>
        </Link>
        <div className="relative max-w-md">
          <p className="font-display text-4xl leading-tight">
            Share the work. <em className="text-accent-300">Show the impact.</em>
          </p>
          <p className="mt-4 text-white/70">
            Upload photos from outreaches, trainings and community events. They appear on the public
            gallery instantly.
          </p>
        </div>
        <p className="relative text-sm text-white/50">Content management · Staff only</p>
      </section>

      <section className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-medium">Admin sign in</h1>
          <p className="mt-2 text-muted">Enter the admin password to manage the website.</p>
          <LoginForm />
          <Link href="/" className="mt-10 inline-block text-sm font-semibold text-brand-700 hover:underline">
            ← Back to website
          </Link>
        </div>
      </section>
    </main>
  );
}
