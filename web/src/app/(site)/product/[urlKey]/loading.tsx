import ProductDetailPageSkeleton from "@/features/products/components/skeletons/ProductDetailPageSkeleton";
import SiteRouteLoadingFallback from "@/shared/ui/layout/SiteRouteLoadingFallback";

export default function ProductLoading() {
  return (
    <SiteRouteLoadingFallback>
      <ProductDetailPageSkeleton />
    </SiteRouteLoadingFallback>
  );
}
