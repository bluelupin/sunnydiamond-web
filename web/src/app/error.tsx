"use client";

import { useEffect } from "react";
import ErrorPage from "@/features/error/components/ErrorPage";
import { useTransientErrorAutoRetry } from "@/shared/hooks/useTransientErrorAutoRetry";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useTransientErrorAutoRetry(reset, error.digest);

  useEffect(() => {
    console.error("Runtime Error Boundary caught:", error);
  }, [error]);

  return (
    <ErrorPage
      variant="unexpected"
      onRetry={reset}
      errorCode={error.digest}
      autoRetry={false}
    />
  );
}
