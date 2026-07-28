import type {
  CustomerAppointment,
  CustomerAppointmentShowroom,
  CustomerAppointmentsPage,
  StrapiCustomerAppointment,
  StrapiCustomerAppointmentShowroom,
  StrapiCustomerAppointmentsResponse,
} from "./customer-appointments.types";

function cleanText(value?: string | null): string {
  return value?.trim() ?? "";
}

function mapShowroom(
  showroom?: StrapiCustomerAppointmentShowroom | null,
): CustomerAppointmentShowroom | null {
  if (!showroom) return null;

  const documentId = cleanText(showroom.documentId);
  const name = cleanText(showroom.name);
  if (!documentId || !name) return null;

  return {
    documentId,
    name,
    slug: cleanText(showroom.slug),
    city: cleanText(showroom.city),
    state: cleanText(showroom.state),
  };
}

function normalizeAppointmentRaw(raw: unknown): StrapiCustomerAppointment & Record<string, unknown> {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const record = raw as Record<string, unknown>;
  const attributes = record.attributes;

  if (attributes && typeof attributes === "object") {
    const attrs = attributes as Record<string, unknown>;
    return {
      ...attrs,
      documentId:
        cleanText(record.documentId as string | null | undefined) ||
        cleanText(attrs.documentId as string | null | undefined),
    };
  }

  return record as StrapiCustomerAppointment & Record<string, unknown>;
}

const CUSTOMER_MESSAGE_KEYS = [
  "customerMessage",
  "requestDetails",
  "notes",
  "message",
  "note",
  "customerNote",
  "description",
  "request_details",
  "submissionNotes",
  "submissionMessage",
  "details",
] as const;

function mapCustomerMessage(
  item: StrapiCustomerAppointment & Record<string, unknown>,
): string | null {
  for (const key of CUSTOMER_MESSAGE_KEYS) {
    const value = cleanText(item[key] as string | null | undefined);
    if (value) {
      return value;
    }
  }

  for (const [key, value] of Object.entries(item)) {
    if (typeof value !== "string" || !value.trim()) {
      continue;
    }

    const normalizedKey = key.toLowerCase();
    if (
      normalizedKey.includes("note") ||
      normalizedKey.includes("detail") ||
      normalizedKey.includes("message")
    ) {
      return value.trim();
    }
  }

  return null;
}

function pickTextField(
  item: Record<string, unknown>,
  keys: readonly string[],
): string | null {
  for (const key of keys) {
    const value = cleanText(item[key] as string | null | undefined);
    if (value) {
      return value;
    }
  }

  return null;
}

function mapAppointmentAddressFields(
  item: StrapiCustomerAppointment & Record<string, unknown>,
): Pick<
  CustomerAppointment,
  "addressLine1" | "addressLine2" | "pincode" | "city" | "state"
> {
  return {
    addressLine1: pickTextField(item, [
      "addressLine1",
      "address_line_1",
      "addressLineOne",
      "street",
      "streetLine1",
    ]),
    addressLine2: pickTextField(item, ["addressLine2", "address_line_2", "streetLine2"]),
    pincode: pickTextField(item, ["pincode", "postcode", "postalCode", "zip"]),
    city: pickTextField(item, ["city"]),
    state: pickTextField(item, ["state", "region", "province"]),
  };
}

export function mapCustomerAppointment(
  item: StrapiCustomerAppointment,
): CustomerAppointment | null {
  const normalized = normalizeAppointmentRaw(item);
  const documentId = cleanText(normalized.documentId);
  if (!documentId) return null;

  const addressFields = mapAppointmentAddressFields(normalized);

  return {
    documentId,
    formTag: cleanText(normalized.formTag),
    productName: cleanText(normalized.productName) || null,
    productId: cleanText(normalized.productId) || null,
    customerName: cleanText(normalized.customerName),
    customerPhone: cleanText(normalized.customerPhone),
    customerEmail: cleanText(normalized.customerEmail),
    requestedDate: cleanText(normalized.requestedDate),
    selectedTimeSlot: cleanText(normalized.selectedTimeSlot),
    workflowStatus: cleanText(normalized.workflowStatus) || "New",
    customerMessage: mapCustomerMessage(normalized),
    addressLine1: addressFields.addressLine1,
    addressLine2: addressFields.addressLine2,
    pincode: addressFields.pincode,
    city: addressFields.city,
    state: addressFields.state,
    preferredShowroom: mapShowroom(normalized.preferredShowroom),
    createdAt: cleanText(normalized.createdAt),
    updatedAt: cleanText(normalized.updatedAt),
  };
}

export function mapCustomerAppointmentsPage(
  payload: StrapiCustomerAppointmentsResponse,
): CustomerAppointmentsPage {
  const appointments = (payload.data ?? [])
    .map((item) => mapCustomerAppointment(item))
    .filter((item): item is CustomerAppointment => item != null);

  const pagination = payload.meta?.pagination;

  return {
    appointments,
    currentPage: Math.max(1, Number(pagination?.page ?? 1) || 1),
    pageSize: Math.max(1, Number(pagination?.pageSize ?? 20) || 20),
    totalPages: Math.max(1, Number(pagination?.pageCount ?? 1) || 1),
    totalCount: Math.max(0, Number(pagination?.total ?? appointments.length) || 0),
  };
}
