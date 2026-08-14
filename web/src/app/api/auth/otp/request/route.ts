import { isIP } from "node:net";
import { NextRequest, NextResponse } from "next/server";
import { normalizePhoneForMagento } from "@/lib/auth/magentoPhone";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import { MAGENTO_REQUEST_LOGIN_OTP_MUTATION } from "@/services/auth/auth.gql";

type OtpRequestBody = {
  phone?: string;
};

/**
 * Real client IP for Magento's per-IP OTP rate caps. Trust only what our own
 * nginx sets: x-real-ip, else the RIGHTMOST x-forwarded-for entry (nginx appends
 * the true peer last — leftmost entries are caller-controlled and spoofable).
 */
function resolveClientIp(request: NextRequest): string | null {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && isIP(realIp)) {
    return realIp;
  }

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

  const phone = normalizePhoneForMagento(body.phone?.trim() ?? "");
  if (!phone) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  // Forward the caller's IP so Magento rate-limits per client, not per Next server.
  const clientIp = resolveClientIp(request);

  try {
    const data = await magentoGraphqlFetch<{
      requestLoginOtp: { success: boolean; resend_after_seconds: number };
    }>({
      query: MAGENTO_REQUEST_LOGIN_OTP_MUTATION,
      variables: { input: { phone } },
      cache: "no-store",
      ...(clientIp ? { headers: { "X-Forwarded-For": clientIp } } : {}),
    });

    return NextResponse.json({
      ok: data.requestLoginOtp.success,
      resendAfterSeconds: data.requestLoginOtp.resend_after_seconds,
    });
  } catch (error) {
    const message =
      error instanceof MagentoGraphqlError ? error.message : "Could not send OTP";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
