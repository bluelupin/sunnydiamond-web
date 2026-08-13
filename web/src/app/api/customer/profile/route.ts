import { NextResponse } from "next/server";
import { getCustomerToken } from "@/services/auth/session";
import { updateCustomerName } from "@/services/customer/customer-account.service";
import { splitProfileFullName } from "@/features/account/utils/formatAccountData";

export async function PATCH(request: Request) {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { fullName?: string };
    const fullName = body.fullName?.trim() ?? "";

    if (!fullName) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { firstname, lastname } = splitProfileFullName(fullName);
    const customer = await updateCustomerName(token, { firstname, lastname });
    return NextResponse.json({ customer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
