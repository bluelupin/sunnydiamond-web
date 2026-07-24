import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import {
  buildJewelleryListingJsonLd,
  resolveJewelleryCategorySeoMetadata,
  resolveJewellerySeoMetadata,
} from "@/shared/lib/seo/jewellerySeo";
import { getProductLandingPage } from "@/services/product-landing/product-landing-page.service";
import { getMagentoJewelleryNavCategories } from "@/services/magento/categories/categories.service";
import { prefetchJewelleryListing } from "@/lib/magento/prefetchMagento";
import JewelleryProductPage from "@/features/jewellery-product/components/JewelleryProductPage";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { resolveImageSrcString } from "@/shared/utils/image";

type PageProps = {
  params: Promise<{ categoryUrl: string }>;
  searchParams: Promise<{ occasion?: string; category?: string }>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const [{ categoryUrl }, query] = await Promise.all([params, searchParams]);
  const categoryUrlKey = decodeURIComponent(categoryUrl);
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
    noIndex: Boolean(query.occasion || query.category),
  });
}

export default async function Page({ params, searchParams }: PageProps) {
  const [{ categoryUrl }, query] = await Promise.all([params, searchParams]);
  const categoryUrlKey = decodeURIComponent(categoryUrl);
  const [initialListing, page, nav] = await Promise.all([
    query.occasion ? Promise.resolve(undefined) : prefetchJewelleryListing(categoryUrlKey),
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
