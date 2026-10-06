import { GUEST_SAVED_INSPIRATIONS_STORAGE_KEY } from "@/features/bespoke/constants";

export function normalizeSavedInspirationDocumentIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const raw of ids) {
    const id = raw.trim();
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    normalized.push(id);
  }

  return normalized;
}

export function readGuestSavedInspirationsFromStorage(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(GUEST_SAVED_INSPIRATIONS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? normalizeSavedInspirationDocumentIds(
          parsed.filter((id): id is string => typeof id === "string"),
        )
      : [];
  } catch {
    return [];
  }
}

export function writeGuestSavedInspirationsToStorage(documentIds: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeSavedInspirationDocumentIds(documentIds);
  if (normalized.length === 0) {
    window.localStorage.removeItem(GUEST_SAVED_INSPIRATIONS_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(GUEST_SAVED_INSPIRATIONS_STORAGE_KEY, JSON.stringify(normalized));
}

export function clearGuestSavedInspirationsStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(GUEST_SAVED_INSPIRATIONS_STORAGE_KEY);
}
