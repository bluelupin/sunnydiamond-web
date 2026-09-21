import { getStrapiApiToken, getStrapiBaseUrl } from "@/api/config";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapCustomerAppointment, mapCustomerAppointmentsPage } from "./customer-appointments.mapper";
import type {
  CustomerAppointment,
  CustomerAppointmentsPage,
  StrapiAppointmentMutationResponse,
  StrapiCustomerAppointment,
  StrapiCustomerAppointmentsResponse,
} from "./customer-appointments.types";

export type RescheduleCustomerAppointmentInput = {
  requestedDate: string;
  selectedTimeSlot: string;
  /** Optional — backend accepts these on reschedule when provided. */
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  /** Optional — updates booking note / description. */
  requestDetails?: string;
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

function cmsAuthHeaders(extra?: HeadersInit): HeadersInit {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${getStrapiApiToken()}`,
    ...extra,
  };
}

/**
 * Strapi customer appointments — CMS API token as Bearer + magentoCustomerId.
 * Call only from server (BFF). Customer id must come from the Magento session.
 */
export async function fetchCustomerAppointments(
  magentoCustomerId: number,
  page = 1,
  pageSize = 20,
  signal?: AbortSignal,
): Promise<CustomerAppointmentsPage> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.min(100, Math.max(1, pageSize));
  const params = new URLSearchParams({
    magentoCustomerId: String(magentoCustomerId),
    page: String(safePage),
    pageSize: String(safePageSize),
  });

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.customerAppointments}?${params.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: cmsAuthHeaders(),
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
  magentoCustomerId: number,
  documentId: string,
  input: RescheduleCustomerAppointmentInput,
  signal?: AbortSignal,
): Promise<CustomerAppointment | StrapiAppointmentMutationResponse["data"]> {
  const safeId = documentId.trim();

  if (!safeId) {
    throw new CustomerAppointmentsApiError("Missing appointment id", 400);
  }

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.customerAppointments}/${encodeURIComponent(safeId)}/reschedule`;
  const response = await fetch(url, {
    method: "POST",
    headers: cmsAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      data: {
        magentoCustomerId,
        requestedDate: input.requestedDate,
        selectedTimeSlot: input.selectedTimeSlot,
        ...(input.customerName?.trim()
          ? { customerName: input.customerName.trim() }
          : {}),
        ...(input.customerPhone?.trim()
          ? { customerPhone: input.customerPhone.trim() }
          : {}),
        ...(input.customerEmail?.trim()
          ? { customerEmail: input.customerEmail.trim() }
          : {}),
        ...(input.requestDetails?.trim()
          ? { requestDetails: input.requestDetails.trim() }
          : {}),
      },
    }),
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new CustomerAppointmentsApiError(await parseErrorMessage(response), response.status);
  }

  const payload = (await response.json()) as StrapiAppointmentMutationResponse & {
    data?: StrapiCustomerAppointment | null;
  };

  const mapped = mapCustomerAppointment(payload.data ?? {});
  if (mapped) {
    return mapped;
  }

  return payload.data ?? null;
}

export async function cancelCustomerAppointment(
  magentoCustomerId: number,
  documentId: string,
  signal?: AbortSignal,
): Promise<CustomerAppointment | StrapiAppointmentMutationResponse["data"] | null> {
  const safeId = documentId.trim();

  if (!safeId) {
    throw new CustomerAppointmentsApiError("Missing appointment id", 400);
  }

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.customerAppointments}/${encodeURIComponent(safeId)}/cancel`;
  const response = await fetch(url, {
    method: "POST",
    headers: cmsAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      data: {
        magentoCustomerId,
      },
    }),
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new CustomerAppointmentsApiError(await parseErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return null;
  }

  try {
    const payload = (await response.json()) as StrapiAppointmentMutationResponse & {
      data?: StrapiCustomerAppointment | null;
    } & StrapiCustomerAppointment;

    const mapped = mapCustomerAppointment(payload.data ?? payload);
    if (mapped) {
      return mapped;
    }

    return payload.data ?? null;
  } catch {
    return null;
  }
}
