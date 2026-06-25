import type { HomepageQueryKey } from "@/hooks/homepage/queryKeys";

export type CmsCacheEntry<T> = {
  value?: T;
  promise?: Promise<T>;
  error?: string;
  updatedAt: number;
};

const cache = new Map<string, CmsCacheEntry<unknown>>();

export function getCmsCacheEntry<T>(key: HomepageQueryKey): CmsCacheEntry<T> | undefined {
  return cache.get(key) as CmsCacheEntry<T> | undefined;
}

export function setCmsCacheEntry<T>(key: HomepageQueryKey, entry: CmsCacheEntry<T>): void {
  cache.set(key, entry as CmsCacheEntry<unknown>);
}

export function seedCmsCacheEntry<T>(key: HomepageQueryKey, value: T): void {
  setCmsCacheEntry(key, {
    value,
    promise: undefined,
    error: undefined,
    updatedAt: Date.now(),
  });
}

export function isCmsCacheFresh(key: HomepageQueryKey, staleTimeMs: number): boolean {
  const entry = getCmsCacheEntry(key);
  if (!entry?.value || entry.updatedAt === 0) return false;
  return Date.now() - entry.updatedAt < staleTimeMs;
}

export type HomepagePrefetchedCms = {
  shell?: unknown;
  editorial?: unknown;
  shopping?: unknown;
};

export function seedHomepageCmsCache(
  data: HomepagePrefetchedCms,
  keys: {
    shell: HomepageQueryKey;
    editorial: HomepageQueryKey;
    shopping: HomepageQueryKey;
  },
): void {
  if (data.shell !== undefined) {
    seedCmsCacheEntry(keys.shell, data.shell);
  }
  if (data.editorial !== undefined) {
    seedCmsCacheEntry(keys.editorial, data.editorial);
  }
  if (data.shopping !== undefined) {
    seedCmsCacheEntry(keys.shopping, data.shopping);
  }
}
