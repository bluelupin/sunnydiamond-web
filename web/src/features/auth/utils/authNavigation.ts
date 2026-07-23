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

export function getAuthFlowLabel(step: "sign-in" | "otp" | "create-account"): string {
  if (step === "sign-in") return "Sign In";
  if (step === "otp") return "Enter Code";
  return "Enter Details";
}

export function getLoginHref(pathname: string): string {
  if (pathname === "/login" || pathname === "/sign-up") {
    return "/login";
  }

  return `/login?returnUrl=${encodeURIComponent(pathname)}`;
}
