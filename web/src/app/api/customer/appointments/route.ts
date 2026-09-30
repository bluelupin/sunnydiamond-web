import { NextResponse } from "next/server";
import { getSessionMagentoCustomerIdentity } from "@/services/auth/getSessionMagentoCustomerId";
import {
  CustomerAppointmentsApiError,
  fetchCustomerAppointments,
} from "@/services/customer/customer-appointments.service";

export async function GET(request: Request) {
  const customer = await getSessionMagentoCustomerIdentity(request);

  if (customer == null) {
    return NextResponse.json(
      { error: "Unauthorized", reason: "no_session" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "20") || 20));

  try {
    const appointments = await fetchCustomerAppointments(
      customer.id,
      customer.email,
      page,
      pageSize,
    );
    return NextResponse.json(appointments);
  } catch (error) {
    if (error instanceof CustomerAppointmentsApiError) {
      const status =
        error.status === 401 ||
        error.status === 403 ||
        error.status === 404 ||
        error.status === 400 ||
        error.status === 503
          ? error.status
          : error.status >= 500
            ? 502
            : 500;
      return NextResponse.json({ error: error.message }, { status });
    }

    const message = error instanceof Error ? error.message : "Failed to load appointments";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
