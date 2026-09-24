import type {
  CustomerAppointment,
  CustomerAppointmentsPage,
} from "./customer-appointments.types";
import type { RescheduleCustomerAppointmentInput } from "./customer-appointments.service";

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

/** Browser → Next BFF (session cookie). Never sends CMS token or customer id from the client. */
export async function getCustomerAppointments(
  page = 1,
  pageSize = 20,
  signal?: AbortSignal,
): Promise<CustomerAppointmentsPage | null> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  const response = await fetch(`/api/customer/appointments?${params.toString()}`, {
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

  return (await response.json()) as CustomerAppointmentsPage;
}

export async function rescheduleCustomerAppointment(
  documentId: string,
  input: RescheduleCustomerAppointmentInput,
): Promise<CustomerAppointment> {
  const response = await fetch(
    `/api/customer/appointments/${encodeURIComponent(documentId)}/reschedule`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
      credentials: "same-origin",
    },
  );

  if (response.status === 401) {
    throw new Error("Please sign in again to reschedule this appointment.");
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as CustomerAppointment;
}

export async function cancelCustomerAppointment(
  documentId: string,
): Promise<CustomerAppointment | null> {
  const response = await fetch(
    `/api/customer/appointments/${encodeURIComponent(documentId)}/cancel`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
      cache: "no-store",
      credentials: "same-origin",
    },
  );

  if (response.status === 401) {
    throw new Error("Please sign in again to cancel this appointment.");
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text.trim()) {
    return null;
  }

  return JSON.parse(text) as CustomerAppointment;
}
