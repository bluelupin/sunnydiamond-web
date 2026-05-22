import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { getProductById, products } from "@/features/products/data/products";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { buildProductJsonLd } from "@/shared/lib/seo/schema/product";
import ProductDetailPageView from "@/features/products/components/ProductDetailPage";

type Params = {
  id: string;
};

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const product = getProductById(params.id);

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
    image: typeof product.image === "string" ? product.image : product.image.src,
    canonicalPath: `/product/${params.id}`,
  });
}

export default function ProductPage({ params }: { params: Params }) {
  const product = getProductById(params.id);

  return (
    <>
      {product ? <JsonLd data={buildProductJsonLd(product)} id={`product-jsonld-${product.id}`} /> : null}
      <ProductDetailPageView />
    </>
  );
}
