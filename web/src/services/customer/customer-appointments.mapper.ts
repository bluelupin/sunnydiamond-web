import type {
  CustomerAppointment,
  CustomerAppointmentProduct,
  CustomerAppointmentShowroom,
  CustomerAppointmentsPage,
  StrapiCustomerAppointment,
  StrapiCustomerAppointmentProduct,
  StrapiCustomerAppointmentShowroom,
  StrapiCustomerAppointmentsResponse,
} from "./customer-appointments.types";

function cleanText(value?: unknown): string {
  if (value == null) {
    return "";
  }
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  return "";
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
  "requestDetails",
  "request_details",
  "customerMessage",
  "notes",
  "message",
  "note",
  "customerNote",
  "lookingFor",
  "looking_for",
  "whatAreYouLookingFor",
  "description",
  "submissionNotes",
  "submissionMessage",
  "details",
] as const;

function normalizeCustomerMessageText(value: string): string {
  const withoutStateLines = value
    .split(/\r?\n/)
    .filter((line) => !/^\s*State\s*:/i.test(line))
    .join("\n")
    .trim();

  return withoutStateLines || value.trim();
}

function coerceMessageValue(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  return "";
}

function mapCustomerMessage(
  item: StrapiCustomerAppointment & Record<string, unknown>,
): string | null {
  for (const key of CUSTOMER_MESSAGE_KEYS) {
    const value = coerceMessageValue(item[key]);
    if (value) {
      return normalizeCustomerMessageText(value);
    }
  }

  for (const [key, value] of Object.entries(item)) {
    const text = coerceMessageValue(value);
    if (!text) {
      continue;
    }

    const normalizedKey = key.toLowerCase();
    if (
      normalizedKey.includes("request_detail") ||
      normalizedKey.includes("requestdetail") ||
      normalizedKey.includes("looking") ||
      normalizedKey.includes("note") ||
      normalizedKey.includes("detail") ||
      normalizedKey.includes("message")
    ) {
      return normalizeCustomerMessageText(text);
    }
  }

  return null;
}

function pickTextField(
  item: Record<string, unknown>,
  keys: readonly string[],
): string | null {
  for (const key of keys) {
    const value = cleanText(item[key]);
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

function mapAppointmentProduct(
  product: StrapiCustomerAppointmentProduct,
  fallback: {
    requestedDate: string;
    selectedTimeSlot: string;
    workflowStatus: string;
  },
): CustomerAppointmentProduct | null {
  const documentId = cleanText(product.documentId);
  if (!documentId) return null;

  return {
    documentId,
    productId: cleanText(product.productId) || null,
    productName: cleanText(product.productName) || null,
    requestedDate: cleanText(product.requestedDate) || fallback.requestedDate,
    selectedTimeSlot: cleanText(product.selectedTimeSlot) || fallback.selectedTimeSlot,
    workflowStatus: cleanText(product.workflowStatus) || fallback.workflowStatus,
  };
}

export function mapCustomerAppointment(
  item: StrapiCustomerAppointment,
): CustomerAppointment | null {
  const normalized = normalizeAppointmentRaw(item);
  const documentId = cleanText(normalized.documentId);
  if (!documentId) return null;

  const addressFields = mapAppointmentAddressFields(normalized);
  const requestedDate =
    cleanText(normalized.requestedDate) ||
    pickTextField(normalized, ["preferredDate", "preferred_date", "bookingDate"]) ||
    "";
  const selectedTimeSlot =
    cleanText(normalized.selectedTimeSlot) ||
    pickTextField(normalized, ["selected_time_slot", "timeSlot", "time_slot"]) ||
    "";
  const workflowStatus = cleanText(normalized.workflowStatus) || "New";

  const productsFromApi = Array.isArray(normalized.products)
    ? normalized.products
        .map((product) =>
          mapAppointmentProduct(product, {
            requestedDate,
            selectedTimeSlot,
            workflowStatus,
          }),
        )
        .filter((product): product is CustomerAppointmentProduct => product != null)
    : [];

  const productName = cleanText(normalized.productName) || null;
  const productId = cleanText(normalized.productId) || null;

  const products =
    productsFromApi.length > 0
      ? productsFromApi
      : productName || productId
        ? [
            {
              documentId,
              productId,
              productName,
              requestedDate,
              selectedTimeSlot,
              workflowStatus,
            },
          ]
        : [];

  return {
    documentId,
    appointmentGroupId: cleanText(normalized.appointmentGroupId) || null,
    formTag: cleanText(normalized.formTag),
    productName: productName || products[0]?.productName || null,
    productId: productId || products[0]?.productId || null,
    products,
    customerName:
      cleanText(normalized.customerName) ||
      pickTextField(normalized, ["fullName", "name", "full_name"]) ||
      "",
    customerPhone:
      cleanText(normalized.customerPhone) ||
      pickTextField(normalized, ["phone", "mobile", "customer_phone"]) ||
      "",
    customerEmail:
      cleanText(normalized.customerEmail) ||
      pickTextField(normalized, ["email", "customer_email"]) ||
      "",
    requestedDate,
    selectedTimeSlot,
    workflowStatus,
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
