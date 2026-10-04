import { NextRequest, NextResponse } from "next/server";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";

type EmailAvailabilityBody = {
  email?: string;
};

async function isEmailAvailableViaGraphql(email: string): Promise<boolean | null> {
  try {
    const data = await magentoGraphqlFetch<{
      isEmailAvailable?: { is_email_available?: boolean | null };
    }>({
      query: `query IsEmailAvailable($email: String!) {
        isEmailAvailable(email: $email) {
          is_email_available
        }
      }`,
      variables: { email },
      cache: "no-store",
    });

    // Magento 2.4.7+ often returns true for every email; only trust an explicit false.
    if (data.isEmailAvailable?.is_email_available === false) {
      return false;
    }

    return null;
  } catch {
    return null;
  }
}

/** Guest-checkout email gate only. */
export async function POST(request: NextRequest) {
  let body: EmailAvailabilityBody;

  try {
    body = (await request.json()) as EmailAvailabilityBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  // Only Magento's own answer is used. This route used to "probe" by creating a
  // customer and deleting it, which left a real "Guest Checkout" account (and its
  // welcome and deletion emails) behind for every address typed at checkout
  // (QA bugs 25-27). When Magento does not say, the email-code step decides:
  // an existing account is signed in, a new address goes on to registration.
  const graphqlAvailable = await isEmailAvailableViaGraphql(email);
  return NextResponse.json({ available: graphqlAvailable !== false });
}
