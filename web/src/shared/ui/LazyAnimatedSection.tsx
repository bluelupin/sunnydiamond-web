"use client";

import { type ReactNode } from "react";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { LazyInView } from "@/shared/ui/LazyInView";
import { useResponsiveLazyRootMargin } from "@/shared/hooks/useResponsiveLazyRootMargin";
import { cn } from "@/shared/utils/cn";

type LazyAnimatedSectionProps = {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  /** Animate the section shell when it enters the viewport */
  animate?: boolean;
  revealDelayMs?: number;
  rootMargin?: string;
};

/**
 * Viewport-gated section: loads children near scroll + optional enter animation.
 */
export function LazyAnimatedSection({
  children,
  fallback,
  className,
  animate = true,
  revealDelayMs = 0,
  rootMargin,
}: LazyAnimatedSectionProps) {
  const responsiveRootMargin = useResponsiveLazyRootMargin(rootMargin);

  return (
    <LazyInView fallback={fallback} className={className} rootMargin={responsiveRootMargin}>
      {animate ? (
        <ScrollReveal delayMs={revealDelayMs} className={cn("w-full", className)}>
          {children}
        </ScrollReveal>
      ) : (
        children
      )}
    </LazyInView>
  );
}
