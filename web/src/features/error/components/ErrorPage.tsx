"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/shared/utils/cn";
import type { ErrorPageProps } from "@/features/error/types";
import {
  errorPageCopy,
  errorPageTheme,
  errorPageVariants,
} from "@/features/error/data/errorPageContent";
import ErrorBrandHeader from "./ErrorBrandHeader";
import ErrorStatusBadge from "./ErrorStatusBadge";
import ErrorActionButtons from "./ErrorActionButtons";
import ErrorFooterMessage from "./ErrorFooterMessage";

const AUTO_RETRY_MS = 30_000;

const ErrorPage = ({
  variant = "unexpected",
  headline = errorPageCopy.headline,
  description = errorPageCopy.description,
  errorCode,
  estimatedMinutes,
  onRetry,
  autoRetry = false,
  retryIntervalMs = AUTO_RETRY_MS,
  showStatusCard = true,
  className,
}: ErrorPageProps) => {
  const variantContent = errorPageVariants[variant];
  const [lastChecked, setLastChecked] = useState(() => new Date());
  const [isRetrying, setIsRetrying] = useState(false);

  const resolvedEstimate =
    estimatedMinutes ?? variantContent.estimatedMinutes;

  const handleRetry = useCallback(() => {
    if (!onRetry || isRetrying) return;

    setIsRetrying(true);
    setLastChecked(new Date());

    try {
      onRetry();
    } finally {
      window.setTimeout(() => setIsRetrying(false), 1200);
    }
  }, [isRetrying, onRetry]);

  useEffect(() => {
    if (!onRetry || !autoRetry) return;

    const intervalId = window.setInterval(() => {
      setLastChecked(new Date());
      onRetry();
    }, retryIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [autoRetry, onRetry, retryIntervalMs]);

  return (
    <main
      className={cn(
        "flex h-screen w-full items-center justify-center px-4 py-12 md:px-8 md:py-16",
        className,
      )}
      style={{ backgroundColor: errorPageTheme.background, color: errorPageTheme.primaryText }}
      role="alert"
      aria-live="polite"
    >
      <div className="animate-fade-in mx-auto flex w-full max-w-xl flex-col items-center gap-8 text-center md:gap-10">
        <ErrorBrandHeader />
        <ErrorStatusBadge label={errorPageCopy.badge} />
        <div className="flex max-w-lg flex-col gap-3">
          <h1 className="font-larken text-3xl font-light leading-110 text-[#1E1E1E] md:text-4xl">
            {headline}
          </h1>
          <p className="font-gill text-base font-light leading-relaxed text-[#6B6B6B] md:text-lg">
            {description}
          </p>
          {/* <p className="font-gill text-sm leading-relaxed text-[#6B6B6B]">
            {variantContent.statusMessage}
          </p> */}
        </div>
        <ErrorActionButtons onRetry={onRetry ? handleRetry : undefined} isRetrying={isRetrying} />
        <ErrorFooterMessage />
      </div>
    </main>
  );
};

export default ErrorPage;
