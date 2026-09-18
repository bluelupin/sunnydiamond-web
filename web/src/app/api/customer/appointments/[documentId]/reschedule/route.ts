import { NextResponse } from "next/server";
import { getSessionMagentoCustomerId } from "@/services/auth/getSessionMagentoCustomerId";
import {
  CustomerAppointmentsApiError,
  rescheduleCustomerAppointment,
  type RescheduleCustomerAppointmentInput,
} from "@/services/customer/customer-appointments.service";

type RouteContext = {
  params: Promise<{ documentId: string }>;
};

type RescheduleBody = {
  requestedDate?: string;
  selectedTimeSlot?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  requestDetails?: string;
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

function toRescheduleInput(body: RescheduleBody): RescheduleCustomerAppointmentInput | null {
  const requestedDate = body.requestedDate?.trim() ?? "";
  const selectedTimeSlot = body.selectedTimeSlot?.trim() ?? "";

  if (!requestedDate || !selectedTimeSlot) {
    return null;
  }

  const customerName = body.customerName?.trim();
  const customerPhone = body.customerPhone?.trim();
  const customerEmail = body.customerEmail?.trim();
  const requestDetails = body.requestDetails?.trim();

  return {
    requestedDate,
    selectedTimeSlot,
    ...(customerName ? { customerName } : {}),
    ...(customerPhone ? { customerPhone } : {}),
    ...(customerEmail ? { customerEmail } : {}),
    ...(requestDetails ? { requestDetails } : {}),
  };
}

/**
 * POST /api/customer/appointments/:documentId/reschedule
 * Body: requestedDate, selectedTimeSlot, optional customerName/Phone/Email/requestDetails.
 * BFF injects trusted magentoCustomerId and calls CMS with API token.
 */
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

  let body: RescheduleBody;

  try {
    body = (await request.json()) as RescheduleBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = toRescheduleInput(body);
  if (!input) {
    return NextResponse.json(
      { error: "Date and time slot are required" },
      { status: 400 },
    );
  }

  try {
    const appointment = await rescheduleCustomerAppointment(magentoCustomerId, id, input);
    return NextResponse.json(appointment);
  } catch (error) {
    if (error instanceof CustomerAppointmentsApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: mapApiStatus(error.status) },
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to reschedule appointment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
