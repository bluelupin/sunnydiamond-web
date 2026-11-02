#!/usr/bin/env bash
# Forge site deploy script — paste into Forge → Site → Deploy Script (run from repo root or web/).
# Enables maintenance before build/restart so users never see mixed _next assets.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Forge may run the deploy script from the repo root (parent of web/).
if [[ -f "$PWD/web/scripts/toggle-maintenance.mjs" ]]; then
  WEB_DIR="$(cd "$PWD/web" && pwd)"
fi

cd "$WEB_DIR"

echo "[deploy] Enabling maintenance…"
node scripts/toggle-maintenance.mjs on

# Reload app so middleware/API pick up the flag before git pull / build (adjust name to your PM2 process).
if command -v pm2 >/dev/null 2>&1; then
  pm2 reload all --update-env || true
fi

echo "[deploy] Pulling latest code…"
git pull origin "${FORGE_SITE_BRANCH:-sunnydiamonds-staging}"

echo "[deploy] Installing dependencies…"
npm ci

echo "[deploy] Building…"
npm run build

echo "[deploy] Disabling maintenance…"
node scripts/toggle-maintenance.mjs off

if command -v pm2 >/dev/null 2>&1; then
  pm2 reload all --update-env || true
fi

echo "[deploy] Done."
