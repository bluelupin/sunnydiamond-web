import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import {
  buildJewelleryListingJsonLd,
  resolveJewelleryCategorySeoMetadata,
} from "@/shared/lib/seo/jewellerySeo";
import { buildJewelleryListingBreadcrumbJsonLd } from "@/shared/lib/seo/schema/breadcrumb";
import { getProductLandingPage } from "@/services/product-landing/product-landing-page.service";
import { getMagentoJewelleryNavCategories } from "@/services/magento/categories/categories.service";
import { prefetchJewelleryListing } from "@/lib/magento/prefetchMagento";
import JewelleryProductPage from "@/features/jewellery-product/components/JewelleryProductPage";
import {
  isJewelleryCategoryUrlKey,
} from "@/features/jewellery-product/utils/jewelleryRoutes";
import { hasGiftFinderSearchParams } from "@/features/gifting/utils/giftFinderRoutes";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { resolveImageSrcString } from "@/shared/utils/image";

type JewelleryCategoryRoutePageProps = {
  params: Promise<{ categoryUrl: string }>;
  searchParams: Promise<{
    occasion?: string;
    diamondShape?: string;
    fancyColour?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

export async function generateJewelleryCategoryMetadata({
  params,
  searchParams,
}: JewelleryCategoryRoutePageProps): Promise<Metadata> {
  const [{ categoryUrl }, query] = await Promise.all([params, searchParams]);
  const categoryUrlKey = decodeURIComponent(categoryUrl);

  if (!isJewelleryCategoryUrlKey(categoryUrlKey)) {
    return constructMetadata({ title: "Not Found", noIndex: true });
  }

  const page = await getProductLandingPage();
  const nav = await getMagentoJewelleryNavCategories();
  const category = nav.categories.find((item) => item.urlKey === categoryUrlKey);
  const { title, description, canonicalPath, keywords, image } =
    resolveJewelleryCategorySeoMetadata(page, categoryUrlKey, category?.label);

  return constructMetadata({
    title,
    description,
    canonicalPath,
    keywords,
    ...(image ? { image } : {}),
    noIndex: hasGiftFinderSearchParams(query) || Boolean(query.category),
  });
}

export async function JewelleryCategoryRoutePage({
  params,
  searchParams,
}: JewelleryCategoryRoutePageProps) {
  const [{ categoryUrl }, query] = await Promise.all([params, searchParams]);
  const categoryUrlKey = decodeURIComponent(categoryUrl);

  if (!isJewelleryCategoryUrlKey(categoryUrlKey)) {
    notFound();
  }

  const [initialListing, page, nav] = await Promise.all([
    hasGiftFinderSearchParams(query)
      ? Promise.resolve(undefined)
      : prefetchJewelleryListing(categoryUrlKey),
    getProductLandingPage(),
    getMagentoJewelleryNavCategories(),
  ]);

  const category = nav.categories.find((item) => item.urlKey === categoryUrlKey);
  const seo = resolveJewelleryCategorySeoMetadata(page, categoryUrlKey, category?.label);

  const jsonLdProducts =
    initialListing?.products.map((product) => ({
      name: product.name,
      urlKey: product.urlKey,
      image: resolveImageSrcString(product.primaryImage),
    })) ?? [];

  return (
    <>
      <JsonLd
        data={buildJewelleryListingBreadcrumbJsonLd({
          categoryLabel: category?.label ?? seo.title,
          categoryUrlKey,
        })}
        id={`jewellery-category-breadcrumb-jsonld-${categoryUrlKey}`}
      />
      <JsonLd
        data={buildJewelleryListingJsonLd({
          name: seo.title,
          description: seo.description,
          canonicalPath: seo.canonicalPath,
          products: jsonLdProducts,
        })}
        id={`jewellery-category-jsonld-${categoryUrlKey}`}
      />
      <Suspense fallback={null}>
        <JewelleryProductPage
          initialListing={initialListing}
          prefetchedCategoryUrlKey={initialListing ? categoryUrlKey : undefined}
        />
      </Suspense>
    </>
  );
}
