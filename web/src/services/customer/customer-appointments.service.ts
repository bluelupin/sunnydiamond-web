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

/**
 * Strapi customer appointments — Magento customer token as Bearer.
 * Call only from server (BFF) with token from httpOnly cookie.
 */
export async function fetchCustomerAppointments(
  authToken: string,
  page = 1,
  pageSize = 20,
  signal?: AbortSignal,
): Promise<CustomerAppointmentsPage> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.min(100, Math.max(1, pageSize));
  const params = new URLSearchParams({
    page: String(safePage),
    pageSize: String(safePageSize),
  });

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.customerAppointments}?${params.toString()}`;
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
