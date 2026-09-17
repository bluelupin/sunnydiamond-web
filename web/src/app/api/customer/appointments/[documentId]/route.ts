import { NextResponse } from "next/server";
import { getCustomerTokenFromRequest } from "@/services/auth/session";
import {
  CustomerAppointmentsApiError,
  rescheduleCustomerAppointment,
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
    status === 503
  ) {
    return status;
  }
  if (status >= 500) return 502;
  return 500;
}

export async function PATCH(request: Request, context: RouteContext) {
  const token = await getCustomerTokenFromRequest(request);

  if (!token) {
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

  let body: { requestedDate?: string; selectedTimeSlot?: string };

  try {
    body = (await request.json()) as { requestedDate?: string; selectedTimeSlot?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const requestedDate = body.requestedDate?.trim() ?? "";
  const selectedTimeSlot = body.selectedTimeSlot?.trim() ?? "";

  if (!requestedDate || !selectedTimeSlot) {
    return NextResponse.json(
      { error: "Date and time slot are required" },
      { status: 400 },
    );
  }

  try {
    const appointment = await rescheduleCustomerAppointment(token, id, {
      requestedDate,
      selectedTimeSlot,
    });
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
