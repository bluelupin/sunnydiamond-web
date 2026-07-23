import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import {
  MAGENTO_ADD_PRODUCTS_TO_WISHLIST_MUTATION,
  MAGENTO_CUSTOMER_CART_QUERY,
  MAGENTO_CUSTOMER_WISHLIST_IDS_QUERY,
  MAGENTO_MERGE_CARTS_MUTATION,
} from "@/services/customer/customer.gql";
import { getGuestCartId, setGuestCartId } from "@/services/magento/cart/cartSession";

const WISHLIST_STORAGE_KEY = "sunny-wishlist";

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

/** Pushes locally saved wishlist SKUs into the customer's Magento wishlist. */
async function pushWishlist(): Promise<void> {
  let skus: string[] = [];
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    skus = Array.isArray(parsed)
      ? parsed.filter((sku): sku is string => typeof sku === "string" && sku.length > 0)
      : [];
  } catch {
    skus = [];
  }

  if (!skus.length) {
    return;
  }

  const data = await magentoGraphqlFetch<{
    customer: { wishlists: Array<{ id: string }> };
  }>({
    query: MAGENTO_CUSTOMER_WISHLIST_IDS_QUERY,
    cache: "no-store",
  });

  const wishlistId = data.customer.wishlists[0]?.id;
  if (!wishlistId) {
    return;
  }

  await magentoGraphqlFetch({
    query: MAGENTO_ADD_PRODUCTS_TO_WISHLIST_MUTATION,
    variables: {
      wishlistId,
      wishlistItems: skus.map((sku) => ({ sku, quantity: 1 })),
    },
    cache: "no-store",
  });
}

/**
 * Post-login side effects. Login must succeed even when these fail —
 * callers should not await-and-throw on this.
 */
export async function runPostLoginSync(): Promise<{ cartMerged: boolean; wishlistPushed: boolean }> {
  const [cartResult, wishlistResult] = await Promise.allSettled([
    mergeGuestCart(),
    pushWishlist(),
  ]);

  return {
    cartMerged: cartResult.status === "fulfilled",
    wishlistPushed: wishlistResult.status === "fulfilled",
  };
}
