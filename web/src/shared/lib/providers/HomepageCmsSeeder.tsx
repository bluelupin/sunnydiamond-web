"use client";

import { useRef } from "react";
import { homepageQueryKeys } from "@/hooks/homepage/queryKeys";
import { seedHomepageCmsCache, type HomepagePrefetchedCms } from "@/lib/homepage/cmsCache";

type HomepageCmsSeederProps = HomepagePrefetchedCms;

/** Seeds shell CMS for global chrome (header/footer) before layout children render. */
export default function HomepageCmsSeeder({
  shell,
  editorial,
  shopping,
}: HomepageCmsSeederProps) {
  const seededRef = useRef(false);

  if (!seededRef.current) {
    seedHomepageCmsCache(
      { shell, editorial, shopping },
      {
        shell: homepageQueryKeys.homepageShell,
        editorial: homepageQueryKeys.homePageEditorialBlocks,
        shopping: homepageQueryKeys.homePageShoppingBlocks,
      },
    );
    seededRef.current = true;
  }

  return null;
}
