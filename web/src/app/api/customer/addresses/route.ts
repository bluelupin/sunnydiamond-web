import { NextResponse } from "next/server";
import { getCustomerToken } from "@/services/auth/session";
import {
  createCustomerAddress,
  fetchCustomerAddresses,
} from "@/services/customer/customer-account.service";
import type { CustomerAddressInput } from "@/services/customer/customer-account.types";

export async function GET() {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const addresses = await fetchCustomerAddresses(token);
    return NextResponse.json({ addresses });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load addresses";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const input = (await request.json()) as CustomerAddressInput;
    const addresses = await createCustomerAddress(token, input);
    return NextResponse.json({ addresses });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save address";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
