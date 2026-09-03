import type { PrefetchedAlankaraCollection } from "@/features/products/services/prefetchProductDetailAlankara";
import type { HomepageShoppingBlocksData } from "@/types/homepage/categoryNavigation";
import { getMagentoProductsBySkus } from "@/services/magento/products/products.service";
import { isSectionActive } from "@/shared/utils/cmsSection";
import {
  mapMagentoProductsToAlankaraCollection,
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

  if (collectionProps.productSkus.length === 0) {
    return {
      products:
        collectionProps.products.length > 0 ? collectionProps.products : null,
      defaultActiveIndex: collectionProps.defaultActiveIndex,
    };
  }

  try {
    const items = await getMagentoProductsBySkus(collectionProps.productSkus);
    const mapped = mapMagentoProductsToAlankaraCollection(items, collectionProps.productSkus, {
      featuredProductSku: collectionProps.featuredProductSku,
      ctaLabel: collectionProps.productCtaLabel,
    });

    return {
      products: mapped.products.length > 0 ? mapped.products : null,
      defaultActiveIndex: mapped.defaultActiveIndex,
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
