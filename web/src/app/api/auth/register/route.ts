import { NextRequest, NextResponse } from "next/server";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import {
  MAGENTO_CREATE_CUSTOMER_MUTATION,
  MAGENTO_GENERATE_CUSTOMER_TOKEN_MUTATION,
} from "@/services/customer/customer.gql";
import { setCustomerTokenCookie } from "@/services/auth/session";

type RegisterBody = {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  isSubscribed?: boolean;
};

export async function POST(request: NextRequest) {
  let body: RegisterBody;

  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const firstname = body.firstname?.trim();
  const lastname = body.lastname?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!firstname || !lastname || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    const data = await magentoGraphqlFetch<{
      createCustomerV2: {
        customer: {
          id: string;
          email: string;
          firstname: string;
          lastname: string;
        } | null;
      };
    }>({
      query: MAGENTO_CREATE_CUSTOMER_MUTATION,
      variables: {
        input: {
          firstname,
          lastname,
          email,
          password,
          is_subscribed: Boolean(body.isSubscribed),
        },
      },
      cache: "no-store",
    });

    const customer = data.createCustomerV2?.customer;
    if (!customer?.email) {
      return NextResponse.json(
        { error: "Magento did not create the customer account" },
        { status: 502 },
      );
    }
  } catch (error) {
    const message =
      error instanceof MagentoGraphqlError ? error.message : "Registration failed";
    const isDuplicate = /same email address/i.test(message);
    return NextResponse.json({ error: message }, { status: isDuplicate ? 409 : 400 });
  }

  try {
    const data = await magentoGraphqlFetch<{
      generateCustomerToken: { token: string } | null;
    }>({
      query: MAGENTO_GENERATE_CUSTOMER_TOKEN_MUTATION,
      variables: { email, password },
      cache: "no-store",
    });

    const token = data.generateCustomerToken?.token;
    if (token) {
      await setCustomerTokenCookie(token);
      return NextResponse.json({ ok: true, loggedIn: true, email });
    }
  } catch {
    // Account created but auto-login failed (e.g. email confirmation required).
  }

  return NextResponse.json({
    ok: true,
    loggedIn: false,
    email,
    error: "Account created but sign-in failed. Try logging in with your email and password.",
  });
}
