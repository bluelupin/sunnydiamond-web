import CheckoutPageSkeleton from "@/features/checkout/components/skeletons/CheckoutPageSkeleton";
import PageLoadingMarker from "@/shared/ui/layout/PageLoadingMarker";

export default function Loading() {
  return (
    <>
      <PageLoadingMarker />
      <CheckoutPageSkeleton />
    </>
  );
}
