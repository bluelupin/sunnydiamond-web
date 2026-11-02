# Staging Forge deployment

The GitHub Actions workflow at `.github/workflows/forge-staging-deploy.yml` runs `npm ci` and `npm run build` in `web/` after each push to `sunnydiamonds-staging`. Forge is called only if the build succeeds. The trigger includes the branch and commit SHA so Forge can reject a branch mismatch and record the deployed commit.

## One-time setup

1. In Forge, set the target site's repository branch to `sunnydiamonds-staging` and copy its **Deployment Trigger URL**.
2. In GitHub, add that URL as the repository Actions secret `FORGE_DEPLOY_HOOK_URL` under **Settings → Secrets and variables → Actions**. Do not put the URL in the workflow file.
3. The CI build uses `https://sunnydiamonds-cms-dev.on-forge.com` as `NEXT_PUBLIC_STRAPI_URL`. Keep the Forge site's build environment pointed at the same CMS host.
4. If Forge Quick Deploy is enabled for this site, disable it to avoid triggering a second deployment from the same push.
5. Merge or push the workflow file to `sunnydiamonds-staging`. Subsequent pushes to that branch will trigger the workflow.

The workflow reports whether Forge accepted the trigger request. Check the deployment status and logs in Forge for the final build result.

## Maintenance mode during deploy

To avoid broken or partially updated UI while a new build is rolling out, the app can serve a standalone **`/maintenance.html`** page for all routes (including `/_next/*`).

Maintenance is active when **either**:

1. **`MAINTENANCE_MODE=true`** (or `1` / `yes`) is set in the Forge site environment, or  
2. A **`web/.maintenance`** flag file exists on the server (not committed to git).

### Recommended Forge deploy script order

```bash
cd /home/forge/your-site/web

# 1. Enable maintenance before stopping or rebuilding
node scripts/toggle-maintenance.mjs on
# Optional: reload the Node process so in-flight requests drain cleanly
# pm2 reload sunnydiamond-web --update-env

# 2. Pull, install, build (your existing steps)
git pull origin $FORGE_SITE_BRANCH
npm ci
npm run build

# 3. Disable maintenance and restart
node scripts/toggle-maintenance.mjs off
# pm2 reload sunnydiamond-web --update-env
```

While maintenance is on, visitors see the static page (no React chunks). The page polls **`GET /api/maintenance/status`** every 15 seconds and returns to **`/`** when maintenance is off.

### Manual toggle

```bash
node scripts/toggle-maintenance.mjs on   # enable
node scripts/toggle-maintenance.mjs off  # disable
```

### Health check

```bash
curl -sS "$SITE_URL/api/maintenance/status"
# {"maintenance":true} or {"maintenance":false}
```
