import { cookies } from "next/headers";

export const CUSTOMER_TOKEN_COOKIE = "sunny_customer_token";

/** Keep aligned with Magento's oauth/access_token_lifetime/customer (168h). */
const CUSTOMER_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export async function getCustomerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value || null;
}

export async function setCustomerTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CUSTOMER_TOKEN_MAX_AGE_SECONDS,
  });
}

export async function clearCustomerTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_TOKEN_COOKIE);
}
