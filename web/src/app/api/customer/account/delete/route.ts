import { NextResponse } from "next/server";
import { clearCustomerTokenCookie, getCustomerToken } from "@/services/auth/session";
import { deleteCustomerAccount } from "@/services/customer/customer-account.service";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";

type DeleteAccountRequestBody = {
  reason?: string;
  comments?: string;
};

export async function POST(request: Request) {
  const token = await getCustomerToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: DeleteAccountRequestBody;

  try {
    payload = (await request.json()) as DeleteAccountRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    // The dialog emits `comments`; the mutation takes `comment`.
    await deleteCustomerAccount(token, {
      reason: payload.reason?.trim(),
      comment: payload.comments?.trim(),
    });
  } catch (error) {
    if (
      error instanceof MagentoGraphqlError &&
      error.errors[0]?.extensions?.category === "ACTIVE_ORDERS"
    ) {
      return NextResponse.json(
        { error: error.message, code: "ACTIVE_ORDERS" },
        { status: 409 },
      );
    }

    const message = error instanceof Error ? error.message : "Failed to delete account";
    return NextResponse.json({ error: message, code: "UNKNOWN" }, { status: 500 });
  }

  // Magento revoked the token server-side; drop the session cookie too.
  await clearCustomerTokenCookie();
  return NextResponse.json({ success: true });
}
