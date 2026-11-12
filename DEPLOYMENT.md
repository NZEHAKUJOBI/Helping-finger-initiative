# Deploying to a VPS

The site runs as two Docker containers on one server:

- **app** — the Next.js site. Uploaded gallery photos are stored in the `storage` Docker volume, so they survive restarts, rebuilds and server reboots.
- **caddy** — the public web server. It gets and renews the HTTPS certificate automatically.

## 1. Server

- Ubuntu 24.04 LTS (or similar), **2 GB RAM** recommended (the build needs it; on 1 GB add swap — see below).
- 20 GB+ disk (photos are ~150–400 KB each after processing).
- Point your domain's **A record** at the server's IP (and `www` if you want it) before starting.

```bash
# Firewall: SSH + web only
sudo ufw allow OpenSSH && sudo ufw allow 80 && sudo ufw allow 443 && sudo ufw enable

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER   # log out and back in afterwards

# Optional on 1 GB servers: 2 GB swap
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 2. First deploy

```bash
sudo mkdir -p /opt/helping-fingers && sudo chown $USER /opt/helping-fingers
git clone https://github.com/NZEHAKUJOBI/Helping-finger-initiative.git /opt/helping-fingers
cd /opt/helping-fingers

cp .env.production.example .env
nano .env    # set DOMAIN, ADMIN_PASSWORD and SESSION_SECRET (openssl rand -base64 48)
chmod 600 .env

docker compose up -d --build
docker compose logs -f   # Ctrl+C to stop following
```

Open `https://<your-domain>` — the certificate is issued on the first request (allow a minute).
Then sign in at `https://<your-domain>/admin` and upload photos.

> After any rebuild the home page and gallery may show the build-time (empty) gallery for up to a minute before refreshing from the stored photos. Uploading, editing or deleting a photo refreshes them immediately.

## 3. Updating the site

```bash
cd /opt/helping-fingers
git pull
docker compose up -d --build
docker image prune -f
```

Photos are untouched by updates — they live in the `storage` volume, not in the image.

## 4. Backups

The `storage` volume is the **only copy** of uploaded photos. Back it up:

```bash
chmod +x deploy/backup.sh deploy/restore.sh
./deploy/backup.sh                       # writes backups/gallery_<date>.tar.gz, keeps 14
crontab -e                               # daily at 02:15:
# 15 2 * * * cd /opt/helping-fingers && ./deploy/backup.sh >> backups/backup.log 2>&1
```

Copy `backups/` off the server regularly (e.g. `rsync` or `rclone` to cloud storage).

Restore: `./deploy/restore.sh backups/gallery_<date>.tar.gz`

## 5. Useful commands

| Task | Command |
|---|---|
| Status | `docker compose ps` |
| App logs | `docker compose logs -f app` |
| Restart | `docker compose restart app` |
| Change admin password | edit `.env`, then `docker compose up -d app` |
| Stop everything | `docker compose down` (photos are kept) |

**Never run `docker compose down -v`** — `-v` deletes the volumes, including all photos.

## Security notes

- Keep `.env` private (`chmod 600`); changing `SESSION_SECRET` signs everyone out.
- The admin login locks for 15 minutes after 5 failed attempts.
- Keep the server patched: `sudo apt update && sudo apt upgrade` (consider `unattended-upgrades`).
