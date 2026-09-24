import JewelleryListingPageSkeleton from "@/features/jewellery-product/components/skeletons/JewelleryListingPageSkeleton";
import PageLoadingMarker from "@/shared/ui/layout/PageLoadingMarker";

export default function Loading() {
  return (
    <>
      <PageLoadingMarker />
      <JewelleryListingPageSkeleton />
    </>
  );
}
