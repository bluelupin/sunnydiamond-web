import * as Sentry from "@sentry/nextjs";

// Only NEXT_PUBLIC_* variables are available in the browser bundle.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  // No DSN configured (e.g. local dev without Sentry) — the SDK stays inert.
  enabled: Boolean(dsn),
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? "development",
  tracesSampleRate: 0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
