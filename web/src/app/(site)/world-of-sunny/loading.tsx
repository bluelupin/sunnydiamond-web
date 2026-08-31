import AboutPageSkeleton from "@/features/about/components/skeletons/AboutPageSkeleton";
import PageLoadingMarker from "@/shared/ui/layout/PageLoadingMarker";

export default function WorldOfSunnyLoading() {
  return (
    <>
      <PageLoadingMarker />
      <AboutPageSkeleton />
    </>
  );
}
