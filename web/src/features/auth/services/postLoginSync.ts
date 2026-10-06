import { getGuestCartId, setGuestCartId } from "@/services/magento/cart/cartSession";
import {
  clearGuestSavedInspirationsStorage,
  readGuestSavedInspirationsFromStorage,
} from "@/features/bespoke/utils/guestSavedInspirationsStorage";
import {
  clearGuestWishlistStorage,
  readGuestWishlistFromStorage,
} from "@/features/wishlist/utils/guestWishlistStorage";
import { syncCustomerSavedCreations } from "@/services/customer/customer-saved-creations.client";
import { syncCustomerAddressFromLatestOrder } from "@/services/customer/customer-account.client";
import { syncCustomerWishlist } from "@/services/customer/customer-wishlist.client";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import {
  MAGENTO_CUSTOMER_CART_QUERY,
  MAGENTO_MERGE_CARTS_MUTATION,
} from "@/services/customer/customer.gql";

/**
 * Merges the guest cart into the customer cart, then stores the customer cart id
 * so all existing cart hooks keep working (now authorized via the session cookie).
 */
async function mergeGuestCart(): Promise<void> {
  const data = await magentoGraphqlFetch<{ customerCart: { id: string } }>({
    query: MAGENTO_CUSTOMER_CART_QUERY,
    cache: "no-store",
  });

  const customerCartId = data.customerCart.id;
  const guestCartId = getGuestCartId();

  if (guestCartId && guestCartId !== customerCartId) {
    await magentoGraphqlFetch({
      query: MAGENTO_MERGE_CARTS_MUTATION,
      variables: { sourceCartId: guestCartId, destinationCartId: customerCartId },
      cache: "no-store",
    });
  }

  setGuestCartId(customerCartId);
}

/** Cart-only merge for authenticated sessions (safe to call on auth transitions). */
export async function mergeGuestCartForAuthenticatedSession(): Promise<void> {
  await mergeGuestCart();
}

/** Merges local guest wishlist SKUs into Magento, then clears local storage on success. */
async function syncWishlistAfterLogin(): Promise<void> {
  const localSkus = readGuestWishlistFromStorage();
  if (localSkus.length === 0) {
    return;
  }

  await syncCustomerWishlist(localSkus);
  clearGuestWishlistStorage();
}

async function syncSavedInspirationsAfterLogin(): Promise<void> {
  const localIds = readGuestSavedInspirationsFromStorage();
  if (localIds.length === 0) {
    return;
  }

  await syncCustomerSavedCreations(localIds);
  clearGuestSavedInspirationsStorage();
}

/** Backfill address book from the latest order when guest checkout was not persisted. */
async function syncGuestCheckoutAddressAfterLogin(): Promise<void> {
  await syncCustomerAddressFromLatestOrder();
}

/**
 * Post-login side effects. Login must succeed even when these fail —
 * callers should not await-and-throw on this.
 */
export async function runPostLoginSync(): Promise<{
  cartMerged: boolean;
  wishlistPushed: boolean;
  savedInspirationsPushed: boolean;
  addressSynced: boolean;
}> {
  const [cartResult, wishlistResult, savedInspirationsResult, addressResult] =
    await Promise.allSettled([
      mergeGuestCart(),
      syncWishlistAfterLogin(),
      syncSavedInspirationsAfterLogin(),
      syncGuestCheckoutAddressAfterLogin(),
    ]);

  return {
    cartMerged: cartResult.status === "fulfilled",
    wishlistPushed: wishlistResult.status === "fulfilled",
    savedInspirationsPushed: savedInspirationsResult.status === "fulfilled",
    addressSynced: addressResult.status === "fulfilled",
  };
}
