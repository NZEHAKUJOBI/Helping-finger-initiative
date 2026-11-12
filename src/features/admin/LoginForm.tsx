"use client";

import { useActionState, useState } from "react";
import { login, type ActionResult } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";

const initial: ActionResult = { status: "idle" };

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-brand-900">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            autoFocus
            aria-invalid={state.status === "error" || undefined}
            aria-describedby={state.message ? "login-error" : undefined}
            className="h-12 w-full rounded-xl border border-line bg-white px-4 pr-20 text-base focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute inset-y-0 right-2 my-auto h-8 rounded-lg px-3 text-xs font-semibold text-brand-700 hover:bg-brand-50"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
        {state.message && (
          <p id="login-error" role="alert" className="mt-2 text-sm text-alert-500">
            {state.message}
          </p>
        )}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
