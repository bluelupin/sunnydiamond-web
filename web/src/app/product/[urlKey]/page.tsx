import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { getMagentoProductByUrlKey } from "@/services/magento/products/productDetail.service";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { buildProductJsonLd } from "@/shared/lib/seo/schema/product";
import ProductDetailPageView from "@/features/products/components/ProductDetailPage";
import { getImageSrc } from "@/shared/utils/image";

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
    title: product.name,
    description: product.shortDescription,
    image: getImageSrc(product.image),
    canonicalPath: `/product/${product.urlKey}`,
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { urlKey } = await params;
  const product = await getMagentoProductByUrlKey(decodeURIComponent(urlKey));

  if (!product) {
    notFound();
  }

  return (
    <>
      <JsonLd data={buildProductJsonLd(product)} id={`product-jsonld-${product.id}`} />
      <ProductDetailPageView product={product} />
    </>
  );
}
