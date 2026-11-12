"use server";

import { randomUUID } from "node:crypto";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { GALLERY_CATEGORIES, type GalleryCategory, type GalleryImage, type NewsletterPhoto } from "@/domain/types";
import { requireAdmin } from "@/lib/auth/session";
import { GALLERY_TAG, galleryRepo, imageStorage } from "@/lib/gallery";
import { releaseImageIfUnused } from "@/lib/imageRefs";
import { NEWSLETTER_TAG, newsletterRepo, slugify } from "@/lib/newsletter";
import { readIncomingImages, uploadErrorMessage, type IncomingUpload } from "@/lib/uploads";
import type { ActionResult } from "./actions";

const MAX_FILES_PER_UPLOAD = 6;
const MAX_PHOTOS_PER_ISSUE = 30;

const idSchema = z.string().uuid();
const categorySchema = z.enum(GALLERY_CATEGORIES.map((c) => c.value) as [GalleryCategory, ...GalleryCategory[]]);
const captionSchema = z.string().trim().max(200, "Captions must be 200 characters or fewer.");
const titleSchema = z.string().trim().min(3, "Give the newsletter a title.").max(150, "Keep the title under 150 characters.");

const today = () => new Date().toISOString().slice(0, 10);

function firstIssue(error: z.ZodError) {
  return error.issues[0]?.message ?? "Please check the form.";
}

/* ---------- Issues ---------- */

export async function createNewsletter(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const title = titleSchema.safeParse(formData.get("title"));
  if (!title.success) return { status: "error", message: firstIssue(title.error) };

  const existing = new Set((await newsletterRepo.list()).map((n) => n.slug));
  const base = slugify(title.data);
  let slug = base;
  for (let i = 2; existing.has(slug); i++) slug = `${base}-${i}`;

  const now = new Date().toISOString();
  const id = randomUUID();
  await newsletterRepo.create({
    id,
    slug,
    title: title.data,
    summary: "",
    body: "",
    eventDate: today(),
    location: "",
    category: "events",
    coverId: null,
    photos: [],
    status: "draft",
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
  });
  redirect(`/admin/newsletters/${id}`);
}

const saveSchema = z.object({
  id: idSchema,
  title: titleSchema,
  summary: z.string().trim().max(300, "Keep the summary under 300 characters."),
  body: z.string().trim().max(20000, "The story is too long (20,000 characters max)."),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose the date of the activity."),
  location: z.string().trim().max(120, "Keep the location under 120 characters."),
  category: categorySchema,
  intent: z.enum(["save", "publish", "unpublish"]),
});

export async function saveNewsletter(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = saveSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: firstIssue(parsed.error) };
  const { id, intent, ...fields } = parsed.data;

  if (intent === "publish") {
    if (fields.summary.length < 10) return { status: "error", message: "Add a short summary before publishing." };
    if (fields.body.length < 20) return { status: "error", message: "Write the story before publishing." };
  }

  const updated = await newsletterRepo.update(id, (item) => {
    Object.assign(item, fields);
    if (intent === "publish") {
      item.status = "published";
      item.publishedAt ??= new Date().toISOString();
    } else if (intent === "unpublish") {
      item.status = "draft";
    }
  });
  if (!updated) return { status: "error", message: "That newsletter no longer exists." };

  updateTag(NEWSLETTER_TAG);
  const message =
    intent === "publish"
      ? "Published. It is now on the website and the home page."
      : intent === "unpublish"
        ? "Moved back to drafts. It is no longer on the website."
        : updated.status === "published"
          ? "Saved. The website is updated."
          : "Draft saved.";
  return { status: "success", message };
}

export async function deleteNewsletter(formData: FormData) {
  await requireAdmin();
  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return;

  const removed = await newsletterRepo.remove(id.data);
  if (removed) {
    for (const photo of removed.photos) await releaseImageIfUnused(photo.id);
  }
  updateTag(NEWSLETTER_TAG);
  redirect("/admin/newsletters");
}

