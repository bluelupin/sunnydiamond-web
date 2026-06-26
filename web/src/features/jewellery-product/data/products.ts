import { products } from "@/features/products/data/products";
import {
  jewelleryPlpModalImages,
  jewelleryPlpTransparentImages,
} from "./plpAssets";
import type { JewelleryListingProduct } from "../types";

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

    return {
      id: `${product.id}-${duplicateIndex}`,
      name: displayNames[assetIndex % displayNames.length],
      price: 9880 + index * 1200 + duplicateIndex * 500,
      primaryImage: jewelleryPlpTransparentImages[assetIndex % jewelleryPlpTransparentImages.length],
      modalImage,
      hoverImage: modalImage,
      category: product.category,
      isBestseller: index === 0 && duplicateIndex === 0,
    };
  }),
);
