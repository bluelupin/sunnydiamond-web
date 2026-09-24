import { ShowroomsLayoutSkeleton } from "../ShowroomsLayoutSkeleton";

const StoreLocatorPageSkeleton = () => (
  <div aria-busy="true" aria-label="Loading store locator page">
    <section className="relative left-1/2 h-[240px] w-screen max-w-none -translate-x-1/2 overflow-hidden md:h-320">
      <div className="absolute inset-0 animate-pulse bg-gray200" aria-hidden />
      <div className="absolute bottom-10 left-1/2 z-10 h-10 w-48 -translate-x-1/2 animate-pulse rounded bg-white/30 md:bottom-16" aria-hidden />
    </section>

    <section className="px-4 py-6 md:border-b md:border-neutral300 md:px-0 md:py-10">
      <div className="mx-auto flex w-full max-w-[676px] flex-col gap-6">
        <div className="h-14 w-full animate-pulse bg-gray200" aria-hidden />
        <div className="flex h-14 items-center gap-4 overflow-hidden md:h-auto md:gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-14 w-[86px] shrink-0 animate-pulse bg-gray200 md:h-20" aria-hidden />
          ))}
        </div>
      </div>
    </section>

    <ShowroomsLayoutSkeleton />
  </div>
);

export default StoreLocatorPageSkeleton;
