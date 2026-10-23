import JewelleryListingPageSkeleton from "@/features/jewellery-product/components/skeletons/JewelleryListingPageSkeleton";
import SiteRouteLoadingFallback from "@/shared/ui/layout/SiteRouteLoadingFallback";

export default function Loading() {
  return (
    <SiteRouteLoadingFallback>
      <JewelleryListingPageSkeleton />
    </SiteRouteLoadingFallback>
  );
}
