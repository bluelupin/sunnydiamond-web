/**
 * Normalizes Indian mobile numbers for Magento OTP mutations.
 * Accepts 10-digit national, 12-digit with 91 prefix, or values already prefixed with +91.
 */
export function normalizePhoneForMagento(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (!digits) {
    return phone.trim();
  }

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  if (phone.trim().startsWith("+")) {
    return `+${digits}`;
  }

  return digits;
}
