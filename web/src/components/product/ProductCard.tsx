import Link from "next/link";
import OptimizedImage from "@/components/shared/OptimizedImage";
import type { Product } from "@/data/products";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block animate-fade-in"
    >
      <div className="aspect-square overflow-hidden bg-secondary rounded-sm mb-3">
        <OptimizedImage
          src={product.image}
          alt={`${product.name} — ${product.shortDescription}`}
          className="group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="space-y-1">
        <p className="text-xs tracking-widest uppercase text-muted-foreground font-body">
          {product.category}
        </p>
        <h3 className="font-heading text-base md:text-lg font-medium text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-body text-sm font-semibold text-foreground">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="font-body text-sm text-muted-foreground line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
