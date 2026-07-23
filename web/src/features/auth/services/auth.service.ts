export type VerifyOtpResult =
  | { success: true; requiresAccountSetup: boolean }
  | { success: false; error: string };

/** Dev stub: treat these numbers as already-registered customers. */
const EXISTING_CUSTOMER_PHONES = new Set(["9876543210", "9999900000"]);

const isExistingCustomerPhone = (phone: string) => EXISTING_CUSTOMER_PHONES.has(phone);

/**
 * Verifies the OTP for phone-based sign in.
 * TODO(auth): replace with Magento OTP verification and customer lookup.
 */
export async function verifyLoginOtp(
  phone: string,
  code: string,
): Promise<VerifyOtpResult> {
  await Promise.resolve();

  if (!/^\d{6}$/.test(code)) {
    return { success: false, error: "Incorrect code" };
  }

  if (code === "000000") {
    return { success: false, error: "Incorrect code" };
  }

  return {
    success: true,
    requiresAccountSetup: !isExistingCustomerPhone(phone),
  };
}

/**
 * Creates a new customer account after OTP verification.
 * TODO(auth): replace with Magento customer registration.
 */
export async function createCustomerAccount(_input: {
  phone: string;
  fullName: string;
  email: string;
  marketingOptIn: boolean;
}): Promise<{ success: boolean }> {
  await Promise.resolve();
  return { success: true };
}
