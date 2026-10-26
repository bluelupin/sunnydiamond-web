import type { ProfileAppointmentUi } from "../types/profileUi.types";

type ProfileTryAtHomeAddressUi = NonNullable<ProfileAppointmentUi["appointmentAddress"]>;

const STORAGE_KEY = "profile.tryAtHome.rescheduledAddressByAppointmentId";

export function loadStoredTryAtHomeAddressPatches(): Map<string, ProfileTryAtHomeAddressUi> {
  if (typeof window === "undefined") {
    return new Map();
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return new Map();
    }

    const parsed = JSON.parse(raw) as Record<string, ProfileTryAtHomeAddressUi>;
    return new Map(Object.entries(parsed));
  } catch {
    return new Map();
  }
}

export function persistTryAtHomeAddressPatches(
  patches: ReadonlyMap<string, ProfileTryAtHomeAddressUi>,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(patches)));
  } catch {
    // sessionStorage may be unavailable; in-memory patches still apply this session.
  }
}

export function storeTryAtHomeAddressPatchForIds(
  current: ReadonlyMap<string, ProfileTryAtHomeAddressUi>,
  appointmentIds: readonly string[],
  address: ProfileTryAtHomeAddressUi,
): Map<string, ProfileTryAtHomeAddressUi> {
  const next = new Map(current);
  for (const id of appointmentIds) {
    if (id.trim()) {
      next.set(id.trim(), address);
    }
  }
  persistTryAtHomeAddressPatches(next);
  return next;
}
