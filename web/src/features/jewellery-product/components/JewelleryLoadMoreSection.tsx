"use client";

import PageContainer from "@/shared/ui/layout/PageContainer";

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
    <section className="px-4 py-16 md:px-0 md:py-24">
      <PageContainer className="flex justify-center">
        <div className="flex w-full max-w-[360px] flex-col items-center gap-6">
          <div className="flex w-full flex-col items-center gap-3">
            <p className="text-center font-gill text-sm font-light leading-110 text-darkblack md:text-base md:leading-110">
              {visibleCount} out of {totalCount} Products
            </p>

            <div className="relative h-0.5 w-full overflow-visible bg-neutral300" aria-hidden>
              <div
                className="absolute left-0 top-0 h-[3px] bg-darkblack transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {hasMore ? (
            <button
              type="button"
              onClick={onLoadMore}
              className="inline-flex h-14 w-full items-center justify-center border-[0.8px] border-neutral300 px-7 py-5 font-gill text-sm uppercase leading-110 text-darkblack transition-colors hover:border-darkblack hover:bg-darkblack hover:text-white md:h-14"
            >
              Load More
            </button>
          ) : null}
        </div>
      </PageContainer>
    </section>
  );
};

export default JewelleryLoadMoreSection;
