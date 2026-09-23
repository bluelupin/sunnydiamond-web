/** Strip trailing slashes and accidental `/api` suffix from a base URL. */
function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/api\/?$/, "").replace(/\/$/, "");
}

type AppEnv = "local" | "qa" | "production";

const APP_ENV_DEFAULT_SITE_URL: Record<AppEnv, string> = {
  local: "http://localhost:3000",
  qa: "https://sunnydiamonds-web-dev.on-forge.com",
  production: "https://sunnydiamonds.com",
};

/**
 * Strapi CMS origin used for API requests and `/uploads` media resolution.
 *
 * Precedence (first defined wins):
 * 1. NEXT_PUBLIC_STRAPI_URL
 * 2. NEXT_PUBLIC_API_URL
 * 3. NEXT_PUBLIC_SITE_URL — legacy fallback only when it is not the Next.js web host
 */
export function getStrapiBaseUrl(): string {
  const dedicated =
    process.env.NEXT_PUBLIC_STRAPI_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim();

  if (dedicated) {
    return normalizeBaseUrl(dedicated);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    const normalizedSite = normalizeBaseUrl(siteUrl);
    const knownWebOrigins = new Set(
      Object.values(APP_ENV_DEFAULT_SITE_URL).map((url) => normalizeBaseUrl(url)),
    );
    const frontend = process.env.NEXT_PUBLIC_FRONTEND_URL?.trim();
    if (frontend) {
      knownWebOrigins.add(normalizeBaseUrl(frontend));
    }

    // Never treat sunnydiamonds-web-* / localhost app origin as the CMS.
    if (!knownWebOrigins.has(normalizedSite)) {
      return normalizedSite;
    }
  }

  throw new Error(
    "Missing CMS base URL. Set NEXT_PUBLIC_STRAPI_URL (recommended), NEXT_PUBLIC_API_URL, or NEXT_PUBLIC_SITE_URL to the Strapi host (not the Next.js web host).",
  );
}

/**
 * Server-only Strapi API token for appointment booking endpoints.
 * Never expose to the browser — CMS trusts magentoCustomerId from the caller.
 */
export function getStrapiApiToken(): string {
  const token =
    process.env.STRAPI_API_TOKEN?.trim() ||
    process.env.CMS_API_TOKEN?.trim() ||
    "";

  if (!token) {
    throw new Error(
      "Missing CMS API token. Set STRAPI_API_TOKEN (or CMS_API_TOKEN) on the server.",
    );
  }

  return token;
}

/**
 * Public frontend origin for SEO canonical URLs and absolute links.
 * Prefer NEXT_PUBLIC_FRONTEND_URL when Strapi and the Next.js app use separate hosts.
 * Do not fall back to NEXT_PUBLIC_SITE_URL when APP_ENV is set — that var often points at Strapi.
 */
export function getPublicSiteUrl(): string {
  const frontend = process.env.NEXT_PUBLIC_FRONTEND_URL?.trim();
  if (frontend) return normalizeBaseUrl(frontend);

  const appEnv = process.env.NEXT_PUBLIC_APP_ENV?.trim() as AppEnv | undefined;
  if (appEnv && appEnv in APP_ENV_DEFAULT_SITE_URL) {
    return APP_ENV_DEFAULT_SITE_URL[appEnv];
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) return normalizeBaseUrl(siteUrl);

  return APP_ENV_DEFAULT_SITE_URL.production;
}
