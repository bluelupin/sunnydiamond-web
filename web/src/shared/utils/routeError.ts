import type { ErrorPageVariant } from "@/features/error/types";

export type RouteErrorKind = "server" | "transient" | "client";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message.trim();
  }

  if (typeof error === "string") {
    return error.trim();
  }

  return "";
}

function getCombinedErrorText(error: unknown): string {
  const name = error instanceof Error ? error.name : "";
  const message = getErrorMessage(error);
  return `${name} ${message}`.trim().toLowerCase();
}

function getErrorDigest(error: unknown): string | undefined {
  if (error instanceof Error) {
    return (error as Error & { digest?: string }).digest;
  }

  return undefined;
}

const TRANSIENT_PATTERNS = [
  /chunkloaderror/i,
  /loading chunk/i,
  /dynamically imported module/i,
  /failed to fetch dynamically imported module/i,
  /importing a module script failed/i,
  /networkerror when attempting to fetch resource/i,
  /failed to load because no supported source/i,
  /hydration failed/i,
  /text content does not match/i,
  /minified react error #418/i,
  /minified react error #423/i,
  /minified react error #425/i,
];

const SERVER_PATTERNS = [
  /\b5\d{2}\b/,
  /internal server error/i,
  /server unavailable/i,
  /service unavailable/i,
  /bad gateway/i,
  /gateway timeout/i,
  /econnrefused/i,
  /enotfound/i,
  /etimedout/i,
  /seo unavailable/i,
  /cms unavailable/i,
  /content unavailable/i,
  /magento.*unavailable/i,
  /graphql.*failed/i,
];

function isNextServerComponentError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const digest = getErrorDigest(error);
  const message = error.message;

  if (!digest) {
    return false;
  }

  return (
    /server components render/i.test(message) ||
    /omitted in production builds/i.test(message) ||
    /^an error occurred\b/i.test(message)
  );
}

export function classifyRouteError(error: unknown): RouteErrorKind {
  const combined = getCombinedErrorText(error);

  if (TRANSIENT_PATTERNS.some((pattern) => pattern.test(combined))) {
    return "transient";
  }

  if (
    SERVER_PATTERNS.some((pattern) => pattern.test(combined)) ||
    isNextServerComponentError(error)
  ) {
    return "server";
  }

  return "client";
}

export function isServerRelatedRouteError(error: unknown): boolean {
  return classifyRouteError(error) === "server";
}

export function getRouteErrorVariant(error: unknown): ErrorPageVariant {
  const combined = getCombinedErrorText(error);

  if (/deploy/i.test(combined) || /maintenance/i.test(combined)) {
    return "deploying";
  }

  if (/content/i.test(combined) && /load|unavailable/i.test(combined)) {
    return "content-load-failed";
  }

  if (/service unavailable/i.test(combined)) {
    return "service-unavailable";
  }

  return "server-unavailable";
}
