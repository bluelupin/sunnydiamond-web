"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import { observeScrollReveal } from "@/shared/lib/scrollRevealObserver";
import { cn } from "@/shared/utils/cn";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: ElementType;
  threshold?: number;
  rootMargin?: string;
};

const ScrollReveal = ({
  children,
  className,
  delayMs = 0,
  as: Tag = "div",
  threshold = 0.12,
  rootMargin = "0px 0px -6% 0px",
}: ScrollRevealProps) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
      setVisible(true);
      return;
    }

    return observeScrollReveal(node, () => setVisible(true), {
      threshold,
      rootMargin,
    });
  }, [rootMargin, threshold]);

  return (
    <Tag
      ref={ref}
      className={cn(
        reducedMotion || visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0",
        !reducedMotion &&
          "motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-reveal",
        className,
      )}
      style={
        !reducedMotion && delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined
      }
    >
      {children}
    </Tag>
  );
};

export default ScrollReveal;
