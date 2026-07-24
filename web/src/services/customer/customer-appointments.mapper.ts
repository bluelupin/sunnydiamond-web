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

export function mapCustomerAppointment(
  item: StrapiCustomerAppointment,
): CustomerAppointment | null {
  const documentId = cleanText(item.documentId);
  if (!documentId) return null;

  return {
    documentId,
    formTag: cleanText(item.formTag),
    productName: cleanText(item.productName) || null,
    productId: cleanText(item.productId) || null,
    customerName: cleanText(item.customerName),
    customerPhone: cleanText(item.customerPhone),
    customerEmail: cleanText(item.customerEmail),
    requestedDate: cleanText(item.requestedDate),
    selectedTimeSlot: cleanText(item.selectedTimeSlot),
    workflowStatus: cleanText(item.workflowStatus) || "New",
    preferredShowroom: mapShowroom(item.preferredShowroom),
    createdAt: cleanText(item.createdAt),
    updatedAt: cleanText(item.updatedAt),
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
