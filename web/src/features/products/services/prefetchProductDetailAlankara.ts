import { homeContent } from "@/features/cms/data/content";
import { getCachedHomepageShoppingBlocks } from "@/lib/homepage/prefetchHomepageCms";
import { getMagentoProductsBySkus } from "@/services/magento/products/products.service";
import type { AlankaraCollectionProduct } from "@/shared/ui/collection/alankaraCollection.types";
import { isSectionActive } from "@/shared/utils/cmsSection";
import {
  mapMagentoProductsToAlankaraCollection,
  resolveAlankaraCollectionSection,
} from "@/shared/utils/resolveAlankaraCollectionSection";

export type PrefetchedAlankaraCollection = {
  products: AlankaraCollectionProduct[] | null;
  defaultActiveIndex: number;
};

export async function prefetchProductDetailAlankaraCollection(): Promise<PrefetchedAlankaraCollection | null> {
  const shoppingData = await getCachedHomepageShoppingBlocks();
  const featuredCollectionData =
    shoppingData?.homepage?.featuredCollectionSection ?? shoppingData?.featuredCollectionSection;

  const collectionProps = resolveAlankaraCollectionSection(featuredCollectionData, {
    descriptionOverride: homeContent.alankara.collection.description,
  });

  if (!isSectionActive(collectionProps.isActive)) {
    return null;
  }

  if (collectionProps.productSkus.length === 0) {
    return {
      products: null,
      defaultActiveIndex: collectionProps.defaultActiveIndex,
    };
  }

  const items = await getMagentoProductsBySkus(collectionProps.productSkus);
  const mapped = mapMagentoProductsToAlankaraCollection(items, collectionProps.productSkus, {
    featuredProductSku: collectionProps.featuredProductSku,
  });

  return {
    products: mapped.products.length > 0 ? mapped.products : null,
    defaultActiveIndex: mapped.defaultActiveIndex,
  };
}
