import type { CustomerWishlist } from "./customer-wishlist.types";

type ApiErrorPayload = {
  error?: string;
};

async function parseApiError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorPayload;
    return payload.error ?? `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export async function getCustomerWishlist(signal?: AbortSignal): Promise<CustomerWishlist | null> {
  try {
    const response = await fetch("/api/customer/wishlist", {
      cache: "no-store",
      signal,
    });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    return (await response.json()) as CustomerWishlist;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return null;
  }
}

export async function addCustomerWishlistSku(sku: string): Promise<CustomerWishlist> {
  const response = await fetch("/api/customer/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sku }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as CustomerWishlist;
}

export async function removeCustomerWishlistSku(sku: string): Promise<CustomerWishlist> {
  const response = await fetch("/api/customer/wishlist", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sku }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as CustomerWishlist;
}

export async function syncCustomerWishlist(skus: string[]): Promise<CustomerWishlist> {
  const response = await fetch("/api/customer/wishlist/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skus }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as CustomerWishlist;
}
