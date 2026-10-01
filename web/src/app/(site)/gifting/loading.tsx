import SiteRouteLoadingFallback from "@/shared/ui/layout/SiteRouteLoadingFallback";

export default function GiftingLoading() {
  return (
    <SiteRouteLoadingFallback>
      <div className="min-h-[40vh] bg-gray200" aria-hidden />
    </SiteRouteLoadingFallback>
  );
}
