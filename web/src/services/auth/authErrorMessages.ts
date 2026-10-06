/**
 * Magento's CustomerAuth module throws sentinel codes rather than prose so the
 * storefront owns the wording. Anything not listed here is already a human
 * message and passes through untouched.
 */
export const REGISTRATION_SESSION_EXPIRED_MESSAGE = "Session Expired";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "Invalid or expired OTP.": "Incorrect code",
  SESSION_EXPIRED: REGISTRATION_SESSION_EXPIRED_MESSAGE,
  REGISTRATION_SESSION_EXPIRED: REGISTRATION_SESSION_EXPIRED_MESSAGE,
  EMAIL_ALREADY_IN_USE:
    "An account already exists with this email address. Sign in with your email instead; you can then verify your mobile number in Profile.",
  PHONE_ALREADY_IN_USE: "This mobile number is already linked to another account.",
  OTP_MAX_ATTEMPTS: "Too many incorrect attempts. Please request a new code.",
  OTP_ALREADY_USED: "This code has already been used. Please request a new one.",
  PHONE_COUNTRY_NOT_SUPPORTED:
    "SMS codes aren't available for this country yet. Please use your email address instead.",
  OTP_SMS_UNAVAILABLE: "We could not send the SMS right now. Please try again later.",
  EMAIL_ALREADY_VERIFIED: "Your email address is already verified.",
  EMAIL_NOT_VERIFIABLE: "This account has no email address to verify.",
};

export function mapAuthErrorMessage(message: string, fallback: string): string {
  const trimmed = message.trim();
  if (!trimmed) {
    return fallback;
  }
  return AUTH_ERROR_MESSAGES[trimmed] ?? trimmed;
}

const REGISTRATION_SESSION_EXPIRED_MAGENTO_CODES = new Set([
  "Invalid or expired OTP.",
  "SESSION_EXPIRED",
  "REGISTRATION_SESSION_EXPIRED",
]);

/** Maps Magento errors when completing registration (create-account submit). */
export function mapAuthErrorMessageForRegistrationComplete(
  message: string,
  fallback: string,
): string {
  const trimmed = message.trim();
  if (REGISTRATION_SESSION_EXPIRED_MAGENTO_CODES.has(trimmed)) {
    return REGISTRATION_SESSION_EXPIRED_MESSAGE;
  }
  return mapAuthErrorMessage(message, fallback);
}

/** True when create-account should show session-expired refresh UX (not OTP entry). */
export function isRegistrationSessionExpiredError(message: string | undefined): boolean {
  if (!message?.trim()) {
    return false;
  }
  const trimmed = message.trim();
  if (trimmed === REGISTRATION_SESSION_EXPIRED_MESSAGE) {
    return true;
  }
  if (REGISTRATION_SESSION_EXPIRED_MAGENTO_CODES.has(trimmed)) {
    return true;
  }
  // Legacy BFF mapping before registration-complete-specific errors.
  if (trimmed === "Incorrect code") {
    return true;
  }
  if (
    trimmed === "We could not create your account. Please try again."
    || trimmed
      === "We could not create your account in Magento. Please request a new OTP and try again."
  ) {
    return true;
  }
  return false;
}
