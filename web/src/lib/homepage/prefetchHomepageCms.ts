import { cache } from "react";
import { getHomepageEditorialBlocks } from "@/services/homepage/homepageEditorialBlocks.service";
import { getHomepageShell } from "@/services/homepage/homepageShell.service";
import { getHomepageShoppingBlocks } from "@/services/homepage/homepageShoppingBlocks.service";
import type { HomepagePrefetchedCms } from "./cmsCache";

export const getCachedHomepageShell = cache(async () => getHomepageShell());

export const getCachedHomepageEditorialBlocks = cache(async () =>
  getHomepageEditorialBlocks(),
);

export const getCachedHomepageShoppingBlocks = cache(async () =>
  getHomepageShoppingBlocks(),
);

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
