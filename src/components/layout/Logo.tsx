import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

export function Logo({ invert = false, href = "/" }: { invert?: boolean; href?: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
      <span className="rounded-lg bg-white p-1 shadow-soft ring-1 ring-black/5">
        <Image src="/brand/logo.png" alt="" width={328} height={280} priority className="h-10 w-auto sm:h-11" />
      </span>
      <span className="whitespace-nowrap leading-none">
        <span
          className={cn(
            "block font-display text-[1.15rem] font-semibold tracking-tight sm:text-xl",
            invert ? "text-white" : "text-brand-900",
          )}
        >
          Helping Fingers
        </span>
        <span
          className={cn(
            "mt-1 block text-[10px] font-bold uppercase tracking-[0.22em]",
            invert ? "text-accent-300" : "text-brand-600",
          )}
        >
          Initiative Association
        </span>
      </span>
    </Link>
  );
}
