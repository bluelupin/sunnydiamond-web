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
import { getImageSrc } from "@/shared/utils/image";
import { getProductDisplayVisitUs } from "@/services/product-display/product-display-page.service";

export const dynamic = "force-dynamic";

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
    image: getImageSrc(product.image),
    url: product.seo.canonicalUrl,
    canonicalPath: product.seo.canonicalUrl ? undefined : product.seo.canonicalPath,
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { urlKey } = await params;
  const decodedUrlKey = decodeURIComponent(urlKey);
  const [detailPage, visitUs] = await Promise.all([
    fetchMagentoProductDetailPage(decodedUrlKey),
    getProductDisplayVisitUs(),
  ]);

  if (!detailPage) {
    notFound();
  }

  const { product, moreForYou } = detailPage;

  return (
    <>
      <JsonLd data={buildProductJsonLd(product)} id={`product-jsonld-${product.id}`} />
      <ProductDetailPageView product={product} moreForYou={moreForYou} visitUs={visitUs} />
    </>
  );
}
