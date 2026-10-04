import { NextResponse } from "next/server";
import { getCustomerTokenFromRequest } from "@/services/auth/session";
import {
  updateCustomerName,
  updateCustomerPhone,
} from "@/services/customer/customer-account.service";
import { splitProfileFullName } from "@/features/account/utils/formatAccountData";
import { normalizePhoneForMagento } from "@/lib/auth/magentoPhone";
import { mapAuthErrorMessage } from "@/services/auth/authErrorMessages";
import { fetchAuthFeatureFlags } from "@/features/auth/services/authFeatures.server";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";

export async function PATCH(request: Request) {
  const token = await getCustomerTokenFromRequest(request);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { fullName?: string; phone?: string };

    // Saves a number as typed, without a code. The store signs in only numbers
    // proven with a code, and an account that merely typed one gives it up when its
    // owner proves it, so a typed number is a contact detail (Profile shows VERIFY).
    // A number that IS proven signs the customer in: replacing it needs a code
    // (/api/customer/phone), enforced here and not just in the UI.
    if (body.phone !== undefined) {
      const { otpLoginEnabled } = await fetchAuthFeatureFlags();
      if (otpLoginEnabled) {
        const current = await magentoGraphqlFetch<{ customer?: { sd_mobile_verified?: boolean | null } }>({
          query: "query ProfilePhoneProven { customer { sd_mobile_verified } }",
          authToken: token,
          cache: "no-store",
        });
        if (current.customer?.sd_mobile_verified === true) {
          return NextResponse.json(
            { error: "Mobile numbers must be verified with an OTP before they can be saved." },
            { status: 409 },
          );
        }
      }
      const phone = normalizePhoneForMagento(body.phone.trim());
      if (phone && !/^\+\d{8,15}$/.test(phone)) {
        return NextResponse.json(
          { error: "Enter a valid mobile number" },
          { status: 400 },
        );
      }
      await updateCustomerPhone(token, phone);
      return NextResponse.json({ ok: true });
    }

    const fullName = body.fullName?.trim() ?? "";

    if (!fullName) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { firstname, lastname } = splitProfileFullName(fullName);
    const customer = await updateCustomerName(token, { firstname, lastname });
    return NextResponse.json({ customer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json(
      { error: mapAuthErrorMessage(message, "Failed to update profile") },
      { status: 400 },
    );
  }
}
