import { validateOptionalEmail } from "@/shared/utils/formValidation";

function normalizeProfileEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isSyntheticProfileEmail(email: string): boolean {
  const normalized = normalizeProfileEmail(email);
  return /^guest\+.+@sunnydiamond\.com$/.test(normalized);
}

/** True when the account email is a real, registered address (not empty or synthetic). */
export function isRegisteredProfileEmail(email: string): boolean {
  const normalized = normalizeProfileEmail(email);
  if (!normalized || isSyntheticProfileEmail(normalized)) {
    return false;
  }

  return validateOptionalEmail(normalized).valid;
}
