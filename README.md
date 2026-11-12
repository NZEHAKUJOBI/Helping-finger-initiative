# Helping Fingers Initiative Association — Website

Website for Helping Fingers Initiative Association, Birnin Kebbi, Kebbi State, Nigeria.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · Zod · sharp

## Getting started

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD and SESSION_SECRET
npm run dev
```

Open http://localhost:3000 — the admin area is at http://localhost:3000/admin.

| Script | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |

## Admin area & gallery

- `/admin/login` — sign in with `ADMIN_PASSWORD`. Sessions are a signed, HTTP-only cookie (7 days), signed with `SESSION_SECRET` (32+ characters). Five wrong attempts lock sign-in for 15 minutes.
- `/admin/gallery` — upload up to 6 photos at a time (JPG/PNG/WebP/HEIC, 10 MB each), add captions and a category, edit or delete photos.
- Uploads are auto-rotated, resized (1920px full + 720px thumbnail, WebP) and stripped of EXIF data, including phone GPS location.
- Photos appear immediately on `/gallery` and on the home page (hero collage + "Our work in pictures").

### Where photos are stored

Images and the gallery index (`gallery.json`) are written to `STORAGE_DIR` (default `./storage`, git-ignored) and served by `/uploads/[file]`.

**Production needs persistent disk.** Host on a VPS, Render (with a disk), Railway (with a volume) or Docker with a mounted volume, and point `STORAGE_DIR` at it. Serverless hosts such as Vercel have no persistent filesystem — on those, implement `ImageStorage` (e.g. Cloudinary/S3) and `GalleryRepository` (e.g. Postgres) and swap them in `src/lib/gallery/index.ts`.

Back up `STORAGE_DIR` — it is the only copy of uploaded photos.

## Architecture

```
src/
├─ app/
│  ├─ (site)/          Public pages (shared header/footer layout)
│  ├─ admin/           Login, dashboard, gallery manager + server actions
│  └─ uploads/[file]/  Serves uploaded images from STORAGE_DIR
├─ content/            All site copy as typed data (edit text here, not in JSX)
├─ domain/             Types and Zod schemas (framework-free)
├─ lib/
│  ├─ auth/            Session cookie (HMAC-signed) + login throttle
│  ├─ content/         Repository: ContentRepository + StaticContentRepository
│  ├─ gallery/         ImageStorage (local disk + sharp) + GalleryRepository (JSON)
│  ├─ mail/            Adapter for form notifications (console in dev)
│  └─ donations/       Strategy interface for online giving (Paystack/Flutterwave later)
├─ features/
│  ├─ admin/           Admin shell, uploader, photo cards, login form
│  ├─ gallery/         Public masonry gallery + lightbox
│  └─ forms/           Config-driven forms + server actions (contact, volunteer, partner)
└─ components/
   ├─ ui/              Atoms: Button, Card, Icon, Section/Eyebrow
   ├─ sections/        Hero, ImpactStrip, ProgrammeGrid, QuoteBand, ApproachSteps, …
   └─ layout/          TopBar, Header, Footer, Logo
```

### Patterns

- **Content/presentation separation.** Copy lives in `src/content`; components only receive typed props.
- **Repository.** Pages call `content.getProgrammes()`, `galleryRepo.list()` etc. Storage can change without touching pages.
- **Adapter/Strategy.** `ImageStorage`, `MailProvider` and `DonationProvider` hide infrastructure behind interfaces.
- **Data Access Layer.** `requireAdmin()` guards every admin page *and* every admin server action.
- **Cache + tag invalidation.** Public gallery reads use `"use cache"` + `cacheTag("gallery")`; admin actions call `updateTag("gallery")`.
- **Schema-first forms.** One Zod schema per form validates on the server and gives the TypeScript type.

### Design system

- Colours from the letterhead, defined once as tokens in `src/app/globals.css` (`brand-*`, `accent-*`, `cream`, `sand`).
- Type: **Fraunces** (display serif) + **Plus Jakarta Sans** (body), self-hosted via `@fontsource-variable`.
- Motifs: the letterhead's green/yellow arcs and footer band, arch-shaped photo frames.

## Outstanding content

- Official email address and social media handles (`src/content/site.ts`)
- High-resolution / vector logo (currently cropped from the letterhead: `public/brand/logo.png`)
- Real photos — upload through `/admin/gallery`
- Bank details or payment provider for online donations
- Email delivery provider for form submissions
