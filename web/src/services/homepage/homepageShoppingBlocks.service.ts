import { apiFetch } from "@/api/fetchClient";

export async function getHomepageShoppingBlocks(signal?: AbortSignal) {
  return apiFetch<any>("homepage/shopping-blocks", {
    signal,
  });
}
