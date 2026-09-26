import { NextResponse } from "next/server";
import { getSessionMagentoCustomerId } from "@/services/auth/getSessionMagentoCustomerId";
import { cmsForwardedIpHeaders } from "@/services/http/clientIp";
import {
  CustomerAppointmentsApiError,
  cancelCustomerAppointment,
} from "@/services/customer/customer-appointments.service";

type RouteContext = {
  params: Promise<{ documentId: string }>;
};

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

export async function POST(request: Request, context: RouteContext) {
  const magentoCustomerId = await getSessionMagentoCustomerId(request);

  if (magentoCustomerId == null) {
    return NextResponse.json(
      { error: "Unauthorized", reason: "no_session" },
      { status: 401 },
    );
  }

  const { documentId } = await context.params;
  const id = documentId.trim();

  if (!id) {
    return NextResponse.json({ error: "Missing documentId" }, { status: 400 });
  }

  try {
    const appointment = await cancelCustomerAppointment(
      magentoCustomerId,
      id,
      cmsForwardedIpHeaders(request),
    );
    if (!appointment) {
      return new NextResponse(null, { status: 204 });
    }
    return NextResponse.json(appointment);
  } catch (error) {
    if (error instanceof CustomerAppointmentsApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: mapApiStatus(error.status) },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to cancel appointment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
