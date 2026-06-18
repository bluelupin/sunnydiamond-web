import { products } from "@/features/products/data/products";
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
    const hoverSource = products[(index + duplicateIndex + 1) % products.length];

    return {
      id: `${product.id}-${duplicateIndex}`,
      name: displayNames[(index + duplicateIndex) % displayNames.length],
      price: 9880 + index * 1200 + duplicateIndex * 500,
      primaryImage: product.image,
      hoverImage: hoverSource.image,
      category: product.category,
      isBestseller: index === 1 && duplicateIndex === 0,
    };
  }),
);
