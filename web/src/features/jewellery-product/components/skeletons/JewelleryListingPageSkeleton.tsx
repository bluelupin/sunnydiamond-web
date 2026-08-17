import JewelleryProductGridSkeleton from "./JewelleryProductGridSkeleton";
import { PAGE_SIZE } from "../../data/filters";

const shimmerClass = "animate-pulse bg-gray300";

const CATEGORY_SKELETON_COUNT = 7;

const JewelleryListingPageSkeleton = () => (
  <div
    className="pb-[calc(64px+env(safe-area-inset-bottom,0px))] md:pb-0"
    aria-busy="true"
    aria-label="Loading jewellery collection"
  >
    <section
      className="relative grid h-[240px] w-full overflow-hidden bg-gray200 md:h-320"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-darkblack/85 via-darkblack/35 to-transparent" />
      <div
        className={`col-start-1 row-start-1 z-10 mx-auto mt-[152px] h-8 w-52 md:mt-[203px] md:h-12 md:w-72 ${shimmerClass}`}
      />
    </section>

    <nav className="border-b-[0.5px] border-neutral300 bg-white" aria-hidden>
      <div className="overflow-x-auto scrollbar-none md:overflow-visible">
        <ul className="flex w-max items-center gap-3 px-4 py-6 md:w-full md:max-w-full md:justify-between md:gap-6 md:py-8 lg:justify-center lg:gap-8 lg:py-[40px]">
          {Array.from({ length: CATEGORY_SKELETON_COUNT }, (_, index) => (
            <li
              key={index}
              className="shrink-0 md:flex md:flex-1 md:justify-center lg:flex-none"
            >
              <div className="flex w-[56px] flex-col items-center justify-center gap-2 md:w-full md:max-w-[86px] lg:w-[86px]">
                <div className={`size-6 shrink-0 lg:size-10 ${shimmerClass}`} />
                <div className={`h-3.5 w-10 lg:h-4 lg:w-14 ${shimmerClass}`} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>

    <div className="sticky top-0 z-20 hidden bg-white md:block" aria-hidden>
      <div className="flex h-[94px] w-full items-center justify-between px-10">
        <div className={`h-5 w-32 ${shimmerClass}`} />
        <div className="flex items-center gap-8">
          <div className={`h-5 w-20 ${shimmerClass}`} />
          <div className={`h-5 w-24 ${shimmerClass}`} />
        </div>
      </div>
    </div>

    <section className="relative isolate z-0 w-full bg-gray200 pb-0 md:pb-10">
      <JewelleryProductGridSkeleton count={PAGE_SIZE} />
    </section>

    <div
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-neutral300/60 bg-white pb-[env(safe-area-inset-bottom,0px)] md:hidden"
      aria-hidden
    >
      <div className="mx-auto flex h-16 w-full max-w-[375px] items-center justify-between px-4">
        <div className={`h-4 w-16 ${shimmerClass}`} />
        <div className={`h-4 w-20 ${shimmerClass}`} />
      </div>
    </div>
  </div>
);

export default JewelleryListingPageSkeleton;
