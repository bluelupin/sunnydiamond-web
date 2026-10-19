export type AuthLoginIdentifierKind = "email" | "phone";

const STORAGE_KEY = "sunny-auth-login-identifier-kind";

export function setAuthLoginIdentifierKind(kind: AuthLoginIdentifierKind): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, kind);
  } catch {
    // ignore quota / private mode
  }
}

export function getAuthLoginIdentifierKind(): AuthLoginIdentifierKind | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "email" || value === "phone") return value;
  } catch {
    // ignore
  }
  return null;
}

export function clearAuthLoginIdentifierKind(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Maps Magento `/me` `signupMethod` (`sd_signup_method`) to contact lock kind — same as Profile. */
export function signupMethodToContactLockKind(
  signupMethod: string | null | undefined,
): AuthLoginIdentifierKind | null {
  const method = signupMethod?.trim().toLowerCase();
  if (!method || method === "unknown") return null;
  if (method === "phone" || method.includes("mobile") || method.includes("sms")) return "phone";
  if (method === "email") return "email";
  if (method.includes("phone")) return "phone";
  if (method.includes("email")) return "email";
  return null;
}

/** Signup method when set; otherwise the identifier kind from the last OTP sign-in on this device. */
export function resolveCustomerContactLockKind(
  signupMethod: string | null | undefined,
): AuthLoginIdentifierKind | null {
  return signupMethodToContactLockKind(signupMethod) ?? getAuthLoginIdentifierKind();
}

/** Field locks for appointment/profile contact fields from signup method or login identifier kind. */
export function getAppointmentContactLocks(kind: AuthLoginIdentifierKind | null): {
  phoneLocked: boolean;
  emailLocked: boolean;
} {
  if (kind === "phone") {
    return { phoneLocked: true, emailLocked: false };
  }
  if (kind === "email") {
    return { phoneLocked: false, emailLocked: true };
  }
  return { phoneLocked: false, emailLocked: false };
}
