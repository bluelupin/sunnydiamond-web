"use client";

import { jewelleryListingErrorStateContent } from "../data/content";

type JewelleryListingErrorStateProps = {
  message?: string;
  onRetry: () => void;
  variant?: "listing" | "loadMore";
};

const JewelleryListingErrorState = ({
  message,
  onRetry,
  variant = "listing",
}: JewelleryListingErrorStateProps) => {
  const { listingTitle, listingDescription, loadMoreTitle, loadMoreDescription, retryLabel } =
    jewelleryListingErrorStateContent;
  const title = variant === "loadMore" ? loadMoreTitle : listingTitle;
  const description = message?.trim() || (variant === "loadMore" ? loadMoreDescription : listingDescription);

  return (
    <div
      className={
        variant === "loadMore"
          ? "flex w-full flex-col items-center gap-4 px-4 py-6 text-center"
          : "flex w-full min-h-[min(400px,45vh)] items-center justify-center px-4 py-12 md:py-16"
      }
      role="alert"
      aria-live="polite"
    >
      <div className="flex w-full max-w-[464px] flex-col items-center gap-6 text-center md:gap-8">
        <div className="flex w-full flex-col gap-3">
          <h2 className="font-larken text-2xl font-light leading-110 text-darkblack md:text-32">
            {title}
          </h2>
          <p className="font-gill text-base font-light leading-110 text-neutral500">{description}</p>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="btn-border-slide inline-flex h-14 w-full max-w-[280px] items-center justify-center border-[0.8px] border-neutral300 px-7 font-gill text-sm uppercase leading-110 text-darkblack"
        >
          <span className="relative z-10">{retryLabel}</span>
        </button>
      </div>
    </div>
  );
};

export default JewelleryListingErrorState;
