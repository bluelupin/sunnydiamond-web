import { isIP } from "node:net";

/**
 * Real client IP for per-IP rate caps (Magento OTP, CMS forms).
 *
 * CF-Connecting-IP comes first because Cloudflare fronts staging and production:
 * behind it, nginx's peer is a Cloudflare edge address, so x-real-ip and the
 * rightmost x-forwarded-for entry both resolve to the PoP rather than the
 * customer — which would put everyone routed through Mumbai in one bucket.
 * Cloudflare overwrites this header on every request, so it cannot be spoofed
 * from outside; the nginx-set values remain the fallback for direct origin hits.
 */
export function resolveClientIp(request: Request): string | null {
  const cloudflareIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cloudflareIp && isIP(cloudflareIp)) {
    return cloudflareIp;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && isIP(realIp)) {
    return realIp;
  }

  // nginx appends the true peer last — leftmost entries are caller-supplied.
  const lastForwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")
    .at(-1)
    ?.trim();
  return lastForwarded && isIP(lastForwarded) ? lastForwarded : null;
}

/**
 * Shopper IP for the CMS rate limits — every CMS call comes from this server, so
 * without it all shoppers share one bucket. Travels with CMS_FORWARDED_IP_SECRET
 * (server-only env var, must match the CMS) so the CMS can trust it; sent only
 * when both exist, otherwise the CMS falls back to the server's own IP.
 */
export function cmsForwardedIpHeaders(request: Request): Record<string, string> {
  const clientIp = resolveClientIp(request);
  const forwardedSecret = process.env.CMS_FORWARDED_IP_SECRET;

  return clientIp && forwardedSecret
    ? {
        "X-Sunny-Client-Ip": clientIp,
        "X-Sunny-Forwarded-Secret": forwardedSecret,
      }
    : {};
}
