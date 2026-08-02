import { NextRequest, NextResponse } from "next/server";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { MagentoGraphqlError } from "@/services/magento/magento.errors";
import { MAGENTO_SOCIAL_LOGIN_MUTATION } from "@/services/auth/auth.gql";
import { setCustomerTokenCookie } from "@/services/auth/session";

type SocialBody = {
  provider?: "GOOGLE" | "APPLE";
  idToken?: string;
  nonce?: string;
  firstName?: string;
  lastName?: string;
};

export async function POST(request: NextRequest) {
  let body: SocialBody;

  try {
    body = (await request.json()) as SocialBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.provider || !body.idToken) {
    return NextResponse.json({ error: "provider and idToken are required" }, { status: 400 });
  }

  try {
    const data = await magentoGraphqlFetch<{
      socialLogin: { token: string; customer_created: boolean };
    }>({
      query: MAGENTO_SOCIAL_LOGIN_MUTATION,
      variables: {
        input: {
          provider: body.provider,
          id_token: body.idToken,
          nonce: body.nonce ?? null,
          first_name: body.firstName ?? null,
          last_name: body.lastName ?? null,
        },
      },
      cache: "no-store",
    });

    await setCustomerTokenCookie(data.socialLogin.token);
    return NextResponse.json({ ok: true, customerCreated: data.socialLogin.customer_created });
  } catch (error) {
    const message =
      error instanceof MagentoGraphqlError ? error.message : "Social sign-in failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
