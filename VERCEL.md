# Deploying to Vercel

Vercel has no permanent disk, so uploaded photos, the gallery and newsletters are stored in a
**Vercel Blob** store. Everything else works the same as on a server.

You get a free address like `helping-fingers.vercel.app` straight away; add your own domain later.

## 1. Import the project

1. Push this repository to GitHub (it already lives at `NZEHAKUJOBI/Helping-finger-initiative`).
2. In Vercel: **Add New… → Project**, pick the repository, keep the detected **Next.js** settings.
3. Before the first deploy, open **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `ADMIN_PASSWORD` | the admin password (long and unique) |
   | `SESSION_SECRET` | 32+ random characters, e.g. from `openssl rand -base64 48` |
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-project>.vercel.app` (change it when your domain is live) |

4. Deploy.

## 2. Connect a Blob store (required for uploads)

1. In the project: **Storage → Create Database → Blob**.
2. Choose **Private** access. This matters: the site reads its data files privately and serves
   photos itself at `/uploads/…`. The access type cannot be changed after the store is created.
3. Connect it to the project for **all environments**. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.
4. **Redeploy** (Deployments → ⋯ → Redeploy) so the new variable is picked up.

Then sign in at `https://<your-project>.vercel.app/admin` and upload a photo to check it works.

## 3. Add your domain later

**Settings → Domains → Add**, enter the domain and follow the DNS instructions Vercel shows.
Then update `NEXT_PUBLIC_SITE_URL` to `https://<your-domain>` and redeploy.

## How storage works on Vercel

- Photos go straight from the admin's browser to Blob (`incoming/…`), because Vercel limits a request
  to the site to 4.5 MB. The server then resizes them, strips location data, saves the WebP versions
  under `images/…` and deletes the original.
- `data/gallery.json` and `data/newsletters.json` hold the gallery and newsletters. Saves are
  conflict-checked, so two admins saving at once never overwrite each other.
- Photos are served at `/uploads/<file>` and cached by Vercel's CDN, so each is read from Blob rarely.

## Free plan limits (Hobby)

Blob on the Hobby plan includes 1 GB of storage and 10 GB of transfer a month. Processed photos are
about 150–400 KB each, so 1 GB is a few thousand photos. If a limit is exceeded, Blob stops working
until the month resets, so keep an eye on **Storage → Blob → Usage**.

## Backups

Download the store's contents now and then (Storage → Blob → browse, or `vercel blob list` /
`vercel blob get` with the Vercel CLI). It is the only copy of uploaded photos.

## Moving to your own server later

Download everything under `images/` and `data/` from the Blob store and copy it into `STORAGE_DIR`
on the server: `images/*.webp` → `STORAGE_DIR/uploads/`, `data/*.json` → `STORAGE_DIR/`.
Then follow [DEPLOYMENT.md](DEPLOYMENT.md) without setting `BLOB_READ_WRITE_TOKEN`.
