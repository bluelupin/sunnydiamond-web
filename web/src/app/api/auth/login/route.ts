import { NextRequest, NextResponse } from "next/server";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MAGENTO_GENERATE_CUSTOMER_TOKEN_MUTATION } from "@/services/customer/customer.gql";
import { setCustomerTokenCookie } from "@/services/auth/session";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: NextRequest) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
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
    if (!token) {
      return NextResponse.json({ error: "Sign-in failed" }, { status: 401 });
    }

    await setCustomerTokenCookie(token);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "The email or password is incorrect" },
      { status: 401 },
    );
  }
}
