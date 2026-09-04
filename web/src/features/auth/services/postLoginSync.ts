import { getGuestCartId, setGuestCartId } from "@/services/magento/cart/cartSession";
import {
  clearGuestWishlistStorage,
  readGuestWishlistFromStorage,
} from "@/features/wishlist/utils/guestWishlistStorage";
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

/** Merges local guest wishlist SKUs into Magento, then clears local storage on success. */
async function syncWishlistAfterLogin(): Promise<void> {
  const localSkus = readGuestWishlistFromStorage();
  if (localSkus.length === 0) {
    return;
  }

  await syncCustomerWishlist(localSkus);
  clearGuestWishlistStorage();
}

/**
 * Post-login side effects. Login must succeed even when these fail —
 * callers should not await-and-throw on this.
 */
export async function runPostLoginSync(): Promise<{ cartMerged: boolean; wishlistPushed: boolean }> {
  const [cartResult, wishlistResult] = await Promise.allSettled([
    mergeGuestCart(),
    syncWishlistAfterLogin(),
  ]);

  return {
    cartMerged: cartResult.status === "fulfilled",
    wishlistPushed: wishlistResult.status === "fulfilled",
  };
}
