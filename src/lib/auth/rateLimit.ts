/**
 * Best-effort, in-memory login throttle (single server process).
 * 5 failed attempts per key → locked for 15 minutes.
 */
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; lockedUntil: number }>();

export function isLocked(key: string) {
  const entry = attempts.get(key);
  return !!entry && entry.lockedUntil > Date.now();
}

export function recordFailure(key: string) {
  const entry = attempts.get(key) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCK_MS;
    entry.count = 0;
  }
  attempts.set(key, entry);
}

export function clearFailures(key: string) {
  attempts.delete(key);
}
