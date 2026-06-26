import { cache } from "react";
import { apiFetch } from "@/api/fetchClient";
import { mapAboutPageData } from "./about-page.mapper";
import type { NormalizedAboutPage, StrapiAboutPageEntity } from "./about-page.types";

export const getAboutPage = cache(
  async (signal?: AbortSignal): Promise<NormalizedAboutPage> => {
    // const raw = await apiFetch<StrapiAboutPageEntity>("api/about-page", {
    //   params: { populate: "*" },
    //   signal,
    // });
    const raw = await apiFetch<StrapiAboutPageEntity>(
      "api/about-page?populate=*&populate[brillianceSection][populate][featureSlide][populate][image][populate][desktopImage]=true&populate[brillianceSection][populate][featureSlide][populate][image][populate][mobileImage]=true",
      { signal },
    );

    return mapAboutPageData(raw);
  },
);

export { EMPTY_ABOUT_PAGE } from "./about-page.types";
export type { NormalizedAboutPage } from "./about-page.types";
