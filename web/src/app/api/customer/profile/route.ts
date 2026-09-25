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

export async function PATCH(request: Request) {
  const token = await getCustomerTokenFromRequest(request);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { fullName?: string; phone?: string };

    // Unverified save, allowed only while SMS OTP is switched off. With OTP on
    // the number is a sign-in factor, so it must go through /api/customer/phone
    // and be proven reachable first — enforced here, not just in the UI.
    if (body.phone !== undefined) {
      const { otpLoginEnabled } = await fetchAuthFeatureFlags();
      if (otpLoginEnabled) {
        return NextResponse.json(
          { error: "Mobile numbers must be verified with an OTP before they can be saved." },
          { status: 409 },
        );
      }
      const phone = normalizePhoneForMagento(body.phone.trim());
      if (phone && !/^\+91\d{10}$/.test(phone)) {
        return NextResponse.json(
          { error: "Enter a valid 10-digit mobile number" },
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
