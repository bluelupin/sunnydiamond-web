import { isIP } from "node:net";

/**
 * Real client IP for per-IP rate caps (Magento OTP, CMS forms).
 *
 * Behind Cloudflare, nginx's peer is a Cloudflare edge address, so x-real-ip and
 * the rightmost x-forwarded-for entry resolve to the PoP rather than the customer,
 * which would put everyone routed through Mumbai in one bucket; CF-Connecting-IP
 * is used instead. It is trusted only when TRUST_CLOUDFLARE_IP=true: Cloudflare
 * overwrites it, but where Cloudflare is not in front (dev) anyone can send it and
 * rotate a made-up IP past the OTP and form caps. Otherwise the nginx-set values.
 */
export function resolveClientIp(request: Request): string | null {
  const cloudflareIp =
    process.env.TRUST_CLOUDFLARE_IP === "true"
      ? request.headers.get("cf-connecting-ip")?.trim()
      : undefined;
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
