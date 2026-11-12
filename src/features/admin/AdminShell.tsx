import Image from "next/image";
import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { Icon } from "@/components/ui/Icon";
import { requireAdmin } from "@/lib/auth/session";
import { AdminNav } from "./AdminNav";

export async function AdminShell({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="grain flex flex-col bg-brand-950 text-white lg:sticky lg:top-0 lg:h-dvh lg:w-64">
        <div className="flex items-center justify-between gap-3 px-5 py-5 lg:block">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="rounded-md bg-white p-0.5">
              <Image src="/brand/logo.png" alt="" width={328} height={280} className="h-8 w-auto" />
            </span>
            <span>
              <span className="block font-display text-lg leading-none">Helping Fingers</span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-accent-300">Admin</span>
            </span>
          </Link>
        </div>
        <AdminNav />
        <div className="mt-auto hidden space-y-1 border-t border-white/10 p-3 lg:block">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white"
          >
            <Icon name="arrow-right" className="size-4 -rotate-45" /> View website
          </Link>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white">
              <Icon name="arrow-right" className="size-4 rotate-180" /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex justify-end gap-2 border-b border-line bg-white px-4 py-2 lg:hidden">
          <Link href="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-brand-700">
            View website
          </Link>
          <form action={logout}>
            <button className="rounded-lg px-3 py-2 text-sm font-semibold text-brand-700">Sign out</button>
          </form>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">{children}</div>
      </div>
    </div>
  );
}
