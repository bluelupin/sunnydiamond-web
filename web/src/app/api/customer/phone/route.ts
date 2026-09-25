import { NextRequest, NextResponse } from "next/server";
import { normalizePhoneForMagento } from "@/lib/auth/magentoPhone";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import {
  MAGENTO_REQUEST_PHONE_LINK_OTP_MUTATION,
  MAGENTO_VERIFY_PHONE_LINK_MUTATION,
} from "@/services/auth/auth.gql";
import { mapAuthErrorMessage } from "@/services/auth/authErrorMessages";
import { getCustomerTokenFromRequest } from "@/services/auth/session";

type PhoneLinkBody = {
  phone?: string;
  /** Present on the second call: verifies the code and links the number. */
  otp?: string;
};

/**
 * Links a mobile number to the signed-in account with SMS verification.
 * Without `otp` it sends the code; with `otp` it verifies and saves the number.
 */
export async function POST(request: NextRequest) {
  const token = await getCustomerTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: PhoneLinkBody;
  try {
    body = (await request.json()) as PhoneLinkBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const phone = normalizePhoneForMagento(body.phone?.trim() ?? "");
  const otp = body.otp?.trim();
  if (!/^\+91\d{10}$/.test(phone)) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number" }, { status: 400 });
  }

  try {
    if (!otp) {
      const data = await magentoGraphqlFetch<{
        requestPhoneLinkOtp: { success: boolean; resend_after_seconds: number };
      }>({
        query: MAGENTO_REQUEST_PHONE_LINK_OTP_MUTATION,
        variables: { input: { phone } },
        authToken: token,
        cache: "no-store",
      });
      return NextResponse.json({
        ok: data.requestPhoneLinkOtp.success,
        resendAfterSeconds: data.requestPhoneLinkOtp.resend_after_seconds,
        channel: "sms",
        maskedDestination: null,
      });
    }

    const data = await magentoGraphqlFetch<{ verifyPhoneLink: { success: boolean } }>({
      query: MAGENTO_VERIFY_PHONE_LINK_MUTATION,
      variables: { input: { phone, otp } },
      authToken: token,
      cache: "no-store",
    });
    return NextResponse.json({ ok: data.verifyPhoneLink.success });
  } catch (error) {
    const fallback = otp ? "Incorrect code" : "Could not send OTP";
    const message =
      error instanceof MagentoGraphqlError ? mapAuthErrorMessage(error.message, fallback) : fallback;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
