import { cn } from "@/shared/utils/cn";

const pulse = "animate-pulse bg-gray200";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn(pulse, className)} aria-hidden />;
}

function SkeletonCartItem() {
  return (
    <article className="relative flex flex-col gap-4 bg-white px-4 py-6 lg:gap-6 lg:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 gap-4 lg:max-w-[499.5px] lg:gap-6">
          <SkeletonBlock className="size-[68px] shrink-0 lg:size-[140px]" />
          <div className="flex min-w-0 flex-1 flex-col items-start gap-8 lg:w-[176px] lg:max-w-[176px]">
            <div className="flex w-full flex-col items-start gap-3">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-5 w-20" />
            </div>
            <div className="flex items-start gap-4">
              <SkeletonBlock className="h-4 w-10" />
              <SkeletonBlock className="h-4 w-24" />
            </div>
          </div>
        </div>
        <SkeletonBlock className="size-6 shrink-0" />
      </div>
      <div className="flex flex-col gap-4 border-t border-neutral300 pt-4 lg:gap-6 lg:pt-6">
        <SkeletonBlock className="h-4 w-36" />
        <SkeletonBlock className="h-4 w-48" />
      </div>
    </article>
  );
}

function SkeletonCartPriceDetails() {
  return (
    <div className="flex flex-col gap-6 bg-white p-6">
      <div className="flex flex-col gap-4">
        <SkeletonBlock className="h-7 w-36" />
        <div className="h-px w-full bg-neutral300" aria-hidden />
        <div className="flex flex-col gap-3">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-3/4" />
          <SkeletonBlock className="h-5 w-1/2" />
        </div>
      </div>
      <SkeletonBlock className="h-12 w-full" />
      <div className="flex flex-col gap-4 border-t border-neutral300 pt-6">
        <SkeletonBlock className="h-14 w-full" />
        <SkeletonBlock className="h-14 w-full" />
      </div>
    </div>
  );
}

function SkeletonBenefitsSection() {
  return (
    <section className="mt-0 flex flex-col gap-6 md:max-lg:mt-8 lg:mt-10" aria-hidden>
      <div className="flex w-full items-center justify-between">
        <SkeletonBlock className="h-7 w-48 lg:h-8 lg:w-56" />
        <SkeletonBlock className="h-4 w-20" />
      </div>
      <div className="flex flex-col gap-4 p-4 md:max-lg:landscape:flex-row md:max-lg:landscape:items-center md:max-lg:landscape:justify-center md:max-lg:bg-gray200 md:max-lg:landscape:p-6 lg:flex-row lg:items-center lg:justify-center lg:bg-gray200 lg:p-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex h-[98px] w-full flex-col items-center justify-center gap-2 md:max-lg:landscape:h-136 md:max-lg:landscape:flex-1 lg:h-136 lg:flex-1"
          >
            <SkeletonBlock className="size-10" />
            <SkeletonBlock className="h-4 w-20" />
          </div>
        ))}
      </div>
    </section>
  );
}

function SkeletonMobileStickyFooter() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden" aria-hidden>
      <div className="pointer-events-none h-[71px] w-full bg-gradient-to-b from-transparent to-white" />
      <aside className="flex flex-col border-t border-neutral300 bg-white pb-[env(safe-area-inset-bottom,0px)]">
        <div className="border-b border-neutral300 px-4 py-3">
          <SkeletonBlock className="h-5 w-36" />
        </div>
        <div className="flex flex-col gap-4 px-4 py-6">
          <div className="flex items-end justify-between gap-4">
            <SkeletonBlock className="h-7 w-28" />
            <SkeletonBlock className="h-4 w-32" />
          </div>
          <SkeletonBlock className="h-14 w-full" />
        </div>
      </aside>
    </div>
  );
}

const CartPageSkeleton = () => {
  return (
    <>
      <section
        className={cn(
          "bg-gray300 lg:pb-16",
          "md:max-lg:-mt-2 md:max-lg:landscape:mt-0",
          "md:max-lg:pb-16",
        )}
        aria-busy="true"
        aria-label="Loading shopping bag"
      >
        <p className="sr-only" aria-live="polite">
          Loading your shopping bag
        </p>

        <div className="mx-auto w-full px-5 max-md:pt-4 pt-6 md:max-lg:px-8 md:max-lg:landscape:pt-0 lg:px-10 2xl:max-w-1920 2xl:px-[60px]">
          <SkeletonBlock className="mb-6 h-9 w-56 lg:mb-10 lg:h-10 lg:w-64" />

          <div
            className={cn(
              "grid grid-cols-1 gap-6 md:max-lg:portrait:grid-cols-[minmax(0,1fr)_minmax(0,360px)] md:max-lg:landscape:grid-cols-2 md:max-lg:items-start lg:grid-cols-[minmax(0,783fr)_minmax(0,553fr)] lg:gap-6",
            )}
          >
            <div className="flex min-w-0 flex-col gap-6">
              <SkeletonCartItem />
              <SkeletonCartItem />

              <div className="pt-4 md:hidden">
                <SkeletonBenefitsSection />
              </div>

              <div className="h-[220px] md:hidden" aria-hidden />
            </div>

            <aside className="hidden h-fit w-full min-w-0 flex-col gap-0 md:max-lg:sticky md:max-lg:top-12 md:max-lg:flex lg:sticky lg:top-12 lg:flex">
              <SkeletonCartPriceDetails />
              <SkeletonBenefitsSection />
            </aside>
          </div>
        </div>
      </section>

      <SkeletonMobileStickyFooter />
    </>
  );
};

export default CartPageSkeleton;
