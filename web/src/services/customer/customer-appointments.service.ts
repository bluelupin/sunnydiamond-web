import { getStrapiBaseUrl } from "@/api/config";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapCustomerAppointment, mapCustomerAppointmentsPage } from "./customer-appointments.mapper";
import type {
  CustomerAppointment,
  CustomerAppointmentsPage,
  StrapiCustomerAppointment,
  StrapiCustomerAppointmentsResponse,
} from "./customer-appointments.types";

export type RescheduleCustomerAppointmentInput = {
  requestedDate: string;
  selectedTimeSlot: string;
};

export class CustomerAppointmentsApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "CustomerAppointmentsApiError";
    this.status = status;
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as {
      error?: string | {
        message?: string;
        name?: string;
        details?: { key?: string; path?: string; source?: string };
      };
      message?: string;
    };

    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }

    if (payload.error && typeof payload.error === "object") {
      const message =
        typeof payload.error.message === "string" ? payload.error.message.trim() : "";
      const details = payload.error.details;
      const detailPath =
        typeof details?.path === "string"
          ? details.path
          : typeof details?.key === "string"
            ? details.key
            : "";

      if (message && detailPath) {
        return `${message} (${detailPath})`;
      }
      if (message) {
        return message;
      }
    }

    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }
  } catch {
    // ignore parse errors
  }

  return `Request failed (${response.status})`;
}

function getStrapiApiToken(): string | null {
  const token =
    process.env.STRAPI_API_TOKEN?.trim() || process.env.CMS_API_TOKEN?.trim();
  return token || null;
}

/**
 * Strapi customer appointments list.
 * CMS expects server CMS API token as Bearer + `magentoCustomerId` query
 * (Magento customer Bearer alone returns "Missing or invalid credentials").
 * Call only from server (BFF) after resolving the Magento customer id.
 */
export async function fetchCustomerAppointments(
  page = 1,
  pageSize = 20,
  options: {
    magentoCustomerId: number;
    signal?: AbortSignal;
  },
): Promise<CustomerAppointmentsPage> {
  const cmsToken = getStrapiApiToken();
  if (!cmsToken) {
    throw new CustomerAppointmentsApiError(
      "CMS API token is not configured",
      503,
    );
  }

  const magentoCustomerId = options.magentoCustomerId;
  if (!Number.isFinite(magentoCustomerId) || magentoCustomerId <= 0) {
    throw new CustomerAppointmentsApiError("Missing magentoCustomerId", 400);
  }

  const safePage = Math.max(1, page);
  const safePageSize = Math.min(100, Math.max(1, pageSize));
  const params = new URLSearchParams({
    page: String(safePage),
    pageSize: String(safePageSize),
    magentoCustomerId: String(magentoCustomerId),
  });

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.customerAppointments}?${params.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${cmsToken}`,
    },
    cache: "no-store",
    signal: options.signal,
  });

  if (!response.ok) {
    throw new CustomerAppointmentsApiError(await parseErrorMessage(response), response.status);
  }

  const payload = (await response.json()) as StrapiCustomerAppointmentsResponse;
  return mapCustomerAppointmentsPage(payload);
}

export async function rescheduleCustomerAppointment(
  authToken: string,
  documentId: string,
  input: RescheduleCustomerAppointmentInput,
  signal?: AbortSignal,
): Promise<CustomerAppointment> {
  const safeId = documentId.trim();

  if (!safeId) {
    throw new CustomerAppointmentsApiError("Missing appointment id", 400);
  }

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.customerAppointments}/${encodeURIComponent(safeId)}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new CustomerAppointmentsApiError(await parseErrorMessage(response), response.status);
  }

  const payload = (await response.json()) as {
    data?: StrapiCustomerAppointment | null;
  };

  const mapped = mapCustomerAppointment(payload.data ?? {});

  if (!mapped) {
    throw new CustomerAppointmentsApiError("Invalid appointment response", 502);
  }

  return mapped;
}
