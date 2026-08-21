import { validateOptionalEmail } from "@/shared/utils/formValidation";

const PROFILE_EMAIL_VERIFIED_PREFIX = "sd:profile-email-verified:";

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

export function getProfileEmailVerifiedStorageKey(customerId: number): string {
  return `${PROFILE_EMAIL_VERIFIED_PREFIX}${customerId}`;
}

export function readPersistedProfileEmailVerification(
  customerId: number,
  email: string,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const normalized = normalizeProfileEmail(email);
  if (!normalized) {
    return false;
  }

  try {
    return sessionStorage.getItem(getProfileEmailVerifiedStorageKey(customerId)) === normalized;
  } catch {
    return false;
  }
}

export function persistProfileEmailVerification(customerId: number, email: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeProfileEmail(email);
  if (!normalized) {
    return;
  }

  try {
    sessionStorage.setItem(getProfileEmailVerifiedStorageKey(customerId), normalized);
  } catch {
    /* ignore quota / privacy errors */
  }
}

export function isProfileEmailVerified(customerId: number, email: string): boolean {
  return (
    isRegisteredProfileEmail(email) || readPersistedProfileEmailVerification(customerId, email)
  );
}
