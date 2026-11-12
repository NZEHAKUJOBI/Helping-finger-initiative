"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GALLERY_CATEGORIES, type GalleryCategory, type GalleryImage } from "@/domain/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const labelFor = (value: GalleryCategory) => GALLERY_CATEGORIES.find((c) => c.value === value)?.label ?? value;

export function GalleryBrowser({ images, filters = true }: { images: GalleryImage[]; filters?: boolean }) {
  const [active, setActive] = useState<GalleryCategory | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const available = useMemo(
    () => GALLERY_CATEGORIES.filter((c) => images.some((i) => i.category === c.value)),
    [images],
  );
  const visible = useMemo(
    () => (active === "all" ? images : images.filter((i) => i.category === active)),
    [images, active],
  );

  return (
    <>
      {filters && available.length > 1 && (
        <div role="group" aria-label="Filter by category" className="mb-10 flex flex-wrap gap-2">
          {[{ value: "all" as const, label: "All photos" }, ...available].map((c) => (
            <button
              key={c.value}
              type="button"
              aria-pressed={active === c.value}
              onClick={() => setActive(c.value)}
              className={cn(
                "h-10 rounded-full px-5 text-sm font-semibold transition-colors",
                active === c.value
                  ? "bg-brand-800 text-white"
                  : "bg-white text-brand-900 ring-1 ring-line hover:ring-brand-300",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {visible.map((img, i) => (
          <li key={img.id} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative block w-full overflow-hidden rounded-card bg-sand shadow-soft"
              aria-label={`Open photo${img.caption ? `: ${img.caption}` : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised upload */}
              <img
                src={img.thumbSrc}
                alt={img.caption}
                width={img.width}
                height={img.height}
                loading="lazy"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-x-0 bottom-0 flex translate-y-2 flex-col items-start gap-1 bg-gradient-to-t from-brand-950/85 via-brand-950/40 to-transparent p-4 pt-12 text-left opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                <span className="rounded-full bg-accent-400 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-950">
                  {labelFor(img.category)}
                </span>
                {img.caption && <span className="text-sm font-medium text-white">{img.caption}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null && (
        <Lightbox images={visible} index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}

function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: GalleryImage[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const img = images[index];
  const go = useCallback(
    (delta: number) => onIndexChange((index + delta + images.length) % images.length),
    [index, images.length, onIndexChange],
  );

  // Open as a modal on mount. No close() in cleanup: closing fires onClose, and React's
  // dev double-mount would then immediately dismiss the viewer. Unmounting ends the modal anyway.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label="Photo viewer"
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-brand-950/95 p-0 text-white backdrop:bg-transparent"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4 text-sm text-white/70">
          <span>
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/10"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-optimised upload */}
          <img
            key={img.id}
            src={img.src}
            alt={img.caption}
            className="max-h-full max-w-full animate-rise rounded-lg object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:left-6"
              >
                <Icon name="chevron-left" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:right-6"
              >
                <Icon name="chevron-right" />
              </button>
            </>
          )}
        </div>
        <div className="min-h-20 p-6 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-300">{labelFor(img.category)}</span>
          {img.caption && <p className="mx-auto mt-2 max-w-2xl font-display text-xl">{img.caption}</p>}
        </div>
      </div>
    </dialog>
  );
}
