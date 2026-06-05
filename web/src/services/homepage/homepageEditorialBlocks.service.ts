import { apiFetch } from "@/api/fetchClient";

export async function getHomepageEditorialBlocks(signal?: AbortSignal) {
  return apiFetch<any>("api/homepage/editorial-blocks", {
    signal,
  });
}
