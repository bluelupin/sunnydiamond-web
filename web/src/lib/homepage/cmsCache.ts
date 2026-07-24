import type { HomepageQueryKey } from "@/hooks/homepage/queryKeys";
import type { MagentoQueryKey } from "@/hooks/magento/queryKeys";
import type { HomepageEditorialBlocksData } from "@/types/homepage/editorialBlocks";
import type { HomepageShoppingBlocksData } from "@/types/homepage/categoryNavigation";
import type { NormalizedHomepageShell } from "@/services/homepage/homepageShell.service";
import type { OccasionCard } from "@/types/homepage/occasionSection";

export type AppDataCacheKey = HomepageQueryKey | MagentoQueryKey;

export type CmsCacheEntry<T> = {
  value?: T;
  promise?: Promise<T>;
  error?: string;
  updatedAt: number;
};

const cache = new Map<string, CmsCacheEntry<unknown>>();

export function getCmsCacheEntry<T>(key: AppDataCacheKey): CmsCacheEntry<T> | undefined {
  return cache.get(key) as CmsCacheEntry<T> | undefined;
}

export function setCmsCacheEntry<T>(key: AppDataCacheKey, entry: CmsCacheEntry<T>): void {
  cache.set(key, entry as CmsCacheEntry<unknown>);
}

export function seedCmsCacheEntry<T>(key: AppDataCacheKey, value: T): void {
  setCmsCacheEntry(key, {
    value,
    promise: undefined,
    error: undefined,
    updatedAt: Date.now(),
  });
}

export function isCmsCacheFresh(key: AppDataCacheKey, staleTimeMs: number): boolean {
  const entry = getCmsCacheEntry(key);
  if (!entry?.value || entry.updatedAt === 0) return false;
  return Date.now() - entry.updatedAt < staleTimeMs;
}

export type HomepagePrefetchedCms = {
  shell?: NormalizedHomepageShell;
  editorial?: HomepageEditorialBlocksData;
  shopping?: HomepageShoppingBlocksData;
  standaloneOccasions?: OccasionCard[];
};

export function seedHomepageCmsCache(
  data: HomepagePrefetchedCms,
  keys: {
    shell: HomepageQueryKey;
    editorial: HomepageQueryKey;
    shopping: HomepageQueryKey;
    occasions?: HomepageQueryKey;
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
  if (data.standaloneOccasions !== undefined && keys.occasions) {
    seedCmsCacheEntry(keys.occasions, data.standaloneOccasions);
  }
}
