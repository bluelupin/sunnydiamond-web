import type { ReactNode } from "react";
import GlobalRouteLoader from "@/shared/ui/layout/GlobalRouteLoader";
import PageLoadingMarker from "@/shared/ui/layout/PageLoadingMarker";

type SiteRouteLoadingFallbackProps = {
  children?: ReactNode;
};

export default function SiteRouteLoadingFallback({
  children,
}: SiteRouteLoadingFallbackProps) {
  return (
    <>
      <PageLoadingMarker />
      <GlobalRouteLoader />
      {children}
    </>
  );
}
