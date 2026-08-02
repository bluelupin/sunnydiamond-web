import { NextResponse } from "next/server";
import { getCustomerToken } from "@/services/auth/session";
import {
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@/services/customer/customer-account.service";
import type { CustomerAddressInput } from "@/services/customer/customer-account.types";

type RouteContext = {
  params: Promise<{ uid: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { uid } = await context.params;

  try {
    const input = (await request.json()) as CustomerAddressInput;
    const addresses = await updateCustomerAddress(token, uid, input);
    return NextResponse.json({ addresses });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update address";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { uid } = await context.params;

  try {
    const addresses = await deleteCustomerAddress(token, uid);
    return NextResponse.json({ addresses });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete address";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
