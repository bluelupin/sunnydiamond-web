import type { AlankaraCollectionProduct } from "@/shared/ui/collection/alankaraCollection.types";
import { homeContent } from "@/features/cms/data/content";
import { getCachedHomepageShoppingBlocks } from "@/lib/homepage/prefetchHomepageCms";
import { prefetchAlankaraCollectionFromShopping } from "@/lib/homepage/prefetchHomepageBelowFold";

export type PrefetchedAlankaraCollection = {
  products: AlankaraCollectionProduct[] | null;
  defaultActiveIndex: number;
};

export async function prefetchProductDetailAlankaraCollection(): Promise<PrefetchedAlankaraCollection | null> {
  const shoppingData = await getCachedHomepageShoppingBlocks();
  return prefetchAlankaraCollectionFromShopping(
    shoppingData,
    homeContent.alankara.collection.description,
  );
}
