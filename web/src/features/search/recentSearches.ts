const STORAGE_KEY = "sunny_recent_searches";
const MAX_RECENT = 4;

export function readRecentSearches(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  const value = query.trim();
  if (!value) return;
  try {
    const next = [value, ...readRecentSearches().filter((item) => item.toLowerCase() !== value.toLowerCase())];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, MAX_RECENT)));
  } catch {
    // Private mode or blocked storage: recents are a convenience, search still works.
  }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
