"use client";

import { useRef } from "react";
import { homepageQueryKeys } from "@/hooks/homepage/queryKeys";
import { seedHomepageCmsCache, type HomepagePrefetchedCms } from "@/lib/homepage/cmsCache";

type HomepageCmsSeederProps = HomepagePrefetchedCms;

/** Seeds the client CMS cache synchronously on first render (no UI). */
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
