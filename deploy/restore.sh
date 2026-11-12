#!/usr/bin/env bash
# Restore gallery photos from a backup archive into the `storage` volume.
# Usage: ./deploy/restore.sh backups/gallery_YYYY-MM-DD_HHMM.tar.gz
set -euo pipefail

ARCHIVE="${1:?Usage: $0 backups/gallery_<date>.tar.gz}"
cd "$(dirname "$0")/.."
PROJECT="$(basename "$PWD" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9_-')"
VOLUME="${PROJECT}_storage"

read -r -p "This replaces all current gallery photos with ${ARCHIVE}. Continue? [y/N] " ok
[[ "$ok" == "y" || "$ok" == "Y" ]] || exit 1

docker compose stop app
docker run --rm \
  -v "${VOLUME}:/data" \
  -v "$PWD/$(dirname "$ARCHIVE"):/backup:ro" \
  alpine sh -c "rm -rf /data/* && tar xzf /backup/$(basename "$ARCHIVE") -C /data && chown -R 1000:1000 /data"
docker compose start app
echo "Restored from ${ARCHIVE}"
