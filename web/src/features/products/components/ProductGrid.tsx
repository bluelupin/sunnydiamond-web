import ProductCard from "@/features/products/components/ProductCard";
import type { Product } from "@/features/products/data/products";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

const colsMap = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const;

const ProductGrid = ({ products, columns = 3 }: ProductGridProps) => {
  return (
    <div className={`grid ${colsMap[columns]} gap-[8px]`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
