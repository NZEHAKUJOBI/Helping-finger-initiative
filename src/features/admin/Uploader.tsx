"use client";

import { upload } from "@vercel/blob/client";
import { useActionState, useId, useRef, useState, startTransition } from "react";
import { uploadImages, type ActionResult } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { GALLERY_CATEGORIES } from "@/domain/types";
import { cn } from "@/lib/cn";

const MAX_FILES = 6;
const MAX_BYTES = 10 * 1024 * 1024;

interface Pending {
  key: string;
  file: File;
  preview: string;
  caption: string;
}

const initial: ActionResult = { status: "idle" };

type UploadAction = (prev: ActionResult, fd: FormData) => Promise<ActionResult>;

interface UploaderProps {
  /** Server action that receives `files` + `captions` and any other named fields in the form. */
  action?: UploadAction;
  /** Show the gallery category picker (and require a choice). */
  withCategory?: boolean;
  /**
   * Send photos straight from the browser to Vercel Blob, then pass only their pathnames to `action`.
   * Needed on Vercel, where a request to the site is limited to 4.5 MB.
   */
  direct?: boolean;
  /** Extra form controls (hidden ids, checkboxes) sent with the upload. */
  children?: React.ReactNode;
}

/** Uploads each photo to incoming/ in Vercel Blob and returns their pathnames. */
async function uploadToBlob(files: File[], onProgress: (done: number) => void): Promise<string[]> {
  let done = 0;
  return Promise.all(
    files.map(async (file) => {
      const ext = file.name.match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase() ?? "";
      const base = file.name.slice(0, file.name.length - ext.length).replace(/[^a-z0-9_-]+/gi, "-").slice(0, 60) || "photo";
      const blob = await upload(`incoming/${base}${ext}`, file, {
        access: "private",
        handleUploadUrl: "/api/admin/upload",
        contentType: file.type || "image/heic",
      });
      onProgress(++done);
      return blob.pathname;
    }),
  );
}

export function Uploader({ action = uploadImages, withCategory = true, direct = false, children }: UploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Pending[]>([]);
  const [category, setCategory] = useState("");
  const [dragging, setDragging] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [sent, setSent] = useState<number | null>(null);

  const clear = () => {
    items.forEach((i) => URL.revokeObjectURL(i.preview));
    setItems([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const [state, formAction, pending] = useActionState(async (prev: ActionResult, fd: FormData): Promise<ActionResult> => {
    if (direct) {
      const files = fd.getAll("files") as File[];
      fd.delete("files");
      try {
        setSent(0);
        for (const pathname of await uploadToBlob(files, setSent)) fd.append("blobs", pathname);
      } catch (error) {
        console.error("[uploader] direct upload failed", error);
        return { status: "error", message: "A photo could not be uploaded. Check your connection and try again." };
      } finally {
        setSent(null);
      }
    }
    const result = await action(prev, fd);
    if (result.status === "success") clear();
    return result;
  }, initial);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setClientError(null);
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/") || /\.hei[cf]$/i.test(f.name));
    const tooBig = incoming.filter((f) => f.size > MAX_BYTES);
    const accepted = incoming.filter((f) => f.size <= MAX_BYTES);
    const room = MAX_FILES - items.length;

    const errors: string[] = [];
    if (tooBig.length) errors.push(`${tooBig.length} file(s) over 10 MB were skipped.`);
    if (accepted.length > room) errors.push(`Only ${MAX_FILES} photos per upload — extra files were skipped.`);
    if (errors.length) setClientError(errors.join(" "));

    setItems((prev) => [
      ...prev,
      ...accepted.slice(0, Math.max(room, 0)).map((file) => ({
        key: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        caption: "",
      })),
    ]);
  }

  function removeItem(key: string) {
    setItems((prev) => {
      const item = prev.find((i) => i.key === key);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.key !== key);
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) return setClientError("Choose at least one photo.");
    if (withCategory && !category) return setClientError("Choose a category.");
    // Named controls (category, hidden fields, checkboxes) come from the form itself.
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    for (const item of items) {
      fd.append("files", item.file);
      fd.append("captions", item.caption);
    }
    startTransition(() => formAction(fd));
  }

  const message = clientError ?? (state.status !== "idle" ? state.message : null);
  const isError = !!clientError || state.status === "error";

  return (
    <form onSubmit={submit} className="rounded-card border border-line bg-white p-5 shadow-soft sm:p-7">
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragging ? "border-brand-500 bg-brand-50" : "border-line bg-cream hover:border-brand-300",
        )}
      >
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-white text-brand-700 shadow-soft">
          <Icon name="upload" />
        </span>
        <span className="mt-4 font-semibold text-brand-900">Drop photos here or click to browse</span>
        <span className="mt-1 text-sm text-muted">JPG, PNG, WebP or HEIC · up to 10 MB each · {MAX_FILES} at a time</span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
        />
      </label>

      {items.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.key} className="overflow-hidden rounded-xl border border-line">
              <div className="relative aspect-[4/3] bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element -- local preview blob */}
                <img src={item.preview} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  aria-label={`Remove ${item.file.name}`}
                  className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <Icon name="close" className="size-4" />
                </button>
              </div>
              <input
                type="text"
                value={item.caption}
                maxLength={200}
                onChange={(e) =>
                  setItems((prev) => prev.map((p) => (p.key === item.key ? { ...p, caption: e.target.value } : p)))
                }
                placeholder="Caption (optional)"
                aria-label={`Caption for ${item.file.name}`}
                className="w-full border-t border-line px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-200"
              />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        {withCategory && (
          <div className="sm:w-64">
            <label htmlFor={`${inputId}-cat`} className="mb-1.5 block text-sm font-semibold text-brand-900">
              Category
            </label>
            <select
              id={`${inputId}-cat`}
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
            >
              <option value="">Select a category…</option>
              {GALLERY_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        )}
        {children}
        <Button type="submit" disabled={pending || items.length === 0}>
          <Icon name="upload" className="size-4" />
          {pending
            ? sent !== null
              ? `Sending ${sent} of ${items.length}…`
              : "Saving…"
            : `Upload ${items.length || ""} photo${items.length === 1 ? "" : "s"}`}
        </Button>
        {items.length > 0 && !pending && (
          <Button type="button" variant="ghost" onClick={clear}>
            Clear
          </Button>
        )}
      </div>

      {message && (
        <p
          role={isError ? "alert" : "status"}
          className={cn(
            "mt-4 rounded-xl px-4 py-3 text-sm font-medium",
            isError ? "bg-red-50 text-alert-500" : "bg-brand-50 text-brand-800",
          )}
        >
          {message}
        </p>
      )}
    </form>
  );
}
