import { lazy, type ComponentType, type LazyExoticComponent } from "react";

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

/**
 * Retries failed dynamic imports — common after deploys or brief network loss.
 * Suspense does not catch import failures; without retry they hit the route error boundary.
 */
export function lazyImportWithRetry<T extends ComponentType<Record<string, unknown>>>(
  factory: () => Promise<{ default: T }>,
  retries = 2,
  delayMs = 400,
): LazyExoticComponent<T> {
  return lazy(async () => {
    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        return await factory();
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          await wait(delayMs * (attempt + 1));
        }
      }
    }

    throw lastError;
  });
}
