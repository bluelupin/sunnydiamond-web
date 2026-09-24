import type { PrefetchedAlankaraCollection } from "@/features/products/services/prefetchProductDetailAlankara";
import type { HomepageShoppingBlocksData } from "@/types/homepage/categoryNavigation";
import { ALANKARA_PRODUCT_COUNT } from "@/shared/ui/collection/alankaraCollection.types";
import { getMagentoProductsByCollection } from "@/services/magento/products/collectionProducts.service";
import { isSectionActive } from "@/shared/utils/cmsSection";
import {
  mapMagentoProductsToAlankaraCollectionList,
  resolveAlankaraCollectionSection,
} from "@/shared/utils/resolveAlankaraCollectionSection";

export type HomepageBelowFoldPrefetch = {
  alankara?: PrefetchedAlankaraCollection | null;
};

export async function prefetchAlankaraCollectionFromShopping(
  shoppingData?: HomepageShoppingBlocksData | null,
): Promise<PrefetchedAlankaraCollection | null> {
  const featuredCollectionData =
    shoppingData?.homepage?.featuredCollectionSection ?? shoppingData?.featuredCollectionSection;

  const collectionProps = resolveAlankaraCollectionSection(featuredCollectionData);

  if (!isSectionActive(collectionProps.isActive)) {
    return null;
  }

  const magentoCollectionSlug = collectionProps.magentoCollectionSlug;
  if (!magentoCollectionSlug) {
    return {
      products: null,
      defaultActiveIndex: collectionProps.defaultActiveIndex,
    };
  }

  try {
    const items = await getMagentoProductsByCollection(
      magentoCollectionSlug,
      ALANKARA_PRODUCT_COUNT,
    );
    const mapped = mapMagentoProductsToAlankaraCollectionList(items, {
      ctaLabel: collectionProps.productCtaLabel,
    });

    return {
      products: mapped.length > 0 ? mapped : null,
      defaultActiveIndex: collectionProps.defaultActiveIndex,
    };
  } catch {
    return {
      products: null,
      defaultActiveIndex: collectionProps.defaultActiveIndex,
    };
  }
}

export async function prefetchHomepageBelowFold(
  cms: { shopping?: HomepageShoppingBlocksData | null },
): Promise<HomepageBelowFoldPrefetch> {
  const alankara = await prefetchAlankaraCollectionFromShopping(cms.shopping);

  return { alankara };
}
