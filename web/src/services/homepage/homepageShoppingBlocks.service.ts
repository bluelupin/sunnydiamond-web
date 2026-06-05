import { apiFetch } from "@/api/fetchClient";
import type { HomepageShoppingBlocksData } from "@/types/homepage/categoryNavigation";

export async function getHomepageShoppingBlocks(signal?: AbortSignal): Promise<HomepageShoppingBlocksData> {
  return apiFetch<HomepageShoppingBlocksData>("api/homepage/shopping-blocks", {
    signal,
  });
}
