import type { Instrumentation } from "next";
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

/**
 * Query strings can carry an email or an order number, so only the parameter
 * names are logged — enough to tell one request shape from another without
 * putting customer data in the process log. Headers are never logged: they
 * carry the session cookie.
 */
function describePath(path: string): { path: string; query: string[] } {
  const [pathname, search] = path.split("?");
  if (!search) return { path: pathname, query: [] };
  return { path: pathname, query: [...new URLSearchParams(search).keys()].sort() };
}

/** Next types the error as `unknown`; a digest is attached only for render errors. */
function describeError(error: unknown): { name: string; message: string; digest?: string } {
  if (!(error instanceof Error)) {
    return { name: typeof error, message: String(error) };
  }
  const { digest } = error as Error & { digest?: string };
  return { name: error.name, message: error.message, digest };
}

/**
 * Next reports server errors here along with the request that caused them.
 * Sentry receives them, but not everything it receives becomes an issue — the
 * streaming TypeError that has been crashing page renders on this deployment
 * never appeared there — so the request is written to the process log too,
 * where it can be matched against a customer's report by timestamp.
 *
 * If a crash appears in the log with no `[request-error]` line beside it, that
 * is itself the finding: the error was thrown outside the request-error path,
 * which is where a failure after the response has started streaming would land.
 */
export const onRequestError: Instrumentation.onRequestError = (error, request, context) => {
  try {
    const { path, query } = describePath(request.path ?? "");
    console.error(
      "[request-error]",
      JSON.stringify({
        method: request.method,
        path,
        query,
        route: context.routePath,
        routeType: context.routeType,
        routerKind: context.routerKind,
        renderSource: context.renderSource,
        revalidateReason: context.revalidateReason,
        ...describeError(error),
      }),
    );
  } catch {
    // Never let the reporter be the thing that breaks the request.
  }

  return Sentry.captureRequestError(error, request, context);
};
