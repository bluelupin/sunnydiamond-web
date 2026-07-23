import type {
  CustomerAddress,
  CustomerAddressInput,
  CustomerOrdersPage,
} from "./customer-account.types";

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

export async function getCustomerOrders(
  page = 1,
  pageSize = 10,
  signal?: AbortSignal,
): Promise<CustomerOrdersPage | null> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    const response = await fetch(`/api/customer/orders?${params.toString()}`, {
      cache: "no-store",
      signal,
    });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    return (await response.json()) as CustomerOrdersPage;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return null;
  }
}

export async function getCustomerAddresses(signal?: AbortSignal): Promise<CustomerAddress[] | null> {
  try {
    const response = await fetch("/api/customer/addresses", {
      cache: "no-store",
      signal,
    });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      throw new Error(await parseApiError(response));
    }

    const payload = (await response.json()) as { addresses: CustomerAddress[] };
    return payload.addresses;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return null;
  }
}

export async function saveCustomerAddress(
  input: CustomerAddressInput,
  uid?: string,
): Promise<CustomerAddress[]> {
  const response = await fetch(
    uid ? `/api/customer/addresses/${encodeURIComponent(uid)}` : "/api/customer/addresses",
    {
      method: uid ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const payload = (await response.json()) as { addresses: CustomerAddress[] };
  return payload.addresses;
}

export async function removeCustomerAddress(uid: string): Promise<CustomerAddress[]> {
  const response = await fetch(`/api/customer/addresses/${encodeURIComponent(uid)}`, {
    method: "DELETE",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const payload = (await response.json()) as { addresses: CustomerAddress[] };
  return payload.addresses;
}
