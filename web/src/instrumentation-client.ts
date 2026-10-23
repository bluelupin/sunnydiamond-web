// Only NEXT_PUBLIC_* variables are available in the browser bundle.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
type SentryClient = typeof import("@sentry/nextjs");

let sentryPromise: Promise<SentryClient> | undefined;
const earlyErrors: unknown[] = [];

function rememberError(error: unknown) {
  if (earlyErrors.length < 20) earlyErrors.push(error);
}

function onEarlyError(event: ErrorEvent) {
  rememberError(event.error ?? new Error(event.message));
}

function onEarlyRejection(event: PromiseRejectionEvent) {
  rememberError(event.reason);
}

function startSentry(): Promise<SentryClient> | undefined {
  if (!dsn) return;

  sentryPromise ??= import("@sentry/nextjs")
    .then((sentry) => {
      sentry.init({
        dsn,
        environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? "development",
        tracesSampleRate: 0,
      });
      window.removeEventListener("error", onEarlyError);
      window.removeEventListener("unhandledrejection", onEarlyRejection);
      for (const error of earlyErrors) sentry.captureException(error);
      earlyErrors.length = 0;
      return sentry;
    })
    .catch((error) => {
      sentryPromise = undefined;
      throw error;
    });

  return sentryPromise;
}

if (dsn) {
  window.addEventListener("error", onEarlyError);
  window.addEventListener("unhandledrejection", onEarlyRejection);

  // The homepage hero can render before monitoring code is needed.
  if (window.location.pathname === "/") {
    const schedule = () => window.setTimeout(() => void startSentry()?.catch(() => {}), 5000);
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
  } else {
    void startSentry()?.catch(() => {});
  }
}

export function onRouterTransitionStart(url: string, navigationType: string) {
  void startSentry()?.then((sentry) => {
    sentry.captureRouterTransitionStart(url, navigationType);
  }).catch(() => {});
}
