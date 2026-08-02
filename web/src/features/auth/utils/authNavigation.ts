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

export function getAuthFlowLabel(
  step: "sign-in" | "otp" | "create-account" | "password" | "email-create-account",
): string {
  if (step === "sign-in" || step === "password") return "Sign In";
  if (step === "otp") return "Enter Code";
  if (step === "email-create-account") return "Create Account";
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
