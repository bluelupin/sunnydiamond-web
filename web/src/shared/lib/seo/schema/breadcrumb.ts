import { buildJewelleryCategoryHref } from "@/features/jewellery-product/utils/jewelleryRoutes";
import { getAbsoluteUrl } from "@/shared/lib/seo/siteConfig";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path),
    })),
  };
}

export function buildJewelleryListingBreadcrumbJsonLd(options?: {
  categoryLabel?: string | null;
  categoryUrlKey?: string | null;
}) {
  const items: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "Jewellery", path: "/jewellery" },
  ];

  const categoryLabel = options?.categoryLabel?.trim();
  const categoryUrlKey = options?.categoryUrlKey?.trim();

  if (categoryLabel && categoryUrlKey) {
    items.push({
      name: categoryLabel,
      path: buildJewelleryCategoryHref(categoryUrlKey),
    });
  }

  return buildBreadcrumbJsonLd(items);
}

export function buildProductBreadcrumbJsonLd(product: {
  name: string;
  urlKey: string;
  category?: string;
  categoryUrlKey?: string;
}) {
  const items: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "Jewellery", path: "/jewellery" },
  ];

  if (product.categoryUrlKey && product.category) {
    items.push({
      name: product.category,
      path: buildJewelleryCategoryHref(product.categoryUrlKey),
    });
  }

  items.push({
    name: product.name,
    path: `/product/${product.urlKey}`,
  });

  return buildBreadcrumbJsonLd(items);
}
