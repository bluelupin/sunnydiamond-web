import type { AuthFlowStep } from "../hooks/useAuthFlow";

const DEFAULT_RETURN_URL = "/";

/**
 * Returns a safe same-origin path for post-auth redirects.
 */
export function sanitizeReturnUrl(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_RETURN_URL;
  }

  return value;
}

/**
 * Where signup lands: a bare default return means nobody asked to go anywhere
 * specific, so fresh accounts start on the profile. An explicit destination
 * (e.g. checkout) always wins.
 */
export function getPostSignupReturnUrl(returnUrl: string): string {
  return returnUrl === DEFAULT_RETURN_URL ? "/profile" : returnUrl;
}

export function getAuthFlowLabel(step: AuthFlowStep): string {
  if (step === "sign-in") return "Sign In";
  if (step === "otp") return "Enter Code";
  return "Enter Details";
}

export function getLoginHrefForReturn(
  returnUrl: string,
  extraParams?: Record<string, string>,
): string {
  const sanitized = sanitizeReturnUrl(returnUrl);
  const params = new URLSearchParams();

  if (sanitized !== DEFAULT_RETURN_URL) {
    params.set("returnUrl", sanitized);
  }

  if (extraParams) {
    for (const [key, value] of Object.entries(extraParams)) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `/login?${query}` : "/login";
}

export function getLoginHref(pathname: string): string {
  if (pathname === "/login" || pathname === "/sign-up") {
    return "/login";
  }

  return getLoginHrefForReturn(pathname);
}
