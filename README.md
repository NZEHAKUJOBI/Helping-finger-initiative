# Helping Fingers Initiative Association — Website

Website for Helping Fingers Initiative Association, Birnin Kebbi, Kebbi State, Nigeria.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · Zod

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

| Script | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |

## Architecture

```
src/
├─ app/              Routes only — thin pages that compose sections
├─ content/          All site copy as typed data (edit text here, not in JSX)
├─ domain/           Types and Zod schemas (framework-free)
├─ lib/
│  ├─ content/       Repository pattern: ContentRepository + StaticContentRepository
│  ├─ mail/          Adapter for form notifications (console in dev)
│  └─ donations/     Strategy interface for online giving (Paystack/Flutterwave later)
├─ features/forms/   Config-driven forms + server actions (contact, volunteer, partner)
└─ components/
   ├─ ui/            Atoms: Button, Card, Icon, Section
   ├─ sections/      Page sections: Hero, ProgrammeGrid, ApproachSteps, …
   └─ layout/        Header, Footer, Logo
```

### Patterns

- **Content/presentation separation.** Copy lives in `src/content`; components only receive typed props.
- **Repository.** Pages call `content.getProgrammes()` etc. To move to a CMS, implement `ContentRepository` and swap it in `src/lib/content/index.ts`.
- **Adapter/Strategy.** `MailProvider` and `DonationProvider` hide third-party services behind interfaces.
- **Schema-first forms.** One Zod schema per form validates on the server and gives the TypeScript type. `handleForm` is the shared validate → notify → respond pipeline.
- **Design tokens.** Brand colours from the letterhead are defined once in `src/app/globals.css` (`brand-*`, `accent-*`).

## Outstanding content

- Official email address and social media handles (`src/content/site.ts`)
- High-resolution / vector logo (currently cropped from the letterhead: `public/brand/logo.png`)
- Photos of programmes and community work
- Bank details or payment provider for online donations
- Email delivery provider for form submissions
