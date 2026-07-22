import {
  CRAFTING_RARITY_CATEGORY_SLUGS,
  type CraftingRarityCategory,
  type CraftingRarityCategorySlug,
  mapCraftingRarityCategories,
} from "@/features/cms/data/craftingRarityCategories";
import type { JewelleryNavCategoriesData } from "@/types/magento/jewelleryNav";
import { getMagentoJewelleryNavCategories } from "../categories/categories.service";
import { magentoGraphqlFetch } from "../graphqlClient";
import type { MagentoProductListItem } from "./magentoProduct.types";
import { resolveMagentoProductImages } from "./products.mapper";
import { CRAFTING_RARITY_CATEGORY_PRODUCTS_QUERY } from "./craftingRarityProducts.query";

type CraftingRarityCategoryProductsResponse = {
  rings?: { items?: MagentoProductListItem[] | null } | null;
  earrings?: { items?: MagentoProductListItem[] | null } | null;
  bracelets?: { items?: MagentoProductListItem[] | null } | null;
  necklace?: { items?: MagentoProductListItem[] | null } | null;
};

export type CraftingRarityCategoriesData = {
  categories: CraftingRarityCategory[];
};

const RESPONSE_KEY_BY_SLUG: Record<CraftingRarityCategorySlug, keyof CraftingRarityCategoryProductsResponse> = {
  rings: "rings",
  earrings: "earrings",
  bracelets: "bracelets",
  necklace: "necklace",
};

const EMPTY_CATEGORY_FILTER = { sku: { eq: "__crafting_rarity_missing__" } };

function pickFirstProductImage(items: MagentoProductListItem[] | null | undefined): string {
  for (const item of items ?? []) {
    const { primaryImage } = resolveMagentoProductImages(item.media_gallery, item.image?.url);
    if (primaryImage) {
      return primaryImage;
    }
  }

  return "";
}

function buildCategoryFilter(categoryId: string | null | undefined) {
  if (!categoryId) {
    return EMPTY_CATEGORY_FILTER;
  }

  return { category_id: { eq: categoryId } };
}

async function fetchCraftingRarityProductImages(
  nav: JewelleryNavCategoriesData,
  signal?: AbortSignal,
): Promise<Partial<Record<CraftingRarityCategorySlug, string>>> {
  const navBySlug = new Map(
    nav.categories
      .filter((category) => category.slug)
      .map((category) => [category.slug!, category]),
  );

  const data = await magentoGraphqlFetch<CraftingRarityCategoryProductsResponse>({
    query: CRAFTING_RARITY_CATEGORY_PRODUCTS_QUERY,
    variables: {
      ringsFilter: buildCategoryFilter(navBySlug.get("rings")?.categoryId),
      earringsFilter: buildCategoryFilter(navBySlug.get("earrings")?.categoryId),
      braceletsFilter: buildCategoryFilter(navBySlug.get("bracelets")?.categoryId),
      necklaceFilter: buildCategoryFilter(navBySlug.get("necklace")?.categoryId),
    },
    signal,
    cache: "no-store",
  });

  const images: Partial<Record<CraftingRarityCategorySlug, string>> = {};

  for (const slug of CRAFTING_RARITY_CATEGORY_SLUGS) {
    const responseKey = RESPONSE_KEY_BY_SLUG[slug];
    const image = pickFirstProductImage(data[responseKey]?.items);
    if (image) {
      images[slug] = image;
    }
  }

  return images;
}

export async function getCraftingRarityCategories(
  signal?: AbortSignal,
): Promise<CraftingRarityCategoriesData> {
  const nav = await getMagentoJewelleryNavCategories(signal);
  const productImages = await fetchCraftingRarityProductImages(nav, signal);

  return {
    categories: mapCraftingRarityCategories(nav.categories, productImages),
  };
}
