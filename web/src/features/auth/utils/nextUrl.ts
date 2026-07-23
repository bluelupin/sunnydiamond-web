/** Only allow same-site relative paths as post-login destinations (no open redirects). */
export function sanitizeNextUrl(raw: string | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/";
  }
  return raw;
}
