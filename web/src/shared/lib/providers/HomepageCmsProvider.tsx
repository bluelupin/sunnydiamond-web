"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import type { PrefetchedAlankaraCollection } from "@/features/products/services/prefetchProductDetailAlankara";
import { homepageQueryKeys } from "@/hooks/homepage/queryKeys";
import { seedHomepageCmsCache, type HomepagePrefetchedCms } from "@/lib/homepage/cmsCache";

export type HomepageCmsContextValue = HomepagePrefetchedCms & {
  alankara?: PrefetchedAlankaraCollection | null;
};

const HomepageCmsContext = createContext<HomepageCmsContextValue | null>(null);

type HomepageCmsProviderProps = HomepageCmsContextValue & {
  children: ReactNode;
};

/**
 * Supplies server-prefetched homepage CMS to hooks so SSR and hydration agree.
 * Also seeds the in-memory cache for any legacy readers.
 */
export function HomepageCmsProvider({
  shell,
  editorial,
  shopping,
  alankara,
  children,
}: HomepageCmsProviderProps) {
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

  return (
    <HomepageCmsContext.Provider
      value={{ shell, editorial, shopping, alankara }}
    >
      {children}
    </HomepageCmsContext.Provider>
  );
}

export function useHomepageCmsPrefetched(): HomepageCmsContextValue | null {
  return useContext(HomepageCmsContext);
}
