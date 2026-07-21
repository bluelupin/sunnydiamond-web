"use client";

import { useRef } from "react";
import { magentoQueryKeys } from "@/hooks/magento/queryKeys";
import { seedCmsCacheEntry } from "@/lib/homepage/cmsCache";
import type { JewelleryNavCategoriesData } from "@/types/magento/jewelleryNav";

type MagentoNavSeederProps = {
  jewelleryNav?: JewelleryNavCategoriesData;
};

/** Seeds Magento nav cache on first render so header menus avoid a client GraphQL hop. */
export default function MagentoNavSeeder({ jewelleryNav }: MagentoNavSeederProps) {
  const seededRef = useRef(false);

  if (!seededRef.current && jewelleryNav !== undefined) {
    seedCmsCacheEntry(magentoQueryKeys.jewelleryNav, jewelleryNav);
    seededRef.current = true;
  }

  return null;
}
