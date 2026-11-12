"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconName } from "@/domain/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Overview", icon: "community" },
  { href: "/admin/newsletters", label: "Newsletters", icon: "news" },
  { href: "/admin/gallery", label: "Gallery", icon: "image" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
              active ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon name={item.icon} className={cn("size-5", active && "text-accent-300")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
