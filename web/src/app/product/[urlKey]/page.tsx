import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import {
  fetchMagentoProductDetailPage,
  getMagentoProductByUrlKey,
} from "@/services/magento/products/productDetail.service";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { buildProductJsonLd } from "@/shared/lib/seo/schema/product";
import ProductDetailPageView from "@/features/products/components/ProductDetailPage";
import ProductDetailBelowFoldLazy from "@/features/products/components/ProductDetailBelowFoldLazy";
import { getProductDetailContent } from "@/features/products/data/productDetailContent";
import { prefetchProductDetailAlankaraCollection } from "@/features/products/services/prefetchProductDetailAlankara";
import { resolveImageSrcString } from "@/shared/utils/image";
import { getProductDisplayVisitUs } from "@/services/product-display/product-display-page.service";
import { getSizeGuideForProduct } from "@/services/size-guide/size-guide.service";

/** Matches MAGENTO_CATALOG_REVALIDATE_SECONDS default (segment config must be a literal). */
export const revalidate = 3600;

type PageParams = {
  urlKey: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { urlKey } = await params;
  const product = await getMagentoProductByUrlKey(decodeURIComponent(urlKey));

  if (!product) {
    return constructMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: product.seo.title,
    description: product.seo.description,
    keywords: product.seo.keywords,
    image: resolveImageSrcString(product.image),
    url: product.seo.canonicalUrl,
    canonicalPath: product.seo.canonicalUrl ? undefined : product.seo.canonicalPath,
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { urlKey } = await params;
  const decodedUrlKey = decodeURIComponent(urlKey);
  const [detailPage, visitUs, alankaraPrefetch] = await Promise.all([
    fetchMagentoProductDetailPage(decodedUrlKey),
    getProductDisplayVisitUs(),
    prefetchProductDetailAlankaraCollection(),
  ]);

  if (!detailPage) {
    notFound();
  }

  const { product, moreForYou } = detailPage;
  const content = getProductDetailContent(product);
  const sizeGuide = await getSizeGuideForProduct(product);

  return (
    <>
      <JsonLd data={buildProductJsonLd(product)} id={`product-jsonld-${product.id}`} />
      <ProductDetailPageView product={product} sizeGuide={sizeGuide} />
      <ProductDetailBelowFoldLazy
        heroBannerImage={content.heroBannerImage}
        heroBannerVideo={content.heroBannerVideo}
        productName={product.name}
        moreForYou={moreForYou}
        visitUs={visitUs}
        alankaraPrefetch={alankaraPrefetch}
      />
    </>
  );
}
