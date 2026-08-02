import { createCustomerAccount } from "@/features/auth/services/auth.service";
import { resolveGuestCheckoutEmail } from "@/services/magento/cart/checkoutAddress.mapper";
import type { CheckoutFormData } from "../types/checkout.types";

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
  const phone = getCheckoutPhoneDigits(form);
  const otpCode = otp.trim();
  const fullName = getCheckoutRegistrationName(form);

  if (!phone || phone.length < 10 || !otpCode || !fullName) {
    return false;
  }

  const result = await createCustomerAccount({
    phone,
    otp: otpCode,
    fullName,
    email: getCheckoutRegistrationEmail(form),
    marketingOptIn: false,
  });

  return result.success;
}
