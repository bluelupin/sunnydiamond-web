import CartPageSkeleton from "@/features/cart/components/skeletons/CartPageSkeleton";
import PageLoadingMarker from "@/shared/ui/layout/PageLoadingMarker";

export default function CartLoading() {
  return (
    <>
      <PageLoadingMarker />
      <CartPageSkeleton />
    </>
  );
}
