/** CMS may store a full Strapi host URL — always normalize to a site-relative path. */
export function normalizeCanonicalPath(
  canonicalUrl?: string | null,
  fallback = "/",
): string {
  const cleaned = canonicalUrl?.trim();
  if (!cleaned) return fallback;

  try {
    const pathname = new URL(cleaned).pathname.replace(/\/$/, "") || fallback;
    return pathname.startsWith("/") ? pathname : `/${pathname}`;
  } catch {
    if (cleaned.startsWith("/")) {
      return cleaned.replace(/\/$/, "") || fallback;
    }
    return fallback;
  }
}
