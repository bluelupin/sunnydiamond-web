import { NextResponse } from "next/server";
import { getSessionMagentoCustomerId } from "@/services/auth/getSessionMagentoCustomerId";
import {
  CustomerAppointmentsApiError,
  getOpenCustomerAppointments,
} from "@/services/customer/customer-appointments.service";

function mapApiStatus(status: number): number {
  if (
    status === 401 ||
    status === 403 ||
    status === 404 ||
    status === 400 ||
    status === 409 ||
    status === 429 ||
    status === 503
  ) {
    return status;
  }
  if (status >= 500) return 502;
  return 500;
}

/**
 * GET /api/customer/appointments/open
 * Upcoming store visits / video calls the signed-in customer can add a piece to.
 */
export async function GET(request: Request) {
  const magentoCustomerId = await getSessionMagentoCustomerId(request);

  if (magentoCustomerId == null) {
    return NextResponse.json(
      { error: "Unauthorized", reason: "no_session" },
      { status: 401 },
    );
  }

  try {
    const data = await getOpenCustomerAppointments(magentoCustomerId);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof CustomerAppointmentsApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: mapApiStatus(error.status) },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to load open appointments";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
