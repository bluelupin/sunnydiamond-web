"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/shared/PageHead";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { getProductById } from "@/data/products";
import { siteConfig } from "@/data/siteConfig";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Star, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProductDetailPage = () => {
  const params = useParams() as { id?: string | string[] };
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = getProductById(id || "");
  const { addItem } = useCart();
  const { toast } = useToast();

  if (!product) {
    return (
      <Layout>
        <PageHead title="Product Not Found" description="The requested product could not be found." />
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl text-foreground">Product not found</h1>
          <Link href="/products" className="text-primary underline mt-4 inline-block font-body text-sm">
            Back to Collections
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    toast({ title: "Added to cart", description: `${product.name} has been added to your bag.` });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: { "@type": "Brand", name: siteConfig.brand.name },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  };

  return (
    <Layout>
      <PageHead
        title={product.name}
        description={product.shortDescription}
        canonicalPath={`/product/${product.id}`}
        jsonLd={jsonLd}
      />

      <article className="container py-6 md:py-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-body mb-6 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Collections
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="aspect-square overflow-hidden bg-secondary rounded-sm">
            <OptimizedImage
              src={product.image}
              alt={`${product.name} - ${product.shortDescription}`}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <header>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">
                {product.category}
              </p>
              <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
                {product.name}
              </h1>
            </header>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-primary">
                <Star size={14} fill="currentColor" />
                <span className="font-body text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground font-body">
                ({product.reviews} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-heading text-2xl font-semibold text-foreground">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="font-body text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="font-body text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <dl className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border">
              <div>
                <dt className="font-body text-xs tracking-widest uppercase text-muted-foreground">
                  Carat
                </dt>
                <dd className="font-body text-sm font-medium text-foreground mt-1">
                  {product.carat}
                </dd>
              </div>
              <div>
                <dt className="font-body text-xs tracking-widest uppercase text-muted-foreground">
                  Metal
                </dt>
                <dd className="font-body text-sm font-medium text-foreground mt-1">
                  {product.metal}
                </dd>
              </div>
            </dl>

            <PrimaryButton onClick={handleAddToCart} className="w-full py-4">
              <ShoppingBag size={18} /> Add to Bag
            </PrimaryButton>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default ProductDetailPage;
