import type { AuthCustomer } from "@/features/auth/context/AuthContext";
import {
  getAuthLoginIdentifierKind,
  resolveCustomerContactLockKind,
} from "@/features/auth/utils/authLoginIdentifier";
import { mapCustomerAddressToFormInput } from "@/services/customer/customer-account.mapper";
import type { CustomerAddress } from "@/services/customer/customer-account.types";
import { formatCustomerFullName } from "@/shared/utils/customerName";
import { isCheckoutEmailContact } from "@/shared/utils/formValidation";
import { splitPhoneNumber } from "@/lib/auth/magentoPhone";
import type { CheckoutFormData } from "../types/checkout.types";

export function buildCheckoutContactPrefill(customer: AuthCustomer): Pick<
  CheckoutFormData,
  "name" | "phoneOrEmail" | "shippingName" | "contactCountryCode"
> {
  const fullName = formatCustomerFullName(customer.firstname, customer.lastname);
  const contactLockKind = resolveCustomerContactLockKind(customer.signupMethod);

  if (contactLockKind === "phone" && customer.phone?.trim()) {
    const phone = splitPhoneNumber(customer.phone);
    return {
      name: fullName,
      phoneOrEmail: phone.national,
      contactCountryCode: phone.countryCode,
      shippingName: fullName,
    };
  }

  return {
    name: fullName,
    phoneOrEmail: customer.email,
    contactCountryCode: "+91",
    shippingName: fullName,
  };
}

/** Signed-in contact field validates as email only when signup identity is email (same as Profile locks). */
export function isAuthenticatedCheckoutContactEmailOnly(
  customer: AuthCustomer | null | undefined,
): boolean {
  return resolveCustomerContactLockKind(customer?.signupMethod) !== "phone";
}

function isCheckoutIdentityOtpProven(
  customer: AuthCustomer,
  kind: "email" | "phone",
): boolean {
  if (kind === "phone") {
    if (customer.phoneVerified === true) return true;
    return getAuthLoginIdentifierKind() === "phone" && Boolean(customer.phone?.trim());
  }
  if (customer.emailVerified === true) return true;
  return getAuthLoginIdentifierKind() === "email" && Boolean(customer.email?.trim());
}

/** OTP-verified checkout contact — matches the prefilled email/phone and Magento or session proof. */
export function isAuthenticatedCheckoutContactVerified(
  customer: AuthCustomer | null | undefined,
): boolean {
  if (!customer) return false;
  const prefill = buildCheckoutContactPrefill(customer);
  const kind = isCheckoutEmailContact(prefill.phoneOrEmail) ? "email" : "phone";
  return isCheckoutIdentityOtpProven(customer, kind);
}

export function sanitizeCheckoutFormNames(form: CheckoutFormData): CheckoutFormData {
  return {
    ...form,
    name: formatCustomerFullName(form.name),
    shippingName: formatCustomerFullName(form.shippingName),
    billingName: formatCustomerFullName(form.billingName),
  };
}

export function applyCustomerAddressToCheckoutForm(
  form: CheckoutFormData,
  address: CustomerAddress,
): CheckoutFormData {
  const mapped = mapCustomerAddressToFormInput(address);
  const phone = splitPhoneNumber(mapped.phone);

  return sanitizeCheckoutFormNames({
    ...form,
    shippingName: mapped.name,
    addressLine1: mapped.addressLine1,
    addressLine2: mapped.addressLine2 ?? "",
    pincode: mapped.pincode,
    city: mapped.city,
    state: mapped.state,
    shippingPhone: phone.national,
    shippingCountryCode: phone.countryCode,
    selectedShippingAddressUid: address.uid,
  });
}

export const CHECKOUT_SHIPPING_ADDRESS_FIELDS: ReadonlyArray<keyof CheckoutFormData> = [
  "shippingName",
  "addressLine1",
  "addressLine2",
  "pincode",
  "city",
  "state",
  "shippingPhone",
  "shippingCountryCode",
];
