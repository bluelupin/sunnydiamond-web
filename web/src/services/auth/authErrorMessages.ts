/**
 * Magento's CustomerAuth module throws sentinel codes rather than prose so the
 * storefront owns the wording. Anything not listed here is already a human
 * message and passes through untouched.
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_IN_USE: "An account already exists with this email address.",
  PHONE_ALREADY_IN_USE: "This mobile number is already linked to another account.",
  // Raised when the address belongs to an account created with a mobile number and
  // never confirmed. Signing in by email would hand over an account the mailbox
  // owner did not create, so we steer them to the method that account was built on.
  EMAIL_NOT_VERIFIED_FOR_LOGIN:
    "This email is linked to an account created with a mobile number. Please sign in with that mobile number, or with Google or Apple.",
};

export function mapAuthErrorMessage(message: string, fallback: string): string {
  const trimmed = message.trim();
  if (!trimmed) {
    return fallback;
  }
  return AUTH_ERROR_MESSAGES[trimmed] ?? trimmed;
}
