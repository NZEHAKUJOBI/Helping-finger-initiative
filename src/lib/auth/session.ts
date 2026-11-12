import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

/**
 * Minimal single-admin auth. The password and signing secret come from the environment:
 *   ADMIN_PASSWORD   — the admin password
 *   SESSION_SECRET   — 32+ random characters used to sign the session cookie
 * The cookie holds only an expiry and an HMAC signature; it is HTTP-only and SameSite=Lax.
 */

const COOKIE = "hf_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function config() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!password || !secret || secret.length < 32) return null;
  return { password, secret };
}

export function isAuthConfigured() {
  return config() !== null;
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  // Hash first so inputs have equal length and timing does not leak the password length.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input: string) {
  const cfg = config();
  return cfg ? safeEqual(input, cfg.password) : false;
}

export async function createSession() {
  const cfg = config();
  if (!cfg) throw new Error("Admin auth is not configured");
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE_SECONDS * 1000 })).toString("base64url");
  const store = await cookies();
  store.set(COOKIE, `${payload}.${sign(payload, cfg.secret)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  // Session checks are always request-time (they compare the expiry with the current time).
  await connection();
  const cfg = config();
  if (!cfg) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, cfg.secret))) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

/** Data Access Layer guard: call at the top of every admin page and server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
