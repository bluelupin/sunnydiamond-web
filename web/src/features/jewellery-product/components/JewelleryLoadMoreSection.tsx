"use client";

import { jewelleryListingPaginationSpec } from "../data/content";

interface JewelleryLoadMoreSectionProps {
  visibleCount: number;
  totalCount: number;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore?: boolean;
}

const {
  width,
  sectionGap,
  statusGap,
  countFontSize,
  progressTrackHeight,
  progressFillHeight,
  buttonHeight,
  buttonPaddingX,
  buttonPaddingY,
  buttonFontSize,
} = jewelleryListingPaginationSpec;

const JewelleryLoadMoreSection = ({
  visibleCount,
  totalCount,
  onLoadMore,
  hasMore,
  isLoadingMore = false,
}: JewelleryLoadMoreSectionProps) => {
  const progress = totalCount > 0 ? Math.min(100, (visibleCount / totalCount) * 100) : 0;

  return (
    <section className="relative z-[70] flex w-full px-4 py-16 md:z-auto md:py-16">
      <div
        className="mx-auto flex w-full flex-col items-center"
        style={{
          maxWidth: `${width}px`,
          gap: `${sectionGap}px`,
        }}
      >
        <div
          className="flex w-full flex-col items-center"
          style={{ gap: `${statusGap}px` }}
        >
          <p
            className="w-full text-center font-gill font-light leading-110 text-darkblack"
            style={{ fontSize: `${countFontSize}px` }}
          >
            {visibleCount} out of {totalCount} Products
          </p>

          <div
            className="flex w-full items-center overflow-hidden bg-neutral300"
            style={{ height: `${progressTrackHeight}px` }}
            aria-hidden
          >
            <div
              className="bg-darkblack transition-all duration-500"
              style={{
                width: `${progress}%`,
                height: `${progressFillHeight}px`,
              }}
            />
          </div>
        </div>

        {hasMore ? (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            aria-busy={isLoadingMore}
            className="btn-border-slide inline-flex w-full items-center justify-center border-[0.8px] border-neutral300 font-gill font-normal uppercase leading-110 text-darkblack transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              height: `${buttonHeight}px`,
              paddingLeft: `${buttonPaddingX}px`,
              paddingRight: `${buttonPaddingX}px`,
              paddingTop: `${buttonPaddingY}px`,
              paddingBottom: `${buttonPaddingY}px`,
              fontSize: `${buttonFontSize}px`,
            }}
          >
            <span>{isLoadingMore ? "Loading..." : "Load More"}</span>
          </button>
        ) : null}
      </div>
    </section>
  );
};

export default JewelleryLoadMoreSection;
