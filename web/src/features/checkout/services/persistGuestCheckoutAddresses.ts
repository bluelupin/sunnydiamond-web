import {
  getCustomerAddresses,
  saveCustomerAddress,
} from "@/services/customer/customer-account.client";
import { doesCustomerAddressMatchInput } from "@/services/customer/customer-account.mapper";
import type { CustomerAddress, CustomerAddressInput } from "@/services/customer/customer-account.types";
import {
  doesCheckoutShippingMatchSavedAddress,
  mapCheckoutFormToBillingCustomerAddressInput,
  mapCheckoutFormToCustomerAddressInput,
} from "@/services/magento/cart/checkoutAddress.mapper";
import type { CheckoutFormData } from "../types/checkout.types";

function hasMatchingSavedAddress(
  input: CustomerAddressInput,
  addresses: CustomerAddress[],
): boolean {
  return addresses.some((address) => doesCustomerAddressMatchInput(input, address));
}

async function saveAddressIfMissing(
  input: CustomerAddressInput,
  addresses: CustomerAddress[],
  defaults: Pick<CustomerAddressInput, "defaultShipping" | "defaultBilling">,
): Promise<CustomerAddress[]> {
  if (hasMatchingSavedAddress(input, addresses)) {
    return addresses;
  }

  return saveCustomerAddress({
    ...input,
    ...defaults,
  });
}

/** Best-effort: persist guest checkout addresses to the signed-in customer profile. */
export async function persistGuestCheckoutAddresses(form: CheckoutFormData): Promise<void> {
  const shippingInput = mapCheckoutFormToCustomerAddressInput(form);
  if (!shippingInput) {
    return;
  }

  try {
    let addresses = (await getCustomerAddresses()) ?? [];

    const shippingAlreadySaved =
      addresses.some((address) => doesCheckoutShippingMatchSavedAddress(form, address)) ||
      hasMatchingSavedAddress(shippingInput, addresses);

    if (!shippingAlreadySaved) {
      const isFirstAddress = addresses.length === 0;
      addresses = await saveAddressIfMissing(shippingInput, addresses, {
        defaultShipping: isFirstAddress || !addresses.some((address) => address.isDefaultShipping),
        defaultBilling:
          form.billingSameAsShipping &&
          (isFirstAddress || !addresses.some((address) => address.isDefaultBilling)),
      });
    }

    if (form.billingSameAsShipping) {
      return;
    }

    const billingInput = mapCheckoutFormToBillingCustomerAddressInput(form);
    if (!billingInput) {
      return;
    }

    await saveAddressIfMissing(billingInput, addresses, {
      defaultBilling: !addresses.some((address) => address.isDefaultBilling),
    });
  } catch {
    // Order already succeeded; address persistence must not block checkout success.
  }
}
