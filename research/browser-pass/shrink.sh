#!/bin/sh
# Downscales desktop screenshots for the repo: full pages to 720px wide, fold shots to 960px. Run once per site.
cd "$(dirname "$0")"
for k in "$@"; do
  [ -f "$k/.shrunk" ] && continue
  for f in "$k"/*-desktop.jpg; do [ -f "$f" ] && mogrify -resize '720x>' -quality 60 "$f"; done
  for f in "$k"/*-desktop-fold.jpg; do [ -f "$f" ] && mogrify -resize '960x>' -quality 60 "$f"; done
  for f in "$k"/*-mobile*.jpg; do [ -f "$f" ] && mogrify -quality 60 "$f"; done
  touch "$k/.shrunk"
done
