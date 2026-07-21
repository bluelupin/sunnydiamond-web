import type { CheckoutFormData } from "@/features/checkout/types/checkout.types";
import { getIndiaMagentoRegionId } from "../regions/indiaRegionIds";
import type { MagentoCartAddressInput } from "./magentoCart.types";

export function splitFullName(fullName: string): { firstname: string; lastname: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstname: "Guest", lastname: "-" };
  }

  if (parts.length === 1) {
    return { firstname: parts[0], lastname: "-" };
  }

  return {
    firstname: parts[0],
    lastname: parts.slice(1).join(" "),
  };
}

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
    phoneFallback: form.phoneOrEmail,
  });
}
