const shimmerClass = "animate-pulse bg-gray300";

type JewelleryProductGridSkeletonProps = {
  count?: number;
};

const JewelleryProductCardSkeleton = () => (
  <article className="relative grid h-[260px] min-w-0 w-full grid-cols-1 grid-rows-1 overflow-hidden bg-gray200 md:h-[420px] desktop:h-[496px]">
    <div className="pointer-events-none col-start-1 row-start-1 z-10 flex justify-end self-start px-2 pt-2 md:px-6 md:pt-6">
      <div className={`size-6 shrink-0 md:size-8 ${shimmerClass}`} aria-hidden />
    </div>

    <div className="col-start-1 row-start-1 flex w-full flex-col items-center px-4 pt-6 md:px-6 md:pt-10">
      <div
        className={`size-[121px] shrink-0 md:aspect-square md:h-auto md:max-w-[303px] md:w-full desktop:size-[303px] ${shimmerClass}`}
        aria-hidden
      />
    </div>

    <div className="pointer-events-none col-start-1 row-start-1 z-10 flex size-full flex-col items-center justify-end gap-3 px-4 pb-6 md:gap-3 md:px-6 md:pb-10">
      <div className={`h-3.5 w-24 md:h-5 md:w-36 ${shimmerClass}`} aria-hidden />
      <div className={`h-3.5 w-16 md:h-5 md:w-24 ${shimmerClass}`} aria-hidden />
    </div>
  </article>
);

const JewelleryProductGridSkeleton = ({ count = 9 }: JewelleryProductGridSkeletonProps) => (
  <div
    className="grid w-full min-w-0 grid-cols-2 items-start md:grid-cols-3"
    aria-busy="true"
    aria-label="Loading products"
  >
    {Array.from({ length: count }, (_, index) => (
      <JewelleryProductCardSkeleton key={index} />
    ))}
  </div>
);

export default JewelleryProductGridSkeleton;
