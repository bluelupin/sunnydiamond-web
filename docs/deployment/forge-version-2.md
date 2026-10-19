# Version-2.0 Forge deployment

The GitHub Actions workflow at `.github/workflows/forge-version-2-deploy.yml` calls the Forge deployment trigger after each push to `Version-2.0`. It passes the branch and commit SHA so Forge can reject a branch mismatch and record the deployed commit.

## One-time setup

1. In Forge, set the target site's repository branch to `Version-2.0` and copy its **Deployment Trigger URL**.
2. In GitHub, add that URL as the repository Actions secret `FORGE_DEPLOY_HOOK_URL` under **Settings → Secrets and variables → Actions**. Do not put the URL in the workflow file.
3. If Forge Quick Deploy is enabled for this site, disable it to avoid triggering a second deployment from the same push.
4. Merge or push the workflow file to `Version-2.0`. Subsequent pushes to that branch will trigger the workflow.

The workflow reports whether Forge accepted the trigger request. Check the deployment status and logs in Forge for the final build result.
