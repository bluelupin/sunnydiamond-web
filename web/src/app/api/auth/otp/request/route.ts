import { NextRequest, NextResponse } from "next/server";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import { MAGENTO_REQUEST_LOGIN_OTP_MUTATION } from "@/services/auth/auth.gql";

type OtpRequestBody = {
  phone?: string;
};

export async function POST(request: NextRequest) {
  let body: OtpRequestBody;

  try {
    body = (await request.json()) as OtpRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const phone = body.phone?.trim();
  if (!phone) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  try {
    const data = await magentoGraphqlFetch<{
      requestLoginOtp: { success: boolean; resend_after_seconds: number };
    }>({
      query: MAGENTO_REQUEST_LOGIN_OTP_MUTATION,
      variables: { input: { phone } },
      cache: "no-store",
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
