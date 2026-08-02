import ProductDetailPageSkeleton from "@/features/products/components/skeletons/ProductDetailPageSkeleton";
import PageLoadingMarker from "@/shared/ui/layout/PageLoadingMarker";

export default function ProductLoading() {
  return (
    <>
      <PageLoadingMarker />
      <ProductDetailPageSkeleton />
    </>
  );
}
