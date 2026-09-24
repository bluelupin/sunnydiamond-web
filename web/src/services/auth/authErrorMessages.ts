/**
 * Magento's CustomerAuth module throws sentinel codes rather than prose so the
 * storefront owns the wording. Anything not listed here is already a human
 * message and passes through untouched.
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_IN_USE: "An account already exists with this email address.",
  PHONE_ALREADY_IN_USE: "This mobile number is already linked to another account.",
  OTP_MAX_ATTEMPTS: "Too many incorrect attempts. Please request a new code.",
  OTP_ALREADY_USED: "This code has already been used. Please request a new one.",
};

export function mapAuthErrorMessage(message: string, fallback: string): string {
  const trimmed = message.trim();
  if (!trimmed) {
    return fallback;
  }
  return AUTH_ERROR_MESSAGES[trimmed] ?? trimmed;
}
