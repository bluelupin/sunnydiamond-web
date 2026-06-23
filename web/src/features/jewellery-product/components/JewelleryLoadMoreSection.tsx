"use client";

interface JewelleryLoadMoreSectionProps {
  visibleCount: number;
  totalCount: number;
  onLoadMore: () => void;
  hasMore: boolean;
}

const JewelleryLoadMoreSection = ({
  visibleCount,
  totalCount,
  onLoadMore,
  hasMore,
}: JewelleryLoadMoreSectionProps) => {
  const progress = totalCount > 0 ? Math.min(100, (visibleCount / totalCount) * 100) : 0;

  return (
    <section className="flex flex-col items-center px-4 py-16 md:container md:py-14">
      <div className="flex w-full flex-col items-center gap-6 md:gap-6">
        <div className="flex w-full flex-col items-center gap-3 md:gap-0">
          <p className="text-center font-gill text-sm font-light leading-110 text-darkblack md:text-base md:font-normal md:text-darkblack/70 md:tracking-[1%]">
            {visibleCount} out of {totalCount} Products
          </p>

          <div className="relative h-0.5 w-full overflow-visible bg-neutral300 md:mt-6 md:max-w-[560px]" aria-hidden>
            <div
              className="absolute left-0 top-0 h-[3px] bg-darkblack transition-all duration-500 md:h-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {hasMore ? (
          <button
            type="button"
            onClick={onLoadMore}
            className="group relative inline-flex h-14 w-full items-center justify-center overflow-hidden border-[0.8px] border-neutral300 px-7 py-5 font-gill text-sm uppercase leading-110 tracking-[1.8%] text-darkblack transition-colors duration-500 md:h-12 md:w-auto md:border-darkblack md:px-10 md:text-base"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-darkblack transition-transform duration-500 ease-out group-hover:scale-y-100 md:block" />
            <span className="relative z-10 uppercase md:normal-case">
              Load More
            </span>
          </button>
        ) : null}
      </div>
    </section>
  );
};

export default JewelleryLoadMoreSection;
