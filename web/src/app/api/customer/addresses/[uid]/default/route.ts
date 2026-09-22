import { NextResponse } from "next/server";

import { getCustomerToken } from "@/services/auth/session";
import { setCustomerDefaultShippingAddress } from "@/services/customer/customer-account.service";

type RouteContext = {
  params: Promise<{ uid: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { uid } = await context.params;

  try {
    const addresses = await setCustomerDefaultShippingAddress(token, uid);
    return NextResponse.json({ addresses });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to set default address";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
