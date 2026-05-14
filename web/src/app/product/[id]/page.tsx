import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo/metadata";
import { getProductById, products } from "@/data/products";
import { getImageSrc } from "@/lib/utils/image";
import ProductDetailPageView from "@/components/site-pages/ProductDetailPage";

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
    image: getImageSrc(product.image),
  });
}

export default function ProductPage() {
  return <ProductDetailPageView />;
}
