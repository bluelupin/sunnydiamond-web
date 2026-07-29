import { cookies } from "next/headers";

export const CUSTOMER_TOKEN_COOKIE = "sunny_customer_token";

/** Keep aligned with Magento's oauth/access_token_lifetime/customer (168h). */
const CUSTOMER_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function readTokenFromCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) {
    return null;
  }

  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed.startsWith(`${CUSTOMER_TOKEN_COOKIE}=`)) {
      continue;
    }

    const raw = trimmed.slice(CUSTOMER_TOKEN_COOKIE.length + 1);
    try {
      return decodeURIComponent(raw) || null;
    } catch {
      return raw || null;
    }
  }

  return null;
}

export async function getCustomerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value || null;
}

/**
 * Prefer Next cookie store; fall back to the request Cookie header.
 * Some Route Handler methods (e.g. DELETE) have been observed without
 * `cookies()` populated even when the browser sent the session cookie.
 */
export async function getCustomerTokenFromRequest(
  request?: Request,
): Promise<string | null> {
  const fromStore = await getCustomerToken();
  if (fromStore) {
    return fromStore;
  }

  return readTokenFromCookieHeader(request?.headers.get("cookie") ?? null);
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
