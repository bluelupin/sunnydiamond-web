import { apiFetch } from "@/api/fetchClient";

export async function getHomepageEditorialBlocks(signal?: AbortSignal) {
  return apiFetch<any>("homepage/editorial-blocks", {
    signal,
  });
}
