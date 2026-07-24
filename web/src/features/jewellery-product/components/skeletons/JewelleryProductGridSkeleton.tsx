const shimmerClass = "animate-pulse bg-gray200";

type JewelleryProductGridSkeletonProps = {
  count?: number;
};

const JewelleryProductGridSkeleton = ({ count = 9 }: JewelleryProductGridSkeletonProps) => (
  <div
    className="grid w-full grid-cols-2 md:grid-cols-3"
    aria-busy="true"
    aria-label="Loading products"
  >
    {Array.from({ length: count }, (_, index) => (
      <article
        key={index}
        className="grid h-[227px] grid-cols-1 grid-rows-1 bg-gray200 md:h-[496px]"
      >
        <div className="flex size-full flex-col items-center justify-center gap-2 px-[5px] md:gap-3 md:px-3">
          <div className={`size-[121px] shrink-0 md:size-[303px] ${shimmerClass}`} />
          <div className={`h-4 w-24 md:h-5 md:w-32 ${shimmerClass}`} />
          <div className={`h-4 w-16 md:h-5 md:w-20 ${shimmerClass}`} />
        </div>
      </article>
    ))}
  </div>
);

export default JewelleryProductGridSkeleton;
