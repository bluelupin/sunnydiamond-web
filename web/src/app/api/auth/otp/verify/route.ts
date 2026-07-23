import { NextRequest, NextResponse } from "next/server";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import { MAGENTO_VERIFY_LOGIN_OTP_MUTATION } from "@/services/auth/auth.gql";
import { setCustomerTokenCookie } from "@/services/auth/session";

type OtpVerifyBody = {
  phone?: string;
  otp?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
};

export async function POST(request: NextRequest) {
  let body: OtpVerifyBody;

  try {
    body = (await request.json()) as OtpVerifyBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const phone = body.phone?.trim();
  const otp = body.otp?.trim();
  if (!phone || !otp) {
    return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
  }

  try {
    const data = await magentoGraphqlFetch<{
      verifyLoginOtp: {
        token: string | null;
        registration_required: boolean;
        customer_created: boolean;
      };
    }>({
      query: MAGENTO_VERIFY_LOGIN_OTP_MUTATION,
      variables: {
        input: {
          phone,
          otp,
          email: body.email?.trim() || null,
          first_name: body.firstName?.trim() || null,
          last_name: body.lastName?.trim() || null,
        },
      },
      cache: "no-store",
    });

    const { token, registration_required, customer_created } = data.verifyLoginOtp;

    if (token) {
      await setCustomerTokenCookie(token);
      return NextResponse.json({
        ok: true,
        registrationRequired: false,
        customerCreated: customer_created,
      });
    }

    return NextResponse.json({ ok: true, registrationRequired: registration_required });
  } catch (error) {
    const message =
      error instanceof MagentoGraphqlError ? error.message : "OTP verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
