import { NextResponse } from "next/server";
import { getCustomerTokenFromRequest } from "@/services/auth/session";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { decodeMagentoEntityId } from "@/services/magento/decodeMagentoEntityId";
import { MAGENTO_CUSTOMER_ME_QUERY } from "@/services/customer/customer.gql";
import {
  CustomerAppointmentsApiError,
  fetchCustomerAppointments,
} from "@/services/customer/customer-appointments.service";

async function resolveMagentoCustomerId(authToken: string): Promise<number | null> {
  try {
    const data = await magentoGraphqlFetch<{
      customer: { id: number | string } | null;
    }>({
      query: MAGENTO_CUSTOMER_ME_QUERY,
      authToken,
    });

    return decodeMagentoEntityId(data.customer?.id);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  // Same session read as reschedule — cookie store + Cookie header fallback.
  const token = await getCustomerTokenFromRequest(request);

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized", reason: "no_session" },
      { status: 401 },
    );
  }

  // Same Magento customer id used on Book a Visit / product submits.
  const magentoCustomerId = await resolveMagentoCustomerId(token);
  if (magentoCustomerId == null) {
    return NextResponse.json(
      {
        error: "Missing or invalid credentials",
        reason: "invalid_magento_token",
      },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "20") || 20));

  try {
    const appointments = await fetchCustomerAppointments(page, pageSize, {
      magentoCustomerId,
    });
    return NextResponse.json(appointments);
  } catch (error) {
    if (error instanceof CustomerAppointmentsApiError) {
      // Pass through Strapi client errors (400/401/403/404); keep unexpected as 502/500.
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
