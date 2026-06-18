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
    <section className="container py-10 md:py-14 flex flex-col items-center gap-6">
      <p className="font-gill text-sm md:text-base text-darkblack/70 tracking-[1%]">
        {visibleCount} out of {totalCount} Products
      </p>

      <div className="w-full max-w-[560px] h-[2px] bg-gray300 overflow-hidden" aria-hidden>
        <div
          className="h-full bg-darkblack transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {hasMore ? (
        <button
          type="button"
          onClick={onLoadMore}
          className="group relative overflow-hidden inline-flex items-center justify-center border-[0.8px] border-darkblack text-darkblack md:text-base text-sm px-10 md:h-50 h-12 tracking-[1.8%] uppercase font-gill transition-colors duration-500"
        >
          <span className="absolute inset-0 bg-darkblack origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100" />
          <span className="relative z-10 group-hover:text-white transition-colors duration-500">
            Load More
          </span>
        </button>
      ) : null}
    </section>
  );
};

export default JewelleryLoadMoreSection;
