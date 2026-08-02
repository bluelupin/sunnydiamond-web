import { cache } from "react";
import { magentoGraphqlFetch } from "../graphqlClient";
import { MAGENTO_JEWELLERY_NAV_CATEGORIES_QUERY } from "./categories.query";
import { mapMagentoCategoryListToJewelleryNav } from "./categories.mapper";
import type { MagentoCategoryListResponse } from "./magentoCategory.types";
import type { JewelleryNavCategoriesData } from "@/types/magento/jewelleryNav";

export const getMagentoJewelleryNavCategories = cache(
  async (signal?: AbortSignal): Promise<JewelleryNavCategoriesData> => {
    const data = await magentoGraphqlFetch<MagentoCategoryListResponse>({
      query: MAGENTO_JEWELLERY_NAV_CATEGORIES_QUERY,
      signal,
    });

    const categories = mapMagentoCategoryListToJewelleryNav(data.categoryList);
    return { categories };
  },
);

export const EMPTY_JEWELLERY_NAV_CATEGORIES: JewelleryNavCategoriesData = { categories: [] };
