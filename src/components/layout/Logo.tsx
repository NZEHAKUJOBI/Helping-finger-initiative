import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export function Logo({ invert = false }: { invert?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} — home`}>
      <Image
        src="/brand/logo.png"
        alt=""
        width={328}
        height={280}
        priority
        className="h-12 w-auto rounded-sm bg-white sm:h-14"
      />
      <span className="leading-tight">
        <span className={`block text-base font-extrabold sm:text-lg ${invert ? "text-white" : "text-brand-900"}`}>
          Helping Fingers
        </span>
        <span className={`block text-xs font-semibold sm:text-sm ${invert ? "text-white/70" : "text-brand-700"}`}>
          Initiative Association
        </span>
      </span>
    </Link>
  );
}
