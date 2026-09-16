"use client";

import { cartRefreshErrorContent } from "../data/cartErrorContent";

type CartRefreshErrorStateProps = {
  message?: string;
  onRetry: () => void;
  variant?: "full" | "banner";
};

const CartRefreshErrorState = ({
  message,
  onRetry,
  variant = "full",
}: CartRefreshErrorStateProps) => {
  const { title, description, staleDescription, retryLabel } = cartRefreshErrorContent;
  const copy = message?.trim() || (variant === "banner" ? staleDescription : description);

  if (variant === "banner") {
    return (
      <div
        className="flex flex-col gap-4 rounded border border-neutral300 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
        role="alert"
        aria-live="polite"
      >
        <p className="font-gill text-base font-light leading-110 text-neutral500">{copy}</p>
        <button
          type="button"
          onClick={onRetry}
          className="btn-border-slide inline-flex h-12 shrink-0 items-center justify-center border-[0.8px] border-neutral300 px-6 font-gill text-sm uppercase leading-110 text-darkblack"
        >
          <span className="relative z-10">{retryLabel}</span>
        </button>
      </div>
    );
  }

  return (
    <section
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-gray300 px-4 py-20 text-center"
      role="alert"
      aria-live="polite"
    >
      <div className="flex w-full max-w-[464px] flex-col items-center gap-6 text-center md:gap-8">
        <div className="flex w-full flex-col gap-3">
          <h1 className="font-larken text-32 font-light leading-110 text-darkblack lg:text-32">
            {title}
          </h1>
          <p className="font-gill text-base font-light leading-110 text-neutral500">{copy}</p>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="btn-border-slide inline-flex h-14 w-full max-w-[280px] items-center justify-center border-[0.8px] border-neutral300 px-7 font-gill text-sm uppercase leading-110 text-darkblack"
        >
          <span className="relative z-10">{retryLabel}</span>
        </button>
      </div>
    </section>
  );
};

export default CartRefreshErrorState;
