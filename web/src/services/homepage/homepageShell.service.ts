import { apiFetch } from "@/api/fetchClient";

export async function getHomepageShell(signal?: AbortSignal) {
  return apiFetch<any>("api/homepage/shell", {
    signal,
  });
}
