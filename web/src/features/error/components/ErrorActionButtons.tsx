import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { errorPageCopy } from "@/features/error/data/errorPageContent";

type ErrorActionButtonsProps = {
  onRetry?: () => void;
  isRetrying?: boolean;
};

const ErrorActionButtons = ({ onRetry, isRetrying = false }: ErrorActionButtonsProps) => (
  <div className="flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className={cn(
          "inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-none bg-[#1E1E1E] px-7 font-gill text-sm uppercase leading-110 text-white transition-all",
          "hover:bg-[#B8894E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8894E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6EFE3]",
          "disabled:cursor-not-allowed disabled:opacity-70",
        )}
      >
        {isRetrying ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            <span>Retrying…</span>
          </>
        ) : (
          errorPageCopy.tryAgain
        )}
      </button>
    ) : null}
    <Link
      href="/"
      className={cn(
        "inline-flex h-14 flex-1 items-center justify-center rounded-none border border-[#1E1E1E]/20 bg-white/40 px-7 font-gill text-sm uppercase leading-110 text-[#1E1E1E] transition-all",
        "hover:border-[#B8894E] hover:text-[#B8894E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8894E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6EFE3]",
      )}
    >
      {errorPageCopy.goHome}
    </Link>
  </div>
);

export default ErrorActionButtons;
