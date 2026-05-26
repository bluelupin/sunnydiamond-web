export const STRAPI_ENDPOINTS = {
  homepage: "homepage",
  products: "products",
  categories: "categories",
  global: "global",
  navigation: "navigation",
  footer: "footer",
  productById: (id: string | number) => `products/${id}`,
  productBySlug: (slug: string) => `products?filters[slug][$eq]=${encodeURIComponent(slug)}`,
  categoryBySlug: (slug: string) => `categories?filters[slug][$eq]=${encodeURIComponent(slug)}`,
};
