import type { AuthCustomer } from "@/features/auth/context/AuthContext";
import { mapCustomerAddressToFormInput } from "@/services/customer/customer-account.mapper";
import type { CustomerAddress, CustomerAddressInput } from "@/services/customer/customer-account.types";
import type { CheckoutFormData } from "../types/checkout.types";

export function buildCheckoutContactPrefill(customer: AuthCustomer): Pick<
  CheckoutFormData,
  "name" | "phoneOrEmail" | "shippingName"
> {
  const fullName = [customer.firstname, customer.lastname].filter(Boolean).join(" ");

  return {
    name: fullName,
    phoneOrEmail: customer.email,
    shippingName: fullName,
  };
}

export function applyCustomerAddressToCheckoutForm(
  form: CheckoutFormData,
  address: CustomerAddress,
): CheckoutFormData {
  const mapped = mapCustomerAddressToFormInput(address);

  return {
    ...form,
    selectedShippingAddressUid: address.uid,
    addressEntryMode: "saved",
    saveNewAddress: false,
    shippingName: mapped.name,
    addressLine1: mapped.addressLine1,
    addressLine2: mapped.addressLine2 ?? "",
    pincode: mapped.pincode,
    city: mapped.city,
    state: mapped.state,
    shippingPhone: mapped.phone,
  };
}

export function mapCheckoutFormToCustomerAddressInput(form: CheckoutFormData): CustomerAddressInput {
  const phoneDigits = (form.shippingPhone || form.phoneOrEmail).replace(/\D/g, "");

  return {
    name: form.shippingName || form.name,
    addressLine1: form.addressLine1,
    addressLine2: form.addressLine2,
    pincode: form.pincode,
    city: form.city,
    state: form.state,
    phone: phoneDigits,
    defaultShipping: true,
    defaultBilling: form.billingSameAsShipping,
  };
}
