import AboutPageSkeleton from "@/features/about/components/skeletons/AboutPageSkeleton";
import SiteRouteLoadingFallback from "@/shared/ui/layout/SiteRouteLoadingFallback";

export default function WorldOfSunnyLoading() {
  return (
    <SiteRouteLoadingFallback>
      <AboutPageSkeleton />
    </SiteRouteLoadingFallback>
  );
}
