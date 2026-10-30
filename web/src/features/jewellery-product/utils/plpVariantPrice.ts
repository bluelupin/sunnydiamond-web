import type { JewelleryListingProduct } from "../types";

function metalKey(value: string): string {
  return value.trim().toLowerCase().replace(/[_\s]+/g, "-");
}

function purityKey(value: string): string {
  const compact = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
  const karat = compact.match(/(\d+)k/);
  return karat ? `${karat[1]}k` : compact;
}

/** Use the same color-then-purity preference as the PDP URL selection. */
export function getJewelleryListingDisplayPrice(
  product: JewelleryListingProduct,
  metalTypeQuery?: string,
  metalPurityQuery?: string,
): number {
  const variants = product.variantPrices;
  if (!variants?.length || (!metalTypeQuery && !metalPurityQuery)) return product.price;

  const colors = metalTypeQuery?.split(",").map((value) => value.trim()).filter(Boolean) ?? [];
  const purities = metalPurityQuery?.split(",").map((value) => purityKey(value)).filter(Boolean) ?? [];
  const matchesPurity = (variant: (typeof variants)[number]) =>
    purities.length === 0 ||
    (variant.metalPurity != null && purities.includes(purityKey(variant.metalPurity)));

  const chosenOption = colors
    .map((color) => product.metalColorOptions?.find((option) =>
      metalKey(option.id) === metalKey(color) || metalKey(option.label) === metalKey(color),
    ))
    .find((option) => option != null);
  const selectedColor = chosenOption?.id ?? colors.find((color) =>
    variants.some((variant) => metalKey(variant.metalColor) === metalKey(color)),
  );

  if (selectedColor) {
    const matchingColor = variants.filter((variant) =>
      metalKey(variant.metalColor) === metalKey(selectedColor),
    );
    const selected = matchingColor.find(matchesPurity) ?? matchingColor[0];
    if (selected) return selected.price;
  }

  return purities.length > 0
    ? variants.find(matchesPurity)?.price ?? product.price
    : product.price;
}
