import { cache } from "react";
import { getHomepageShoppingBlocks } from "./homepageShoppingBlocks.service";
import type { GiftingBanner } from "@/types/homepage/categoryNavigation";

/** @deprecated Prefer `getHomepageShoppingBlocks()` — gifting data lives on shopping-blocks. */
export const getGiftingBanner = cache(
  async (signal?: AbortSignal): Promise<GiftingBanner | null> => {
    const shopping = await getHomepageShoppingBlocks(signal);
    return shopping.giftingBanner ?? shopping.homepage?.giftingBanner ?? null;
  },
);
