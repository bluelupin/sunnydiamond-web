import type { JewelleryCategorySlug } from "@/features/jewellery-product/types";
import {
  buildJewelleryHref,
  JEWELLERY_SLUG_TO_URL_KEY,
} from "@/features/jewellery-product/utils/jewelleryRoutes";
import type { JewelleryNavCategory } from "@/types/magento/jewelleryNav";

export const CRAFTING_RARITY_CATEGORY_SLUGS = [
  "rings",
  "earrings",
  "bracelets",
  "necklace",
] as const satisfies readonly JewelleryCategorySlug[];

export type CraftingRarityCategorySlug = (typeof CRAFTING_RARITY_CATEGORY_SLUGS)[number];

const CRAFTING_RARITY_CATEGORY_IMAGES: Record<CraftingRarityCategorySlug, string> = {
  rings: "/images/jewellery/plp/product-ring-transparent.avif",
  earrings: "/images/jewellery/plp/product-earrings-transparent.avif",
  bracelets: "/images/jewellery/plp/product-bracelet-transparent.avif",
  necklace: "/images/jewellery/plp/product-necklace-transparent.avif",
};

const CRAFTING_RARITY_CATEGORY_LABELS: Record<CraftingRarityCategorySlug, string> = {
  rings: "Rings",
  earrings: "Earrings",
  bracelets: "Bracelets",
  necklace: "Necklace",
};

export type CraftingRarityCategory = JewelleryNavCategory & {
  imageSrc: string;
};

function buildFallbackCraftingRarityCategory(slug: CraftingRarityCategorySlug): CraftingRarityCategory {
  const urlKey = JEWELLERY_SLUG_TO_URL_KEY[slug] ?? null;

  return {
    id: slug,
    label: CRAFTING_RARITY_CATEGORY_LABELS[slug],
    href: buildJewelleryHref(slug),
    image: null,
    imageSrc: CRAFTING_RARITY_CATEGORY_IMAGES[slug],
    urlKey,
    categoryId: null,
    slug,
    productCount: 0,
    sortOrder: 0,
  };
}

export function mapCraftingRarityCategories(
  categories: JewelleryNavCategory[] | null | undefined,
  productImagesBySlug: Partial<Record<CraftingRarityCategorySlug, string>> = {},
): CraftingRarityCategory[] {
  const bySlug = new Map(
    (categories ?? [])
      .filter((category) => category.slug)
      .map((category) => [category.slug!, category]),
  );

  return CRAFTING_RARITY_CATEGORY_SLUGS.map((slug) => {
    const category = bySlug.get(slug);
    const productImage = productImagesBySlug[slug]?.trim();

    if (!category) {
      return {
        ...buildFallbackCraftingRarityCategory(slug),
        imageSrc: productImage || CRAFTING_RARITY_CATEGORY_IMAGES[slug],
      };
    }

    return {
      ...category,
      imageSrc: productImage || CRAFTING_RARITY_CATEGORY_IMAGES[slug] || "",
    };
  });
}
