"use client";

import type { ReactNode } from "react";
import { LazyInView } from "@/shared/ui/LazyInView";
import { useResponsiveLazyRootMargin } from "@/shared/hooks/useResponsiveLazyRootMargin";

type GiftingLazyInViewProps = {
  children: ReactNode;
  fallback: ReactNode;
};

/** Tighter root margin on mobile to defer below-fold work on throttled devices. */
const GiftingLazyInView = ({ children, fallback }: GiftingLazyInViewProps) => {
  const rootMargin = useResponsiveLazyRootMargin();

  return (
    <LazyInView fallback={fallback} rootMargin={rootMargin}>
      {children}
    </LazyInView>
  );
};

export default GiftingLazyInView;
