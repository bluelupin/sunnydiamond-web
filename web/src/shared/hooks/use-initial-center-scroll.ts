"use client";

import { useEffect, useRef, type RefObject } from "react";

export const useInitialCenterScroll = (
  containerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) => {
  const hasUserScrolledRef = useRef(false);
  const isProgrammaticRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      hasUserScrolledRef.current = false;
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    hasUserScrolledRef.current = false;

    const centerScroll = () => {
      if (hasUserScrolledRef.current) {
        return;
      }

      isProgrammaticRef.current = true;

      const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
      const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);

      container.scrollLeft = maxScrollLeft / 2;
      container.scrollTop = maxScrollTop / 2;

      requestAnimationFrame(() => {
        isProgrammaticRef.current = false;
      });
    };

    const handleScroll = () => {
      if (isProgrammaticRef.current) {
        return;
      }

      hasUserScrolledRef.current = true;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    requestAnimationFrame(() => {
      requestAnimationFrame(centerScroll);
    });

    const content = contentRef.current;
    const resizeObserver =
      content &&
      new ResizeObserver(() => {
        centerScroll();
      });

    if (content && resizeObserver) {
      resizeObserver.observe(content);
    }

    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver?.disconnect();
      hasUserScrolledRef.current = false;
    };
  }, [containerRef, contentRef, enabled]);
};
