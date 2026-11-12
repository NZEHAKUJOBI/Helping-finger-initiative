"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { GALLERY_CATEGORIES, type GalleryImage } from "@/domain/types";
import { clearFailures, isLocked, recordFailure } from "@/lib/auth/rateLimit";
import { checkPassword, createSession, destroySession, isAuthConfigured, requireAdmin } from "@/lib/auth/session";
import { GALLERY_TAG, galleryRepo, imageStorage } from "@/lib/gallery";
import { releaseImageIfUnused } from "@/lib/imageRefs";
import { readIncomingImages, uploadErrorMessage, type IncomingUpload } from "@/lib/uploads";

export interface ActionResult {
  status: "idle" | "success" | "error";
  message?: string;
}

/* ---------- Auth ---------- */

export async function login(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!isAuthConfigured()) {
    return {
      status: "error",
      message: "Admin access is not configured. Set ADMIN_PASSWORD and SESSION_SECRET (32+ characters) on the server.",
    };
  }
  const h = await headers();
  const key = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  if (isLocked(key)) {
    return { status: "error", message: "Too many attempts. Please wait 15 minutes and try again." };
  }

  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    recordFailure(key);
    return { status: "error", message: "Incorrect password." };
  }

  clearFailures(key);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- Gallery ---------- */

const MAX_FILES_PER_UPLOAD = 6;
const categorySchema = z.enum(GALLERY_CATEGORIES.map((c) => c.value) as [string, ...string[]]);
const captionSchema = z.string().trim().max(200, "Captions must be 200 characters or fewer.");

export async function uploadImages(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const captions = formData.getAll("captions").map(String);
  const category = categorySchema.safeParse(formData.get("category"));

  let incoming: IncomingUpload;
  try {
    incoming = await readIncomingImages(formData);
  } catch (error) {
    return { status: "error", message: uploadErrorMessage(error, "gallery") };
  }

  const files = incoming.images;
  const saved: GalleryImage[] = [];
  try {
    if (files.length === 0) return { status: "error", message: "Choose at least one photo." };
    if (files.length > MAX_FILES_PER_UPLOAD) {
      return { status: "error", message: `Upload up to ${MAX_FILES_PER_UPLOAD} photos at a time.` };
    }
    if (!category.success) return { status: "error", message: "Choose a category." };

    for (const [i, file] of files.entries()) {
      const caption = captionSchema.parse(captions[i] ?? "");
      const stored = await imageStorage.save(file);
      saved.push({
        ...stored,
        caption,
        category: category.data as GalleryImage["category"],
        // Stagger timestamps so batch order is preserved when sorting newest-first.
        createdAt: new Date(Date.now() + (files.length - i)).toISOString(),
      });
    }
    await galleryRepo.addMany(saved);
  } catch (error) {
    // Roll back any images written before the failure.
    await Promise.all(saved.map((s) => imageStorage.remove(s.id)));
    return { status: "error", message: uploadErrorMessage(error, "gallery") };
  } finally {
    await incoming.discard();
  }

  updateTag(GALLERY_TAG);
  return {
    status: "success",
    message: `${saved.length} photo${saved.length === 1 ? "" : "s"} added to the gallery.`,
  };
}

export async function updateImage(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z
    .object({ id: z.string().uuid(), caption: captionSchema, category: categorySchema })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };

  const { id, caption, category } = parsed.data;
  const updated = await galleryRepo.update(id, { caption, category: category as GalleryImage["category"] });
  if (!updated) return { status: "error", message: "That photo no longer exists." };

  updateTag(GALLERY_TAG);
  return { status: "success", message: "Saved." };
}

export async function deleteImage(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;

  const removed = await galleryRepo.remove(id.data);
  // A newsletter may still show this photo; only delete the files when nothing uses them.
  if (removed) await releaseImageIfUnused(removed.id);
  updateTag(GALLERY_TAG);
}
