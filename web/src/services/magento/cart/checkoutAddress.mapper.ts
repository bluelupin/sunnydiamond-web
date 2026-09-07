import type { CheckoutFormData } from "@/features/checkout/types/checkout.types";
import { mapCustomerAddressToFormInput } from "@/services/customer/customer-account.mapper";
import type { CustomerAddress } from "@/services/customer/customer-account.types";
import { getIndiaMagentoRegionId } from "../regions/indiaRegionIds";
import type { MagentoCartAddressInput, MagentoShippingAddressInput } from "./magentoCart.types";
import { splitFullName } from "@/shared/utils/customerName";

export { splitFullName } from "@/shared/utils/customerName";

export function resolveGuestCheckoutEmail(phoneOrEmail: string): string {
  const trimmed = phoneOrEmail.trim();

  if (trimmed.includes("@")) {
    return trimmed;
  }

  const phone = trimmed.replace(/\D/g, "");
  return `guest+${phone || "checkout"}@sunnydiamond.com`;
}

function resolveTelephone(primary: string, fallback: string): string {
  const digits = (primary || fallback).replace(/\D/g, "");
  return digits || "0000000000";
}

function mapAddressBlock(input: {
  name: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  state: string;
  phone: string;
  phoneFallback: string;
}): MagentoCartAddressInput {
  const regionId = getIndiaMagentoRegionId(input.state);

  if (!regionId) {
    throw new Error(`Unsupported delivery state: ${input.state}`);
  }

  const { firstname, lastname } = splitFullName(input.name);
  const street = [input.addressLine1.trim(), input.addressLine2.trim()].filter(Boolean);

  if (street.length === 0) {
    throw new Error("Address line 1 is required");
  }

  return {
    firstname,
    lastname,
    street,
    city: input.city.trim(),
    postcode: input.pincode.trim(),
    country_code: "IN",
    region_id: regionId,
    telephone: resolveTelephone(input.phone, input.phoneFallback),
    save_in_address_book: false,
  };
}

export function mapCheckoutFormToShippingAddress(form: CheckoutFormData): MagentoCartAddressInput {
  return mapAddressBlock({
    name: form.shippingName,
    addressLine1: form.addressLine1,
    addressLine2: form.addressLine2,
    pincode: form.pincode,
    city: form.city,
    state: form.state,
    phone: form.shippingPhone,
    phoneFallback: form.phoneOrEmail,
  });
}

export function mapCheckoutFormToBillingAddress(form: CheckoutFormData): MagentoCartAddressInput {
  return mapAddressBlock({
    name: form.billingName,
    addressLine1: form.billingAddressLine1,
    addressLine2: form.billingAddressLine2,
    pincode: form.billingPincode,
    city: form.billingCity,
    state: form.billingState,
    phone: form.billingPhone,
    // Shipping phone first: the contact field is an email whenever mobile sign-in is
    // off, and falling straight back to it would put "0000000000" on the address.
    phoneFallback: form.shippingPhone || form.phoneOrEmail,
  });
}

function normalizeCheckoutCompareValue(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeCheckoutPhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function doesCheckoutShippingMatchSavedAddress(
  form: CheckoutFormData,
  address: CustomerAddress,
): boolean {
  const mapped = mapCustomerAddressToFormInput(address);

  return (
    normalizeCheckoutCompareValue(form.shippingName) === normalizeCheckoutCompareValue(mapped.name) &&
    normalizeCheckoutCompareValue(form.addressLine1) ===
      normalizeCheckoutCompareValue(mapped.addressLine1) &&
    normalizeCheckoutCompareValue(form.addressLine2) ===
      normalizeCheckoutCompareValue(mapped.addressLine2 ?? "") &&
    normalizeCheckoutCompareValue(form.pincode) === normalizeCheckoutCompareValue(mapped.pincode) &&
    normalizeCheckoutCompareValue(form.city) === normalizeCheckoutCompareValue(mapped.city) &&
    normalizeCheckoutCompareValue(form.state) === normalizeCheckoutCompareValue(mapped.state) &&
    normalizeCheckoutPhone(form.shippingPhone) === normalizeCheckoutPhone(mapped.phone)
  );
}

/**
 * Uses a saved customer address by uid only when checkout still matches that address.
 * Otherwise applies a one-off cart address that must not be saved to the profile.
 */
export function buildCheckoutShippingAddressInput(
  form: CheckoutFormData,
  savedAddresses: CustomerAddress[] = [],
): MagentoShippingAddressInput {
  const selectedUid = form.selectedShippingAddressUid?.trim();

  if (selectedUid) {
    const selectedAddress = savedAddresses.find((address) => address.uid === selectedUid);

    if (selectedAddress && doesCheckoutShippingMatchSavedAddress(form, selectedAddress)) {
      return {
        customer_address_uid: selectedUid,
      };
    }
  }

  return {
    address: mapCheckoutFormToShippingAddress(form),
  };
}
