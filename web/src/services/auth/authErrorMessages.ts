/**
 * Magento's CustomerAuth module throws sentinel codes rather than prose so the
 * storefront owns the wording. Anything not listed here is already a human
 * message and passes through untouched.
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "Invalid or expired OTP.": "Incorrect code",
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
