import type { MagentoProduct } from "../types";
import type { Product } from "@/features/products/data/products";

export function transformMagentoProduct(magentoProduct: MagentoProduct): Product {
  const minPrice = magentoProduct.price_range.minimum_price;
  
  return {
    id: String(magentoProduct.id || magentoProduct.uid),
    name: magentoProduct.name,
    price: minPrice.final_price.value,
    originalPrice: minPrice.regular_price.value !== minPrice.final_price.value 
      ? minPrice.regular_price.value 
      : undefined,
    description: magentoProduct.description?.html || "",
    shortDescription: magentoProduct.short_description?.html || "",
    category: magentoProduct.categories?.[0]?.name || "Jewellery",
    image: magentoProduct.image?.url || "/placeholder-product.jpg",
    images: magentoProduct.media_gallery?.map(img => img.url) || [magentoProduct.image?.url || "/placeholder-product.jpg"],
    carat: magentoProduct.carat || "1.0 ct",
    metal: magentoProduct.metal || "18K Gold",
    inStock: magentoProduct.stock_status === "IN_STOCK",
    featured: (magentoProduct as any).featured || false,
    rating: magentoProduct.rating_summary ? (magentoProduct.rating_summary / 20) : 5.0, // Convert 0-100 score to 0-5 stars
    reviews: magentoProduct.reviews_count || 0,
  };
}
