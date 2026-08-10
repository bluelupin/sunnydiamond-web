import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import {
  MAGENTO_CREATE_CUSTOMER_MUTATION,
  MAGENTO_GENERATE_CUSTOMER_TOKEN_MUTATION,
  SUNNY_DELETE_CUSTOMER_MUTATION,
} from "@/services/customer/customer.gql";

type EmailAvailabilityBody = {
  email?: string;
};

const DUPLICATE_EMAIL_PATTERN =
  /same email address already exists|already (?:exists|registered)|email.*(?:exists|taken)/i;

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

function buildProbePassword(): string {
  return `Tmp!${randomBytes(12).toString("base64url")}Aa1`;
}

/**
 * Magento 2.4.7+ hides existence via isEmailAvailable. createCustomerV2 still
 * rejects duplicates. New emails briefly create then delete (server-side only).
 */
async function isEmailAvailableViaCreateProbe(email: string): Promise<boolean> {
  const password = buildProbePassword();

  try {
    await magentoGraphqlFetch({
      query: MAGENTO_CREATE_CUSTOMER_MUTATION,
      variables: {
        input: {
          email,
          firstname: "Guest",
          lastname: "Checkout",
          password,
          is_subscribed: false,
        },
      },
      cache: "no-store",
    });
  } catch (error) {
    const message =
      error instanceof MagentoGraphqlError
        ? error.message
        : error instanceof Error
          ? error.message
          : "";

    if (DUPLICATE_EMAIL_PATTERN.test(message)) {
      return false;
    }

    return true;
  }

  try {
    const tokenData = await magentoGraphqlFetch<{
      generateCustomerToken?: { token?: string | null } | null;
    }>({
      query: MAGENTO_GENERATE_CUSTOMER_TOKEN_MUTATION,
      variables: { email, password },
      cache: "no-store",
    });

    const token = tokenData.generateCustomerToken?.token;
    if (token) {
      await magentoGraphqlFetch({
        query: SUNNY_DELETE_CUSTOMER_MUTATION,
        variables: { input: { reason: "checkout_email_probe" } },
        authToken: token,
        cache: "no-store",
      });
    }
  } catch (error) {
    console.warn(
      "[email-availability] Probe account cleanup failed",
      error instanceof Error ? error.message : error,
    );
  }

  return true;
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

  const graphqlAvailable = await isEmailAvailableViaGraphql(email);
  if (graphqlAvailable === false) {
    return NextResponse.json({ available: false });
  }

  try {
    const available = await isEmailAvailableViaCreateProbe(email);
    return NextResponse.json({ available });
  } catch {
    return NextResponse.json({ available: true });
  }
}
