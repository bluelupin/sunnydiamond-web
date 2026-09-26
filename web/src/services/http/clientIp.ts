import { isIP } from "node:net";

/**
 * Real client IP for per-IP rate caps (Magento OTP, CMS forms).
 *
 * Forge's nginx (conf.d/cloudflare.conf: set_real_ip_from Cloudflare ranges +
 * real_ip_header X-Forwarded-For) already turns the Cloudflare edge into the
 * shopper's address, so x-real-ip is the shopper. CF-Connecting-IP is a fallback
 * for a server without that config, trusted only when TRUST_CLOUDFLARE_IP=true:
 * without Cloudflare in front anyone can send it and rotate a made-up IP past the
 * OTP and form caps.
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
