import { NextRequest, NextResponse } from "next/server";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import {
  MAGENTO_REQUEST_EMAIL_VERIFY_OTP_MUTATION,
  MAGENTO_VERIFY_EMAIL_MUTATION,
} from "@/services/auth/auth.gql";
import { mapAuthErrorMessage } from "@/services/auth/authErrorMessages";
import { getCustomerTokenFromRequest } from "@/services/auth/session";

/**
 * Verifies the signed-in customer's account email. Without `otp` it emails a code to
 * that address (Magento reads the address from the session, never from the request);
 * with `otp` it checks the code and marks the email verified.
 */
export async function POST(request: NextRequest) {
  const token = await getCustomerTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { otp?: string };
  try {
    body = (await request.json()) as { otp?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const otp = body.otp?.trim();

  try {
    if (!otp) {
      const data = await magentoGraphqlFetch<{
        requestEmailVerifyOtp: {
          success: boolean;
          resend_after_seconds: number;
        };
      }>({
        query: MAGENTO_REQUEST_EMAIL_VERIFY_OTP_MUTATION,
        authToken: token,
        cache: "no-store",
      });
      return NextResponse.json({
        ok: data.requestEmailVerifyOtp.success,
        resendAfterSeconds: data.requestEmailVerifyOtp.resend_after_seconds,
        channel: "email",
        maskedDestination: null,
      });
    }

    const data = await magentoGraphqlFetch<{ verifyEmail: { success: boolean } }>({
      query: MAGENTO_VERIFY_EMAIL_MUTATION,
      variables: { input: { otp } },
      authToken: token,
      cache: "no-store",
    });
    return NextResponse.json({ ok: data.verifyEmail.success });
  } catch (error) {
    const fallback = otp ? "Incorrect code" : "Could not send the code";
    const message =
      error instanceof MagentoGraphqlError ? mapAuthErrorMessage(error.message, fallback) : fallback;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
