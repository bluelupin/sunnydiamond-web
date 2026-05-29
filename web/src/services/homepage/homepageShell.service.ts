import { apiFetch } from "@/api/fetchClient";

export async function getHomepageShell(signal?: AbortSignal) {
  return apiFetch<any>("homepage/shell", {
    signal,
  });
}
