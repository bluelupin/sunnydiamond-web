import { createCustomerAccount, type OtpTarget } from "@/features/auth/services/auth.service";
import { formatLoginPhoneForMagento } from "@/lib/auth/magentoPhone";
import { resolveGuestCheckoutEmail } from "@/services/magento/cart/checkoutAddress.mapper";
import type { CheckoutFormData } from "../types/checkout.types";

/** OTP verify target for the contact the guest typed on checkout. */
export function buildCheckoutOtpTarget(form: CheckoutFormData): OtpTarget {
  const contact = form.phoneOrEmail.trim();
  if (contact.includes("@")) {
    return { kind: "email", email: contact.toLowerCase() };
  }

  const phone = getCheckoutPhoneDigits(form);
  return {
    kind: "phone",
    phone: formatLoginPhoneForMagento(form.contactCountryCode || "+91", phone),
  };
}

export function getCheckoutPhoneDigits(form: CheckoutFormData): string {
  const candidate = form.phoneOrEmail.includes("@")
    ? form.shippingPhone
    : form.phoneOrEmail;

  return candidate.replace(/\D/g, "");
}

export function getCheckoutRegistrationEmail(form: CheckoutFormData): string {
  return resolveGuestCheckoutEmail(form.phoneOrEmail);
}

export function getCheckoutRegistrationName(form: CheckoutFormData): string {
  return form.name.trim() || form.shippingName.trim();
}

/** Best-effort Magento account creation for a guest who just placed an order. */
export async function registerGuestCustomerAfterOrder(
  form: CheckoutFormData,
  otp: string,
): Promise<boolean> {
  const contact = form.phoneOrEmail.trim();
  const phone = getCheckoutPhoneDigits(form);
  const otpCode = otp.trim();
  const fullName = getCheckoutRegistrationName(form);

  // The OTP was sent to the contact field: an email address, or a mobile number.
  const target: OtpTarget = contact.includes("@")
    ? { kind: "email", email: contact.toLowerCase() }
    : { kind: "phone", phone: formatLoginPhoneForMagento(form.contactCountryCode || "+91", phone) };

  if ((target.kind === "phone" && phone.length < 7) || !otpCode || !fullName) {
    return false;
  }

  const result = await createCustomerAccount({
    target,
    otp: otpCode,
    fullName,
    email: getCheckoutRegistrationEmail(form),
    marketingOptIn: false,
  });

  return result.success;
}
