import { Suspense } from "react";
import { AdminShell } from "@/features/admin/AdminShell";

/** Session reads happen at request time, so the authenticated shell streams behind Suspense. */
export default function DashboardLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center text-muted">Loading…</div>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
