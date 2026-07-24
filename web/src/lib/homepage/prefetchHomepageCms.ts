import { cache } from "react";
import { getHomepageEditorialBlocks } from "@/services/homepage/homepageEditorialBlocks.service";
import { getHomepageShell } from "@/services/homepage/homepageShell.service";
import { getHomepageShoppingBlocks } from "@/services/homepage/homepageShoppingBlocks.service";
import type { HomepagePrefetchedCms } from "./cmsCache";
import {
  prefetchHomepageBelowFold,
  type HomepageBelowFoldPrefetch,
} from "./prefetchHomepageBelowFold";

export const getCachedHomepageShell = cache(async () => getHomepageShell());

export const getCachedHomepageEditorialBlocks = cache(async () =>
  getHomepageEditorialBlocks(),
);

export const getCachedHomepageShoppingBlocks = cache(async () =>
  getHomepageShoppingBlocks(),
);

export type HomepagePrefetchedBundle = HomepagePrefetchedCms & HomepageBelowFoldPrefetch;

export async function prefetchHomepageCms(): Promise<HomepagePrefetchedCms> {
  const [shellResult, editorialResult, shoppingResult] = await Promise.allSettled([
    getCachedHomepageShell(),
    getCachedHomepageEditorialBlocks(),
    getCachedHomepageShoppingBlocks(),
  ]);

  return {
    shell: shellResult.status === "fulfilled" ? shellResult.value : undefined,
    editorial: editorialResult.status === "fulfilled" ? editorialResult.value : undefined,
    shopping: shoppingResult.status === "fulfilled" ? shoppingResult.value : undefined,
  };
}

export async function prefetchHomepageBundle(): Promise<HomepagePrefetchedBundle> {
  const cms = await prefetchHomepageCms();
  const belowFold = await prefetchHomepageBelowFold(cms);
  return { ...cms, ...belowFold };
}
