import HomePageRouteSkeleton from "@/features/cms/components/skeletons/HomePageRouteSkeleton";
import SiteRouteLoadingFallback from "@/shared/ui/layout/SiteRouteLoadingFallback";

export default function HomeLoading() {
  return (
    <SiteRouteLoadingFallback>
      <HomePageRouteSkeleton />
    </SiteRouteLoadingFallback>
  );
}
