import HomePageRouteSkeleton from "@/features/cms/components/skeletons/HomePageRouteSkeleton";
import PageLoadingMarker from "@/shared/ui/layout/PageLoadingMarker";

export default function HomeLoading() {
  return (
    <>
      <PageLoadingMarker />
      <HomePageRouteSkeleton />
    </>
  );
}
