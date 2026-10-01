# Automatic Vercel PR previews

The workflow at `.github/workflows/vercel-preview.yml` deploys each same-repository PR when it opens, receives a commit, reopens, or becomes ready for review. Vercel builds the application remotely using its Preview environment variables. The preview URL appears in the GitHub Actions summary and the `preview` environment.

## Activate

1. Choose the Vercel project for `bluelupin/sunnydiamond-web`.
2. In that project's build settings, set **Root Directory** to `web` and **Framework Preset** to Next.js. The committed `web/vercel.json` uses `npm ci` and `npm run build`, retaining the application's webpack build script. Keep the Next.js output-directory default.
3. Use an initialized project with an existing production deployment. The workflow refuses to bootstrap a new project because [Vercel's first deployment can become Production](https://vercel.com/docs/cli/deploy#prod). Initialize a new project separately with an approved baseline before using its credentials here.
4. Set the application variables for the **Preview** environment in Vercel. These are distinct from the deployment credentials in GitHub. Supply the intended preview CMS, Magento, authentication, and other service settings. Do not commit `.env` files.
5. Add these **GitHub Actions repository secrets** in [repository settings](https://github.com/bluelupin/sunnydiamond-web/settings/secrets/actions):

   | Secret | Value |
   | --- | --- |
   | `VERCEL_TOKEN` | A Vercel access token authorized for the selected project/team |
   | `VERCEL_ORG_ID` | The project's owning team or account ID |
   | `VERCEL_PROJECT_ID` | The existing project's ID |

   The two IDs are also available in `.vercel/project.json` after linking the correct project locally. Keep the token in secret storage; do not paste it into a PR, workflow, or chat.

6. Check the GitHub `preview` environment's deployment-branch rules. Required reviewers will intentionally pause runs; remove that requirement only if unattended deployment is desired and permitted by the team.
7. Push these configuration files, then open or update a same-repository PR. The `Vercel PR Preview / Deploy preview` job will check the project, deploy the exact PR head commit, and wait for Vercel's build result.

The workflow has no push-to-production trigger and explicitly targets Preview. It validates the project ID, owner, `web` root, and an existing production target before creating the local link. [Vercel documents the CLI deployment output and branch metadata](https://vercel.com/docs/cli/deploy).

## Application environment

Configure Preview values for the features being tested. The current application reads, among others:

- `NEXT_PUBLIC_STRAPI_URL` (or the existing `NEXT_PUBLIC_API_URL` fallback) and `STRAPI_API_TOKEN` / `CMS_API_TOKEN` where required.
- `NEXT_PUBLIC_MAGENTO_GRAPHQL_URL`, `NEXT_PUBLIC_MAGENTO_STORE_CODE`, and `MAGENTO_INTEGRATION_ACCESS_TOKEN` where required.
- The application's site/frontend URL and authentication provider configuration for the intended preview origin.
- Sentry configuration if preview reporting or source-map upload is wanted.

This is not a complete environment manifest. Match the chosen project's existing feature configuration, including provider callbacks. The workflow uses Vercel's remote build so environment values stay on Vercel; it does not download Preview `.env` files onto the runner.

## Behavior and boundaries

- Fork PRs and Dependabot-triggered PRs are skipped because they do not receive the deployment credentials. For a reviewed external change, use a branch in this repository or the team's separately approved preview process. Do not replace this trigger with `pull_request_target` to expose credentials to fork code.
- Changes from repository branches are trusted to run with access to the Preview application environment. Keep its service permissions appropriate for previews.
- A newer run cancels the older GitHub run for the same PR. A remote build already submitted to Vercel may continue independently.
- A closed PR does not trigger another deploy or delete old deployments. Retention follows the Vercel project policy.
- Native Vercel Git integration can also deploy branch commits. Use one preview mechanism to avoid duplicate builds. This workflow does not disconnect an existing integration or change production settings.
- To stop this automation, disable `Vercel PR Preview` in GitHub Actions. Existing previews remain subject to Vercel retention.

## Check the first live run

1. Open a same-repository PR and confirm the job reaches `Build and deploy on Vercel`.
2. Open the URL from the Actions summary; confirm Vercel labels it **Preview** and shows the expected commit/branch.
3. Check one CMS-backed page, one Magento-backed page, and any authentication callback the preview needs.
4. Push another commit to the PR; confirm another preview is produced.
5. Confirm the production deployment and production domain were not changed by the PR workflow.

Local workflow validation cannot establish that remote credentials, environment values, or provider callbacks are correct. Those require this live run.

## Troubleshooting

| Failure | Action |
| --- | --- |
| Missing secret | Add the named Actions secret, then rerun the job. |
| Vercel HTTP 401/403/404 | Check token validity, scope, owner ID, and project ID. |
| Wrong root directory | Set the chosen project's Root Directory to `web`; the CLI intentionally runs from the repository root. |
| Project not initialized | Initialize it separately with an approved baseline; do not use PR code as its first production deployment. |
| Build fails | Inspect the Vercel build logs and Preview environment configuration. |
| Job waits for approval | Check the GitHub `preview` environment protection rules. |
| Two previews per commit | Check for simultaneous native Git integration and Actions deployments. |
