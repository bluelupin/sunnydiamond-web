export type AuthLoginIdentifierKind = "email" | "phone";

const STORAGE_KEY = "sunny-auth-login-identifier-kind";

export function setAuthLoginIdentifierKind(kind: AuthLoginIdentifierKind): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, kind);
  } catch {
    // ignore quota / private mode
  }
}

export function getAuthLoginIdentifierKind(): AuthLoginIdentifierKind | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.sessionStorage.getItem(STORAGE_KEY);
    if (value === "email" || value === "phone") return value;
  } catch {
    // ignore
  }
  return null;
}

export function clearAuthLoginIdentifierKind(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Field locks for appointment forms based on how the user signed in. */
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
