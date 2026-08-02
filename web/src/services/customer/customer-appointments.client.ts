import type { CustomerAppointmentsPage } from "./customer-appointments.types";

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

  // Unauthenticated — caller should prompt sign-in.
  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as CustomerAppointmentsPage;
}
