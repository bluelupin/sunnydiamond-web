# Staging Forge deployment

The GitHub Actions workflow at `.github/workflows/forge-staging-deploy.yml` runs `npm ci` and `npm run build` in `web/` after each push to `sunnydiamonds-staging`. Forge is called only if the build succeeds. The trigger includes the branch and commit SHA so Forge can reject a branch mismatch and record the deployed commit.

## One-time setup

1. In Forge, set the target site's repository branch to `sunnydiamonds-staging` and copy its **Deployment Trigger URL**.
2. In GitHub, add that URL as the repository Actions secret `FORGE_DEPLOY_HOOK_URL` under **Settings → Secrets and variables → Actions**. Do not put the URL in the workflow file.
3. If Forge Quick Deploy is enabled for this site, disable it to avoid triggering a second deployment from the same push.
4. Merge or push the workflow file to `sunnydiamonds-staging`. Subsequent pushes to that branch will trigger the workflow.

The workflow reports whether Forge accepted the trigger request. Check the deployment status and logs in Forge for the final build result.
