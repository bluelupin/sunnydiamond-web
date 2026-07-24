import type {
  CustomerSavedCreationsPage,
  SaveCustomerCreationResult,
} from "./customer-saved-creations.types";

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

/** Browser → Next BFF (session cookie). Never sends Magento token from the client. */
export async function getCustomerSavedCreations(
  page = 1,
  pageSize = 20,
  signal?: AbortSignal,
): Promise<CustomerSavedCreationsPage | null> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  const response = await fetch(`/api/customer/saved-creations?${params.toString()}`, {
    cache: "no-store",
    credentials: "same-origin",
    signal,
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as CustomerSavedCreationsPage;
}

export async function saveCustomerCreationClient(
  creationDocumentId: string,
  signal?: AbortSignal,
): Promise<SaveCustomerCreationResult> {
  const response = await fetch("/api/customer/saved-creations", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ creationDocumentId }),
    cache: "no-store",
    credentials: "same-origin",
    signal,
  });

  if (response.status === 401) {
    throw new Error("Please sign in to save this inspiration.");
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as SaveCustomerCreationResult;
}
