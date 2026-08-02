import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  // No DSN configured (e.g. local dev without Sentry) — the SDK stays inert.
  enabled: Boolean(dsn),
  environment: process.env.SENTRY_ENVIRONMENT ?? "development",
  tracesSampleRate: 0,
});
