#!/usr/bin/env bash
# Back up uploaded gallery photos (the `storage` Docker volume) to ./backups.
# Keeps the newest 14 archives. Schedule daily with cron, e.g.:
#   15 2 * * * cd /opt/helping-fingers && ./deploy/backup.sh >> backups/backup.log 2>&1
set -euo pipefail

cd "$(dirname "$0")/.."
PROJECT="$(basename "$PWD" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9_-')"
VOLUME="${PROJECT}_storage"
STAMP="$(date +%Y-%m-%d_%H%M)"
mkdir -p backups

docker run --rm \
  -v "${VOLUME}:/data:ro" \
  -v "$PWD/backups:/backup" \
  alpine tar czf "/backup/gallery_${STAMP}.tar.gz" -C /data .

ls -1t backups/gallery_*.tar.gz | tail -n +15 | xargs -r rm --
echo "Backup written: backups/gallery_${STAMP}.tar.gz"
