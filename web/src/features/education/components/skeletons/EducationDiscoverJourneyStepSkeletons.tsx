import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/utils/cn";

const GRID_TILE_COUNT = 12;

function DiscoverJourneyGridTileSkeleton({ labelWidthClass }: { labelWidthClass: string }) {
  return (
    <div className="flex flex-col items-center gap-2" aria-hidden>
      <Skeleton className="size-6 shrink-0 rounded-none bg-gray200" />
      <Skeleton className={cn("h-4 rounded-md bg-gray200", labelWidthClass)} />
    </div>
  );
}

export function EducationDiscoverJourneyStep1PriceSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading price range"
      className="flex flex-col gap-6"
    >
      <Skeleton className="h-[12px] w-full rounded-[70px] bg-gray200" aria-hidden />
      <div className="flex items-center gap-3">
        <Skeleton className="h-14 min-w-0 flex-1 rounded-none bg-gray200" aria-hidden />
        <span className="sr-only">to</span>
        <Skeleton className="h-14 min-w-0 flex-1 rounded-none bg-gray200" aria-hidden />
      </div>
    </section>
  );
}

export function EducationDiscoverJourneyStep2CategorySkeleton() {
  const labelWidths = ["w-10", "w-12", "w-14", "w-11"];

  return (
    <section
      aria-busy="true"
      aria-label="Loading jewellery types"
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-4 gap-x-3 gap-y-6">
        {Array.from({ length: GRID_TILE_COUNT }, (_, index) => (
          <DiscoverJourneyGridTileSkeleton
            key={`category-skeleton-${index}`}
            labelWidthClass={labelWidths[index % labelWidths.length] ?? "w-12"}
          />
        ))}
      </div>
    </section>
  );
}

export function EducationDiscoverJourneyStep3ShapeSkeleton() {
  const labelWidths = ["w-14", "w-16", "w-12", "w-[4.5rem]"];

  return (
    <section
      aria-busy="true"
      aria-label="Loading diamond shapes"
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-4 gap-x-3 gap-y-6">
        {Array.from({ length: GRID_TILE_COUNT }, (_, index) => (
          <DiscoverJourneyGridTileSkeleton
            key={`shape-skeleton-${index}`}
            labelWidthClass={labelWidths[index % labelWidths.length] ?? "w-14"}
          />
        ))}
      </div>
    </section>
  );
}
