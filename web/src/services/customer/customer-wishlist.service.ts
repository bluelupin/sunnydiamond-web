import { normalizeWishlistSkus } from "@/features/wishlist/utils/wishlistProduct.utils";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import {
  MAGENTO_ADD_PRODUCTS_TO_WISHLIST_MUTATION,
  MAGENTO_CUSTOMER_WISHLIST_IDS_QUERY,
  MAGENTO_CUSTOMER_WISHLIST_QUERY,
  MAGENTO_REMOVE_PRODUCTS_FROM_WISHLIST_MUTATION,
} from "./customer.gql";
import {
  mapMagentoCustomerWishlist,
  mapMagentoWishlistItems,
  type MagentoCustomerWishlistPageResponse,
} from "./customer-wishlist.mapper";
import type { CustomerWishlist, CustomerWishlistItem } from "./customer-wishlist.types";

const WISHLIST_PAGE_SIZE = 100;

type WishlistMutationResponse = {
  user_errors?: Array<{ code?: string | null; message?: string | null }> | null;
};

function assertNoWishlistUserErrors(
  label: string,
  payload: WishlistMutationResponse | null | undefined,
): void {
  const errors = payload?.user_errors?.filter((error) => error?.message?.trim()) ?? [];
  if (errors.length === 0) {
    return;
  }

  const ignorableCodes = new Set(["PRODUCT_ALREADY_IN_WISHLIST"]);
  const blockingErrors = errors.filter((error) => !ignorableCodes.has(error.code ?? ""));

  if (blockingErrors.length > 0) {
    throw new Error(blockingErrors[0]?.message ?? `${label} failed`);
  }
}

async function getCustomerWishlistId(authToken: string): Promise<string> {
  const data = await magentoGraphqlFetch<{
    customer: { wishlists: Array<{ id: string }> };
  }>({
    query: MAGENTO_CUSTOMER_WISHLIST_IDS_QUERY,
    authToken,
    cache: "no-store",
  });

  const wishlistId = data.customer.wishlists[0]?.id?.trim();
  if (!wishlistId) {
    throw new Error("Customer wishlist not found");
  }

  return wishlistId;
}

async function fetchCustomerWishlistPage(
  authToken: string,
  currentPage: number,
): Promise<MagentoCustomerWishlistPageResponse> {
  return magentoGraphqlFetch<MagentoCustomerWishlistPageResponse>({
    query: MAGENTO_CUSTOMER_WISHLIST_QUERY,
    variables: { pageSize: WISHLIST_PAGE_SIZE, currentPage },
    authToken,
    cache: "no-store",
  });
}

async function fetchAllCustomerWishlistItems(authToken: string): Promise<{
  wishlistId: string;
  items: CustomerWishlistItem[];
}> {
  const firstPage = await fetchCustomerWishlistPage(authToken, 1);
  const wishlist = firstPage.customer.wishlists[0];
  const wishlistId = wishlist?.id?.trim();

  if (!wishlistId) {
    throw new Error("Customer wishlist not found");
  }

  const items = [...mapMagentoWishlistItems(wishlist.items_v2?.items)];
  const totalPages = wishlist.items_v2?.page_info?.total_pages ?? 1;

  for (let page = 2; page <= totalPages; page += 1) {
    const nextPage = await fetchCustomerWishlistPage(authToken, page);
    const nextWishlist = nextPage.customer.wishlists[0];
    items.push(...mapMagentoWishlistItems(nextWishlist?.items_v2?.items));
  }

  return { wishlistId, items };
}

export async function fetchCustomerWishlist(authToken: string): Promise<CustomerWishlist> {
  const { wishlistId, items } = await fetchAllCustomerWishlistItems(authToken);
  return mapMagentoCustomerWishlist(wishlistId, items);
}

export async function addSkusToCustomerWishlist(
  authToken: string,
  skus: string[],
): Promise<CustomerWishlist> {
  const normalizedSkus = normalizeWishlistSkus(skus);
  if (normalizedSkus.length === 0) {
    return fetchCustomerWishlist(authToken);
  }

  const wishlistId = await getCustomerWishlistId(authToken);

  const data = await magentoGraphqlFetch<{
    addProductsToWishlist: WishlistMutationResponse;
  }>({
    query: MAGENTO_ADD_PRODUCTS_TO_WISHLIST_MUTATION,
    variables: {
      wishlistId,
      wishlistItems: normalizedSkus.map((sku) => ({ sku, quantity: 1 })),
    },
    authToken,
    cache: "no-store",
  });

  assertNoWishlistUserErrors("Add to wishlist", data.addProductsToWishlist);
  return fetchCustomerWishlist(authToken);
}

export async function removeSkuFromCustomerWishlist(
  authToken: string,
  sku: string,
): Promise<CustomerWishlist> {
  const normalizedSku = sku.trim();
  if (!normalizedSku) {
    return fetchCustomerWishlist(authToken);
  }

  const { wishlistId, items } = await fetchAllCustomerWishlistItems(authToken);
  const itemIds = items.filter((item) => item.sku === normalizedSku).map((item) => item.id);

  if (itemIds.length === 0) {
    return mapMagentoCustomerWishlist(wishlistId, items);
  }

  const data = await magentoGraphqlFetch<{
    removeProductsFromWishlist: WishlistMutationResponse;
  }>({
    query: MAGENTO_REMOVE_PRODUCTS_FROM_WISHLIST_MUTATION,
    variables: {
      wishlistId,
      wishlistItemsIds: itemIds,
    },
    authToken,
    cache: "no-store",
  });

  assertNoWishlistUserErrors("Remove from wishlist", data.removeProductsFromWishlist);
  return fetchCustomerWishlist(authToken);
}

/**
 * Merges guest/local SKUs with the customer's Magento wishlist.
 * Local-only SKUs are pushed to Magento; Magento-only SKUs are returned for local hydration.
 */
export async function syncCustomerWishlist(
  authToken: string,
  localSkus: string[],
): Promise<CustomerWishlist> {
  const normalizedLocalSkus = normalizeWishlistSkus(localSkus);
  const remoteWishlist = await fetchCustomerWishlist(authToken);
  const remoteSkuSet = new Set(remoteWishlist.skus);
  const skusToPush = normalizedLocalSkus.filter((sku) => !remoteSkuSet.has(sku));

  if (skusToPush.length > 0) {
    return addSkusToCustomerWishlist(authToken, skusToPush);
  }

  return remoteWishlist;
}
