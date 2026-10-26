#!/bin/sh
# Runs capture.js for each site in sites.tsv, one site at a time.
cd "$(dirname "$0")"
while IFS="$(printf '\t')" read -r key home trip contact; do
  [ -n "$1" ] && ! echo " $* " | grep -q " $key " && continue
  timeout 900 node capture.js "$key" "$home" "$trip" "$contact"
  sleep 5
done < sites.tsv
