import { apiFetch } from "@/api/fetchClient";
import type { HomepageEditorialBlocksData } from "@/types/homepage/editorialBlocks";

export async function getHomepageEditorialBlocks(
  signal?: AbortSignal,
): Promise<HomepageEditorialBlocksData> {
  return apiFetch<HomepageEditorialBlocksData>("api/homepage/editorial-blocks", {
    signal,
  });
}
