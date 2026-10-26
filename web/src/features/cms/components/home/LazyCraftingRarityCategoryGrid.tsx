"use client";

import dynamic from "next/dynamic";
import { LazyInView } from "@/shared/ui/LazyInView";
import { CategoryGridSkeleton } from "./CraftingRarityCategoryGridSkeleton";
import type { CategoryNavigationItem } from "@/types/homepage/categoryNavigation";
import { buildJewelleryHref, parseJewelleryCategorySlug } from "@/features/jewellery-product/utils/jewelleryRoutes";
import SeoSectionFallback from "@/shared/ui/SeoSectionFallback";

const CraftingRarityCategoryGrid = dynamic(
  () => import("./CraftingRarityCategoryGrid"),
  { ssr: false, loading: () => <CategoryGridSkeleton /> },
);

export default function LazyCraftingRarityCategoryGrid({
  categories,
}: {
  categories: CategoryNavigationItem[];
}) {
  const links = categories.flatMap((category) => {
    if (category.showField === false) return [];
    const parsedCategory = parseJewelleryCategorySlug(category.slug);
    const href = category.cta?.url ?? category.cta?.to ??
      (parsedCategory ? buildJewelleryHref(parsedCategory) : "");
    const label = category.title?.trim() || category.label?.trim();
    return href && label ? [{ href, label }] : [];
  });

  return (
    <LazyInView fallback={links.length > 0 ? (
      <SeoSectionFallback title="Shop diamond jewellery by category" links={links} />
    ) : <CategoryGridSkeleton />}>
      <CraftingRarityCategoryGrid categories={categories} />
    </LazyInView>
  );
}
