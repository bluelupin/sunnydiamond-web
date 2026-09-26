import { getStrapiApiToken, getStrapiBaseUrl } from "@/api/config";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapCustomerAppointment, mapCustomerAppointmentsPage } from "./customer-appointments.mapper";
import type {
  AddPieceToCustomerAppointmentInput,
  AddPieceToCustomerAppointmentResult,
  CustomerAppointment,
  CustomerAppointmentShowroom,
  CustomerAppointmentsPage,
  CustomerOpenAppointment,
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

type ShowroomLookup = {
  name: string;
  city: string;
  state: string;
  address: string;
  mapUrl: string;
  pincode: string;
  slug: string;
};

function cleanLookupText(value?: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  return "";
}

/**
 * Appointments `preferredShowroom` only returns documentId/slug/city/state.
 * Full address + mapUrl live on `/api/showrooms` — merge for Store Visit Details (Figma).
 */
async function fetchShowroomLookupByDocumentId(
  signal?: AbortSignal,
): Promise<Map<string, ShowroomLookup>> {
  const lookup = new Map<string, ShowroomLookup>();
  const params = new URLSearchParams({
    "pagination[pageSize]": "100",
  });
  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.showrooms}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal,
    });
    if (!response.ok) {
      return lookup;
    }

    const payload = (await response.json()) as {
      data?: Array<Record<string, unknown> | null> | null;
    };

    for (const item of payload.data ?? []) {
      if (!item || typeof item !== "object") continue;
      const documentId = cleanLookupText(item.documentId);
      if (!documentId) continue;

      const city = cleanLookupText(item.city);
      const slug = cleanLookupText(item.slug);
      lookup.set(documentId, {
        name: cleanLookupText(item.name) || city || slug,
        city,
        state: cleanLookupText(item.state),
        address: cleanLookupText(item.address),
        mapUrl:
          cleanLookupText(item.mapUrl) ||
          cleanLookupText(item.directionsUrl),
        pincode: cleanLookupText(item.pincode),
        slug,
      });
    }
  } catch {
    // Enrichment is best-effort — listing still works with city/state alone.
  }

  return lookup;
}

function mergeShowroomDetails(
  showroom: CustomerAppointmentShowroom | null,
  lookup: Map<string, ShowroomLookup>,
): CustomerAppointmentShowroom | null {
  if (!showroom) return null;
  const details = lookup.get(showroom.documentId);
  if (!details) return showroom;

  return {
    documentId: showroom.documentId,
    slug: showroom.slug || details.slug,
    city: showroom.city || details.city,
    state: showroom.state || details.state,
    name: showroom.name || details.name,
    address: showroom.address || details.address,
    mapUrl: showroom.mapUrl || details.mapUrl,
    pincode: showroom.pincode || details.pincode,
  };
}

function enrichAppointmentsWithShowrooms(
  appointments: CustomerAppointment[],
  lookup: Map<string, ShowroomLookup>,
): CustomerAppointment[] {
  if (lookup.size === 0) {
    return appointments;
  }

  return appointments.map((appointment) => ({
    ...appointment,
    preferredShowroom: mergeShowroomDetails(appointment.preferredShowroom, lookup),
  }));
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
  const pageData = mapCustomerAppointmentsPage(payload);

  const needsShowroomEnrichment = pageData.appointments.some((appointment) => {
    const showroom = appointment.preferredShowroom;
    return Boolean(showroom?.documentId) && (!showroom?.address || !showroom?.mapUrl);
  });

  if (!needsShowroomEnrichment) {
    return pageData;
  }

  const lookup = await fetchShowroomLookupByDocumentId(signal);
  return {
    ...pageData,
    appointments: enrichAppointmentsWithShowrooms(pageData.appointments, lookup),
  };
}

export async function rescheduleCustomerAppointment(
  magentoCustomerId: number,
  documentId: string,
  input: RescheduleCustomerAppointmentInput,
  /** Shopper IP headers for CMS rate limits (`cmsForwardedIpHeaders`). */
  clientHeaders: Record<string, string> = {},
  signal?: AbortSignal,
): Promise<CustomerAppointment | StrapiAppointmentMutationResponse["data"]> {
  const safeId = documentId.trim();

  if (!safeId) {
    throw new CustomerAppointmentsApiError("Missing appointment id", 400);
  }

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.customerAppointments}/${encodeURIComponent(safeId)}/reschedule`;
  const response = await fetch(url, {
    method: "POST",
    headers: cmsAuthHeaders({ "Content-Type": "application/json", ...clientHeaders }),
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
  clientHeaders: Record<string, string> = {},
  signal?: AbortSignal,
): Promise<CustomerAppointment | StrapiAppointmentMutationResponse["data"] | null> {
  const safeId = documentId.trim();

  if (!safeId) {
    throw new CustomerAppointmentsApiError("Missing appointment id", 400);
  }

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.customerAppointments}/${encodeURIComponent(safeId)}/cancel`;
  const response = await fetch(url, {
    method: "POST",
    headers: cmsAuthHeaders({ "Content-Type": "application/json", ...clientHeaders }),
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

/** Upcoming store visits / video calls that can still take a piece (CMS caps at 5). */
export async function getOpenCustomerAppointments(
  magentoCustomerId: number,
  signal?: AbortSignal,
): Promise<CustomerOpenAppointment[]> {
  const params = new URLSearchParams({ magentoCustomerId: String(magentoCustomerId) });
  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.customerAppointments}/open?${params.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: cmsAuthHeaders(),
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new CustomerAppointmentsApiError(await parseErrorMessage(response), response.status);
  }

  const payload = (await response.json()) as { data?: CustomerOpenAppointment[] | null };
  return payload.data ?? [];
}

export async function addPieceToCustomerAppointment(
  magentoCustomerId: number,
  documentId: string,
  input: AddPieceToCustomerAppointmentInput,
  clientHeaders: Record<string, string> = {},
  signal?: AbortSignal,
): Promise<AddPieceToCustomerAppointmentResult> {
  const safeId = documentId.trim();

  if (!safeId) {
    throw new CustomerAppointmentsApiError("Missing appointment id", 400);
  }

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.customerAppointments}/${encodeURIComponent(safeId)}/pieces`;
  const response = await fetch(url, {
    method: "POST",
    headers: cmsAuthHeaders({ "Content-Type": "application/json", ...clientHeaders }),
    body: JSON.stringify({
      data: {
        magentoCustomerId,
        productId: input.productId,
        productName: input.productName,
        productPath: input.productPath,
      },
    }),
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new CustomerAppointmentsApiError(await parseErrorMessage(response), response.status);
  }

  return (await response.json()) as AddPieceToCustomerAppointmentResult;
}
