import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import type { Product } from "@/features/products/data/products";

interface CartItemProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const CartItem = ({
  product,
  quantity,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  return (
    <article className="flex gap-4 pb-6 border-b border-border">
      <Link
        href={`/product/${product.id}`}
        className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-secondary rounded-sm overflow-hidden"
      >
        <OptimizedImage src={product.image} alt={product.name} />
      </Link>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/product/${product.id}`}
            className="font-heading text-base font-medium text-foreground hover:text-primary transition-colors"
          >
            {product.name}
          </Link>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            {product.metal} · {product.carat}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-border">
            <button
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="px-3 font-body text-sm" aria-label="Product quantity">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-body text-sm font-semibold">
              ${(product.price * quantity).toLocaleString()}
            </span>
            <button
              onClick={() => onRemove(product.id)}
              className="text-muted-foreground hover:text-destructive transition-colors"
              aria-label={`Remove ${product.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
