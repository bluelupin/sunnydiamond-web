import { products } from "@/features/products/data/products";
import {
  jewelleryPlpModalImages,
  jewelleryPlpTransparentImages,
} from "./plpAssets";
import type { JewelleryListingProduct } from "../types";

/** Temporary preview — Magento CDN product image for listing layout check */
const MAGENTO_LISTING_PREVIEW_IMAGE =
  "https://static.sunnydiamonds.com/images/products/2140825807500/F_2140825807500_ROSE-GOLD_04%3A38%3A31%3A774904.jpg";

const displayNames = [
  "Alankara Diamond Necklace",
  "Celestial Solitaire Ring",
  "Étoile Diamond Studs",
  "Rivière Tennis Bracelet",
  "Aurora Halo Ring",
  "Lumière Pendant Necklace",
];

export const jewelleryListingProducts: JewelleryListingProduct[] = products.flatMap((product, index) =>
  Array.from({ length: 2 }, (_, duplicateIndex) => {
    const assetIndex = index + duplicateIndex;
    const modalImage = jewelleryPlpModalImages[assetIndex % jewelleryPlpModalImages.length];

    const metalLower = product.metal.toLowerCase();
    const isPreviewCard = index === 0 && duplicateIndex === 0;
    const primaryImage = isPreviewCard
      ? MAGENTO_LISTING_PREVIEW_IMAGE
      : jewelleryPlpTransparentImages[assetIndex % jewelleryPlpTransparentImages.length];
    const lifestyleImage = isPreviewCard
      ? MAGENTO_LISTING_PREVIEW_IMAGE
      : modalImage;

    return {
      id: `${product.id}-${duplicateIndex}`,
      sku: `${product.id}-${duplicateIndex}`,
      urlKey: `${product.id}-${duplicateIndex}`,
      name: isPreviewCard ? "Rose Gold Infinity Bangle" : displayNames[assetIndex % displayNames.length],
      price: 9880 + index * 1200 + duplicateIndex * 500,
      primaryImage,
      modalImage: lifestyleImage,
      hoverImage: lifestyleImage,
      category: product.category,
      metalType: metalLower.includes("silver") ? "Silver" : "Gold",
      metalPurity: metalLower.includes("22k") ? "22k" : "18k",
      gemstoneType: "diamond",
      isBestseller: index === 0 && duplicateIndex === 0,
    };
  }),
);
