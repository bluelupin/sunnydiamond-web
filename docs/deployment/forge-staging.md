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

Broken UI during deploy (unstyled HTML, missing `/_next` CSS) happens when **maintenance was never enabled** on the server or Nginx serves static assets while Node is mid-build. Fix both:

1. **Forge Deploy Script** — use `web/scripts/forge-deploy.sh` (or equivalent) so **`web/.maintenance` is created before `npm run build`** and removed after, with **`pm2 reload`** after each toggle.
2. **Nginx (recommended)** — add `docs/deployment/forge-nginx-maintenance.conf.example` so when `.maintenance` exists, **all requests** (including `/_next/*`) get `maintenance.html` without hitting Node.

Maintenance is active when **any** of these apply:

1. **`web/.maintenance`** flag file on the server (primary; read at runtime by `/api/maintenance/status`),  
2. **`X-Sunny-Maintenance: 1`** request header (from Nginx when the flag file exists), or  
3. **`MAINTENANCE_MODE=true`** in the Forge environment (also read at runtime by the status API; reload PM2 after changing).

### Forge deploy script (required)

In Forge → your site → **Deploy Script**, use the repo script (adjust PM2 name if needed):

```bash
bash web/scripts/forge-deploy.sh
```

Or paste the same steps manually — **maintenance ON → pm2 reload → pull → npm ci → build → maintenance OFF → pm2 reload**.

Without **`node scripts/toggle-maintenance.mjs on`** before build, users will keep seeing broken pages like unstyled layout + partial images.

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
