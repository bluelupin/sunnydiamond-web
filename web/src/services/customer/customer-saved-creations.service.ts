import { getStrapiBaseUrl } from "@/api/config";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import {
  mapSaveCreationResult,
  mapSavedCreationsPage,
} from "./customer-saved-creations.mapper";
import type {
  CustomerSavedCreationsPage,
  SaveCustomerCreationResult,
  StrapiSaveCreationResponse,
  StrapiSavedCreationsResponse,
} from "./customer-saved-creations.types";

export class CustomerSavedCreationsApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "CustomerSavedCreationsApiError";
    this.status = status;
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as {
      error?: string | {
        message?: string;
        details?: { key?: string; path?: string };
      };
      message?: string;
    };

    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }

    if (payload.error && typeof payload.error === "object") {
      const message =
        typeof payload.error.message === "string" ? payload.error.message.trim() : "";
      if (message) return message;
    }

    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }
  } catch {
    // ignore
  }

  return `Request failed (${response.status})`;
}

/**
 * Strapi customer saved creations — Magento customer token as Bearer.
 * Call only from server (BFF) with token from httpOnly cookie.
 */
export async function fetchCustomerSavedCreations(
  authToken: string,
  page = 1,
  pageSize = 20,
  signal?: AbortSignal,
): Promise<CustomerSavedCreationsPage> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.min(100, Math.max(1, pageSize));
  const params = new URLSearchParams({
    page: String(safePage),
    pageSize: String(safePageSize),
  });

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.customerSavedCreations}?${params.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new CustomerSavedCreationsApiError(await parseErrorMessage(response), response.status);
  }

  const payload = (await response.json()) as StrapiSavedCreationsResponse;
  return mapSavedCreationsPage(payload);
}

export async function saveCustomerCreation(
  authToken: string,
  creationDocumentId: string,
  signal?: AbortSignal,
): Promise<SaveCustomerCreationResult> {
  const id = creationDocumentId.trim();
  if (!id) {
    throw new CustomerSavedCreationsApiError("Missing creationDocumentId", 400);
  }

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.customerSavedCreations}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ creationDocumentId: id }),
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new CustomerSavedCreationsApiError(await parseErrorMessage(response), response.status);
  }

  const payload = (await response.json()) as StrapiSaveCreationResponse;
  return mapSaveCreationResult(payload);
}
