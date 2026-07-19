#!/usr/bin/env bash
# Downloads every original image from wegood4u.com into ./assets-wegood4u/
# Run from the repo root once the Next.js project exists.
# Images from wegood4u.saysheji.my are JS-injected — see README, use the headless step.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="${1:-./assets-raw/wegood4u}"
mkdir -p "$OUT"
count=0
while IFS= read -r url; do
  [ -z "$url" ] && continue
  fname="$(printf '%s' "$url" | sed -E 's#https://wegood4u.com/wp-content/uploads/##; s#/#_#g')"
  if [ ! -f "$OUT/$fname" ]; then
    curl -sL -A "Mozilla/5.0" --max-time 30 "$url" -o "$OUT/$fname" && count=$((count+1))
  fi
done < "$HERE/wegood4u-image-manifest.txt"
echo "Downloaded $count images to $OUT"
echo "Next: convert to WebP/AVIF and compress before dropping into /public."
