"use client";

import dynamic from "next/dynamic";
import { LazyInView } from "@/shared/ui/LazyInView";
import { CategoryGridSkeleton } from "./CraftingRarityCategoryGridSkeleton";
import type { CategoryNavigationItem } from "@/types/homepage/categoryNavigation";

const CraftingRarityCategoryGrid = dynamic(
  () => import("./CraftingRarityCategoryGrid"),
  { ssr: false, loading: () => <CategoryGridSkeleton /> },
);

export default function LazyCraftingRarityCategoryGrid({
  categories,
}: {
  categories: CategoryNavigationItem[];
}) {
  return (
    <LazyInView fallback={<CategoryGridSkeleton />}>
      <CraftingRarityCategoryGrid categories={categories} />
    </LazyInView>
  );
}
