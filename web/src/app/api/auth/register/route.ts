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
  const email = body.email?.trim();
  const password = body.password;

  if (!firstname || !lastname || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    await magentoGraphqlFetch({
      query: MAGENTO_CREATE_CUSTOMER_MUTATION,
      variables: { input: { firstname, lastname, email, password } },
      cache: "no-store",
    });
  } catch (error) {
    // Magento's validation messages (weak password, duplicate email) are user-appropriate.
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
      return NextResponse.json({ ok: true, loggedIn: true });
    }
  } catch {
    // Account created but auto-login failed (e.g. email confirmation required).
  }

  return NextResponse.json({ ok: true, loggedIn: false });
}
