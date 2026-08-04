import JewelleryProductGridSkeleton from "./JewelleryProductGridSkeleton";
import { INITIAL_PLP_PRODUCT_COUNT } from "../../data/filters";

const shimmerClass = "animate-pulse bg-gray200";

const JewelleryListingPageSkeleton = () => (
  <div
    className="pb-[calc(64px+env(safe-area-inset-bottom,0px))] md:pb-0"
    aria-busy="true"
    aria-label="Loading jewellery collection"
  >
    <section className="relative grid h-[240px] w-full overflow-hidden bg-gray200 md:h-320" aria-hidden />

    <div className="border-b-[0.5px] border-neutral300 bg-white px-4 py-6 md:px-8 md:py-8" aria-hidden>
      <div className="flex gap-3 md:justify-center md:gap-6">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="flex w-[56px] shrink-0 flex-col items-center gap-2 md:w-[86px]">
            <div className={`size-6 md:size-10 ${shimmerClass}`} />
            <div className={`h-3 w-10 md:h-4 md:w-14 ${shimmerClass}`} />
          </div>
        ))}
      </div>
    </div>

    <div
      className="flex h-16 items-center justify-between border-b-[0.5px] border-neutral300 bg-white px-4 md:h-[72px] md:px-10"
      aria-hidden
    >
      <div className={`h-4 w-28 ${shimmerClass}`} />
      <div className="flex gap-4">
        <div className={`h-4 w-16 ${shimmerClass}`} />
        <div className={`h-4 w-16 ${shimmerClass}`} />
      </div>
    </div>

    <section className="relative isolate z-0 w-full bg-gray200 pb-0 md:pb-10">
      <JewelleryProductGridSkeleton count={INITIAL_PLP_PRODUCT_COUNT} />
    </section>
  </div>
);

export default JewelleryListingPageSkeleton;
