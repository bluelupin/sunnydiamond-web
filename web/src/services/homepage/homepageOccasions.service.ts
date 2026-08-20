import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import type { OccasionCard } from "@/types/homepage/occasionSection";
import { mapOccasionCards } from "./homepage.mapper";
import type { StrapiOccasionCard } from "./homepage.strapi.types";

const OCCASIONS_POPULATE_QUERY =
  "populate[image][populate][desktopImage]=true" +
  "&populate[image][populate][mobileImage]=true" +
  "&populate[cta]=true";

/** Standalone Strapi collection used when editorial `occasionSection.occasions` is empty. */
export const getHomepageOccasions = cache(
  async (signal?: AbortSignal): Promise<OccasionCard[]> => {
    const raw = await apiFetch<StrapiOccasionCard[] | { data?: StrapiOccasionCard[] }>(
      `${STRAPI_ENDPOINTS.occasions}?${OCCASIONS_POPULATE_QUERY}`,
      { signal },
    );

    const items = Array.isArray(raw)
      ? raw
      : raw && typeof raw === "object" && Array.isArray(raw.data)
        ? raw.data
        : [];

    return mapOccasionCards(items);
  },
);
