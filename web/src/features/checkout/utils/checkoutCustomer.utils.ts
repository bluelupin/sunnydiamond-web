import type { AuthCustomer } from "@/features/auth/context/AuthContext";
import { mapCustomerAddressToFormInput } from "@/services/customer/customer-account.mapper";
import type { CustomerAddress } from "@/services/customer/customer-account.types";
import { formatCustomerFullName } from "@/shared/utils/customerName";
import type { CheckoutFormData } from "../types/checkout.types";

export function buildCheckoutContactPrefill(customer: AuthCustomer): Pick<
  CheckoutFormData,
  "name" | "phoneOrEmail" | "shippingName"
> {
  const fullName = formatCustomerFullName(customer.firstname, customer.lastname);

  return {
    name: fullName,
    phoneOrEmail: customer.email,
    shippingName: fullName,
  };
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

  return sanitizeCheckoutFormNames({
    ...form,
    shippingName: mapped.name,
    addressLine1: mapped.addressLine1,
    addressLine2: mapped.addressLine2 ?? "",
    pincode: mapped.pincode,
    city: mapped.city,
    state: mapped.state,
    shippingPhone: mapped.phone,
  });
}
