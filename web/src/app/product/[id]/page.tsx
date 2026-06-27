import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { getProductById, products } from "@/features/products/data/products";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { buildProductJsonLd } from "@/shared/lib/seo/schema/product";
import ProductDetailPageView from "@/features/products/components/ProductDetailPage";

type PageParams = {
  id: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

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
    canonicalPath: `/product/${id}`,
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  return (
    <>
      {product ? <JsonLd data={buildProductJsonLd(product)} id={`product-jsonld-${product.id}`} /> : null}
      <ProductDetailPageView />
    </>
  );
}