/* ---------- Photos ---------- */

export async function uploadNewsletterPhotos(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return { status: "error", message: "That newsletter no longer exists." };

  const captions = formData.getAll("captions").map(String);
  const addToGallery = formData.get("addToGallery") === "on";

  let incoming: IncomingUpload;
  try {
    incoming = await readIncomingImages(formData);
  } catch (error) {
    return { status: "error", message: uploadErrorMessage(error, "newsletter") };
  }

  const files = incoming.images;
  const saved: NewsletterPhoto[] = [];
  try {
    const issue = await newsletterRepo.get(id.data);
    if (!issue) return { status: "error", message: "That newsletter no longer exists." };
    if (files.length === 0) return { status: "error", message: "Choose at least one photo." };
    if (files.length > MAX_FILES_PER_UPLOAD) {
      return { status: "error", message: `Upload up to ${MAX_FILES_PER_UPLOAD} photos at a time.` };
    }
    if (issue.photos.length + files.length > MAX_PHOTOS_PER_ISSUE) {
      return { status: "error", message: `A newsletter can hold up to ${MAX_PHOTOS_PER_ISSUE} photos.` };
    }

    for (const [i, file] of files.entries()) {
      const caption = captionSchema.parse(captions[i] ?? "");
      const stored = await imageStorage.save(file);
      saved.push({ ...stored, caption });
    }
    const updated = await newsletterRepo.update(id.data, (item) => {
      item.photos.push(...saved);
      item.coverId ??= saved[0]?.id ?? null;
    });
    if (!updated) throw new Error("Newsletter removed during upload");

    if (addToGallery) {
      const now = Date.now();
      await galleryRepo.addMany(
        saved.map<GalleryImage>((p, i) => ({
          ...p,
          category: issue.category,
          createdAt: new Date(now + (saved.length - i)).toISOString(),
        })),
      );
      updateTag(GALLERY_TAG);
    }
  } catch (error) {
    // Roll back images written before the failure.
    await Promise.all(saved.map((s) => imageStorage.remove(s.id)));
    return { status: "error", message: uploadErrorMessage(error, "newsletter") };
  } finally {
    await incoming.discard();
  }

  updateTag(NEWSLETTER_TAG);
  const n = saved.length;
  return {
    status: "success",
    message: `${n} photo${n === 1 ? "" : "s"} added${addToGallery ? " to this newsletter and the gallery" : ""}.`,
  };
}

const photoRefSchema = z.object({ id: idSchema, photoId: idSchema });

export async function updateNewsletterPhoto(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = photoRefSchema.extend({ caption: captionSchema }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: firstIssue(parsed.error) };
  const { id, photoId, caption } = parsed.data;

  let found = false;
  await newsletterRepo.update(id, (item) => {
    const photo = item.photos.find((p) => p.id === photoId);
    if (photo) {
      photo.caption = caption;
      found = true;
    }
  });
  if (!found) return { status: "error", message: "That photo no longer exists." };

  updateTag(NEWSLETTER_TAG);
  return { status: "success", message: "Saved." };
}

export async function setNewsletterCover(formData: FormData) {
  await requireAdmin();
  const parsed = photoRefSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const { id, photoId } = parsed.data;
  await newsletterRepo.update(id, (item) => {
    if (item.photos.some((p) => p.id === photoId)) item.coverId = photoId;
  });
  updateTag(NEWSLETTER_TAG);
}

export async function removeNewsletterPhoto(formData: FormData) {
  await requireAdmin();
  const parsed = photoRefSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const { id, photoId } = parsed.data;

  await newsletterRepo.update(id, (item) => {
    item.photos = item.photos.filter((p) => p.id !== photoId);
    if (item.coverId === photoId) item.coverId = item.photos[0]?.id ?? null;
  });
  await releaseImageIfUnused(photoId);
  updateTag(NEWSLETTER_TAG);
}
