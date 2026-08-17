import { NextRequest, NextResponse } from "next/server";
import { normalizePhoneForMagento } from "@/lib/auth/magentoPhone";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import { MAGENTO_VERIFY_LOGIN_OTP_MUTATION } from "@/services/auth/auth.gql";
import { mapAuthErrorMessage } from "@/services/auth/authErrorMessages";
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

  const phone = normalizePhoneForMagento(body.phone?.trim() ?? "");
  const otp = body.otp?.trim();
  const email = body.email?.trim().toLowerCase();
  const firstName = body.firstName?.trim();
  const lastName = body.lastName?.trim();

  if (!otp) {
    return NextResponse.json({ error: "A verification code is required" }, { status: 400 });
  }
  if (!phone && !email) {
    return NextResponse.json(
      { error: "A phone number or email address is required" },
      { status: 400 },
    );
  }

  // With a phone present the email is the new account's address; without one the
  // email IS the verified identifier. Magento applies the same precedence.
  const isCompletingRegistration = phone
    ? Boolean(email && firstName)
    : Boolean(firstName);

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
          phone: phone || null,
          email: email || null,
          otp,
          first_name: firstName || null,
          last_name: lastName || null,
        },
      },
      cache: "no-store",
    });

    const { token, registration_required, customer_created } = data.verifyLoginOtp;

    if (token) {
      await setCustomerTokenCookie(token);
      return NextResponse.json({
        ok: true,
        loggedIn: true,
        registrationRequired: false,
        customerCreated: customer_created,
      });
    }

    if (registration_required) {
      return NextResponse.json({ ok: true, loggedIn: false, registrationRequired: true });
    }

    if (isCompletingRegistration) {
      return NextResponse.json(
        {
          error:
            "We could not create your account in Magento. Please request a new OTP and try again.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true, loggedIn: false, registrationRequired: false });
  } catch (error) {
    const message =
      error instanceof MagentoGraphqlError
        ? mapAuthErrorMessage(error.message, "OTP verification failed")
        : "OTP verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
