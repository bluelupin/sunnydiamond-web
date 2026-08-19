import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { mapPastCreations } from "./contact-bespoke-page.mapper";
import type {
  NormalizedBespokePastCreations,
  StrapiBespokePastCreation,
} from "./contact-bespoke-page.types";

export async function getPastCreations(
  signal?: AbortSignal,
): Promise<NormalizedBespokePastCreations | null> {
  const stories = await apiFetch<StrapiBespokePastCreation[]>(
    `${STRAPI_ENDPOINTS.featuredStories}?populate=*`,
    { signal },
  );

  return mapPastCreations(stories);
}
