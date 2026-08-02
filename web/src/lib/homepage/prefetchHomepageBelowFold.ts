import { homeContent } from "@/features/cms/data/content";
import type { PrefetchedAlankaraCollection } from "@/features/products/services/prefetchProductDetailAlankara";
import { getHomepageOccasions } from "@/services/homepage/homepageOccasions.service";
import type { HomepageShoppingBlocksData } from "@/types/homepage/categoryNavigation";
import type { HomepageEditorialBlocksData } from "@/types/homepage/editorialBlocks";
import type { OccasionCard } from "@/types/homepage/occasionSection";
import { getMagentoProductsBySkus } from "@/services/magento/products/products.service";
import { isSectionActive } from "@/shared/utils/cmsSection";
import {
  mapMagentoProductsToAlankaraCollection,
  resolveAlankaraCollectionSection,
} from "@/shared/utils/resolveAlankaraCollectionSection";
import type { HomepagePrefetchedCms } from "./cmsCache";

export type HomepageBelowFoldPrefetch = {
  alankara?: PrefetchedAlankaraCollection | null;
  standaloneOccasions?: OccasionCard[];
};

function hasEmbeddedOccasions(editorial?: HomepageEditorialBlocksData | null): boolean {
  const occasions = editorial?.occasionSection?.occasions ?? [];
  return occasions.some((card) => card?.isActive !== false);
}

export async function prefetchAlankaraCollectionFromShopping(
  shoppingData?: HomepageShoppingBlocksData | null,
  descriptionOverride?: string,
): Promise<PrefetchedAlankaraCollection | null> {
  const featuredCollectionData =
    shoppingData?.homepage?.featuredCollectionSection ?? shoppingData?.featuredCollectionSection;

  const collectionProps = resolveAlankaraCollectionSection(featuredCollectionData, {
    descriptionOverride,
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

  try {
    const items = await getMagentoProductsBySkus(collectionProps.productSkus);
    const mapped = mapMagentoProductsToAlankaraCollection(items, collectionProps.productSkus, {
      featuredProductSku: collectionProps.featuredProductSku,
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

async function prefetchStandaloneOccasions(
  editorial?: HomepageEditorialBlocksData | null,
): Promise<OccasionCard[] | undefined> {
  if (hasEmbeddedOccasions(editorial)) {
    return undefined;
  }

  try {
    return await getHomepageOccasions();
  } catch {
    return undefined;
  }
}

export async function prefetchHomepageBelowFold(
  cms: HomepagePrefetchedCms,
): Promise<HomepageBelowFoldPrefetch> {
  const [alankara, standaloneOccasions] = await Promise.all([
    prefetchAlankaraCollectionFromShopping(
      cms.shopping,
      homeContent.alankara.collection.description,
    ),
    prefetchStandaloneOccasions(cms.editorial),
  ]);

  return {
    alankara,
    ...(standaloneOccasions !== undefined ? { standaloneOccasions } : {}),
  };
}
