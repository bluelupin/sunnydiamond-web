"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { shouldEagerLoadHomeSections } from "@/shared/lib/browserBackScrollRestore";
import { normalizeIntersectionRootMargin } from "@/shared/utils/intersectionObserver";
import { isElementInViewportWithRootMargin } from "@/shared/utils/viewport";

type LazyInViewProps = {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  /** Preload slightly before the section enters the viewport */
  rootMargin?: string;
  threshold?: number;
};

/**
 * Defers mounting children until the placeholder nears the viewport.
 * Pairs with React.lazy to avoid loading below-fold chunks on initial paint.
 */
export function LazyInView({
  children,
  fallback = null,
  className,
  rootMargin = "120px 0px 120px 0px",
  threshold = 0,
}: LazyInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => shouldEagerLoadHomeSections());

  useLayoutEffect(() => {
    if (visible) return;

    if (shouldEagerLoadHomeSections()) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const safeRootMargin = normalizeIntersectionRootMargin(rootMargin);

    if (isElementInViewportWithRootMargin(node, safeRootMargin)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: safeRootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, visible]);

  return (
    <div ref={ref} className={cn(className)}>
      {visible ? children : fallback}
    </div>
  );
}
