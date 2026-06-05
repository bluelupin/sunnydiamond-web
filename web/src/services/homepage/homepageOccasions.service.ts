import { apiFetch } from "@/api/fetchClient";

export async function getHomepageOccasions(signal?: AbortSignal) {
  return apiFetch<any>("occasions?sort[0]=sortOrder:asc&populate[image][populate][desktopImage]=true&populate[image][populate][mobileImage]=true", {
    signal,
  });
}
