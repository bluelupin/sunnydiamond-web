import CheckoutPageSkeleton from "@/features/checkout/components/skeletons/CheckoutPageSkeleton";
import SiteRouteLoadingFallback from "@/shared/ui/layout/SiteRouteLoadingFallback";

export default function Loading() {
  return (
    <SiteRouteLoadingFallback>
      <CheckoutPageSkeleton />
    </SiteRouteLoadingFallback>
  );
}
