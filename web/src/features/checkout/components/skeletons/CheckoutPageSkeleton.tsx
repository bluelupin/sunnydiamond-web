import { cn } from "@/shared/utils/cn";

const pulse = "animate-pulse bg-gray200";

function SkeletonBlock({
  className,
  "aria-hidden": ariaHidden = true,
}: {
  className?: string;
  "aria-hidden"?: boolean;
}) {
  return <div className={cn(pulse, className)} aria-hidden={ariaHidden} />;
}

function SkeletonField() {
  return (
    <div className="flex flex-col gap-2">
      <SkeletonBlock className="h-5 w-32" />
      <SkeletonBlock className="h-14 w-full" />
    </div>
  );
}

function SkeletonSectionCard({ fieldCount }: { fieldCount: number }) {
  return (
    <section className="flex flex-col gap-6 bg-white px-4 py-6 lg:px-6">
      <SkeletonBlock className="h-7 w-52 lg:h-8 lg:w-56" />
      {Array.from({ length: fieldCount }).map((_, index) => (
        <SkeletonField key={index} />
      ))}
    </section>
  );
}

function SkeletonOrderSummaryItem() {
  return (
    <div className="flex items-start gap-6 border border-aboutInactive bg-gray300 px-4 py-6">
      <SkeletonBlock className="h-[71px] w-20 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <SkeletonBlock className="h-5 w-40" />
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-5 w-20" />
      </div>
    </div>
  );
}

function SkeletonOrderSummaryAside() {
  return (
    <aside className="h-fit w-full min-w-0 md:sticky md:top-12 max-md:hidden">
      <div className="flex flex-col gap-6 bg-white p-6">
        <div className="flex flex-col gap-6">
          <SkeletonBlock className="h-7 w-40 lg:h-8 lg:w-44" />
          <div className="h-px w-full bg-neutral300" aria-hidden />
          <div className="flex flex-col gap-4">
            <SkeletonOrderSummaryItem />
            <SkeletonOrderSummaryItem />
          </div>
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
        </div>
        <hr className="border-neutral300" />
        <SkeletonBlock className="h-14 w-full" />
      </div>
    </aside>
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

const CheckoutPageSkeleton = () => {
  return (
    <section
      className={cn(
        "bg-gray300 lg:pb-16",
        "md:max-lg:-mt-2 md:max-lg:landscape:mt-0",
        "md:max-lg:pb-16",
      )}
      aria-busy="true"
      aria-label="Loading checkout"
    >
      <p className="sr-only" aria-live="polite">
        Loading checkout
      </p>

      <div className="mx-auto w-full px-5 max-md:pt-4 pt-6 md:max-lg:px-8 md:max-lg:landscape:pt-0 lg:px-10 2xl:max-w-1920 2xl:px-[60px]">
        <SkeletonBlock className="mb-6 h-9 w-64 lg:mb-10 lg:h-10 lg:w-72" />

        <div
          className={cn(
            "grid grid-cols-1 gap-6 md:max-lg:portrait:grid-cols-[minmax(0,1fr)_minmax(0,360px)] md:max-lg:landscape:grid-cols-2 md:max-lg:items-start lg:grid-cols-2 lg:gap-6",
          )}
        >
          <div className="flex min-w-0 flex-col gap-6">
            <SkeletonSectionCard fieldCount={2} />
            <SkeletonSectionCard fieldCount={7} />
            <div className="h-[220px] md:hidden" aria-hidden />
          </div>

          <SkeletonOrderSummaryAside />
        </div>
      </div>

      <SkeletonMobileStickyFooter />
    </section>
  );
};

export default CheckoutPageSkeleton;
