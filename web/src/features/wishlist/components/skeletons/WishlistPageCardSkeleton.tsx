import { cn } from "@/shared/utils/cn";

const pulse = "animate-pulse bg-gray300";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn(pulse, className)} aria-hidden />;
}

/** Matches default `WishlistCard` layout on the wishlist page. */
export function WishlistPageCardSkeleton() {
  return (
    <article
      className="relative grid grid-cols-1 grid-rows-1 gap-4 overflow-hidden px-4 py-6 md:gap-6 md:px-6 md:py-10"
      aria-hidden
    >
      <SkeletonBlock className="absolute right-2 top-2 size-6 md:hidden" />
      <SkeletonBlock className="mx-auto h-[110px] w-[110px] sm:h-[240px] sm:w-[240px] md:h-[240px] md:w-[240px] lg:h-[303px] lg:w-[303px]" />
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 md:gap-3">
          <SkeletonBlock className="h-4 w-32 max-w-full md:h-5 md:w-40" />
          <SkeletonBlock className="h-4 w-20 md:h-5 md:w-24" />
        </div>
        <div className="flex items-center justify-center gap-6">
          <SkeletonBlock className="h-4 w-24 md:h-5 md:w-28" />
          <SkeletonBlock className="hidden h-4 w-16 md:block md:h-5 md:w-20" />
        </div>
      </div>
    </article>
  );
}
