import { buildJewelleryCategoryHref } from "@/features/jewellery-product/utils/jewelleryRoutes";
import { slugifyDiamondShapeLabel } from "@/features/jewellery-product/utils/diamondShapeListing";

export function buildEducationJourneyHref({
  categoryUrlKey,
  minPrice,
  maxPrice,
  diamondShapeLabel,
}: {
  categoryUrlKey: string | null;
  minPrice: number;
  maxPrice: number;
  diamondShapeLabel: string;
}): string {
  const baseHref = categoryUrlKey
    ? buildJewelleryCategoryHref(categoryUrlKey)
    : "/jewellery";

  const params = new URLSearchParams();

  if (minPrice > 0) {
    params.set("minPrice", String(minPrice));
  }

  if (maxPrice > 0) {
    params.set("maxPrice", String(maxPrice));
  }

  const shapeSlug = slugifyDiamondShapeLabel(diamondShapeLabel);
  if (shapeSlug) {
    params.set("diamondShape", shapeSlug);
  }

  const query = params.toString();
  return query ? `${baseHref}?${query}` : baseHref;
}
