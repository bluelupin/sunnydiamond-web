"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ErrorPage from "@/features/error/components/ErrorPage";
import {
  attemptTransientRouteRecovery,
} from "@/shared/hooks/useTransientErrorAutoRetry";
import {
  getRouteErrorVariant,
  isServerRelatedRouteError,
} from "@/shared/utils/routeError";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();
  const recoveryStartedRef = useRef(false);
  const showMaintenancePage = isServerRelatedRouteError(error);

  useEffect(() => {
    console.error("Runtime Error Boundary caught:", error);
  }, [error]);

  useEffect(() => {
    if (showMaintenancePage || recoveryStartedRef.current) {
      return;
    }

    recoveryStartedRef.current = true;

    attemptTransientRouteRecovery({
      reset,
      errorDigest: error.digest,
      onExhausted: () => {
        router.replace("/");
      },
    });
  }, [error.digest, reset, router, showMaintenancePage]);

  if (!showMaintenancePage) {
    return null;
  }

  return (
    <ErrorPage
      variant={getRouteErrorVariant(error)}
      onRetry={reset}
      errorCode={error.digest}
      autoRetry={false}
    />
  );
}
