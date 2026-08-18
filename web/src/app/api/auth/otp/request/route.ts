import { isIP } from "node:net";
import { NextRequest, NextResponse } from "next/server";
import { normalizePhoneForMagento } from "@/lib/auth/magentoPhone";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import { MAGENTO_REQUEST_LOGIN_OTP_MUTATION } from "@/services/auth/auth.gql";

type OtpRequestBody = {
  phone?: string;
  email?: string;
};

/**
 * Real client IP for Magento's per-IP OTP rate caps.
 *
 * CF-Connecting-IP comes first because Cloudflare fronts staging and production:
 * behind it, nginx's peer is a Cloudflare edge address, so x-real-ip and the
 * rightmost x-forwarded-for entry both resolve to the PoP rather than the
 * customer — which would put everyone routed through Mumbai in one bucket.
 * Cloudflare overwrites this header on every request, so it cannot be spoofed
 * from outside; the nginx-set values remain the fallback for direct origin hits.
 */
function resolveClientIp(request: NextRequest): string | null {
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

export async function POST(request: NextRequest) {
  let body: OtpRequestBody;

  try {
    body = (await request.json()) as OtpRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Exactly one identifier reaches Magento. Email takes the phone's place rather
  // than accompanying it — sending both means "registering this phone under that
  // address", which is the verify call's job, not this one's.
  const phone = normalizePhoneForMagento(body.phone?.trim() ?? "");
  const email = body.email?.trim().toLowerCase();

  if (!phone && !email) {
    return NextResponse.json(
      { error: "A phone number or email address is required" },
      { status: 400 },
    );
  }

  const input = phone ? { phone } : { email };

  // Forward the caller's IP so Magento rate-limits per client, not per Next server.
  // It travels with a shared secret because Magento's GraphQL endpoint is public:
  // without proof the header came from us, anyone could rotate a made-up IP and
  // walk straight past the per-IP cap. Magento ignores the IP unless the secret
  // matches, so a missing secret degrades to one shared bucket, never to none.
  const clientIp = resolveClientIp(request);
  const forwardedSecret = process.env.MAGENTO_FORWARDED_IP_SECRET;
  const forwardedHeaders =
    clientIp && forwardedSecret
      ? {
          "X-Sunny-Client-Ip": clientIp,
          "X-Sunny-Forwarded-Secret": forwardedSecret,
        }
      : undefined;

  try {
    const data = await magentoGraphqlFetch<{
      requestLoginOtp: {
        success: boolean;
        resend_after_seconds: number;
        channel: string | null;
        masked_destination: string | null;
      };
    }>({
      query: MAGENTO_REQUEST_LOGIN_OTP_MUTATION,
      variables: { input },
      cache: "no-store",
      ...(forwardedHeaders ? { headers: forwardedHeaders } : {}),
    });

    return NextResponse.json({
      ok: data.requestLoginOtp.success,
      resendAfterSeconds: data.requestLoginOtp.resend_after_seconds,
      channel: data.requestLoginOtp.channel ?? (phone ? "sms" : "email"),
      maskedDestination: data.requestLoginOtp.masked_destination ?? null,
    });
  } catch (error) {
    const message =
      error instanceof MagentoGraphqlError ? error.message : "Could not send OTP";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
