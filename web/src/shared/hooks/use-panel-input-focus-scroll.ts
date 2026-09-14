"use client";

import { useCallback, useRef } from "react";

const FOCUS_SCROLL_PADDING_PX = 16;

function scrollFieldIntoPanelView(container: HTMLElement, field: HTMLElement) {
  const containerRect = container.getBoundingClientRect();
  const fieldRect = field.getBoundingClientRect();

  const fieldTop = fieldRect.top - containerRect.top + container.scrollTop;
  const fieldBottom = fieldTop + fieldRect.height;
  const visibleTop = container.scrollTop;
  const visibleBottom = visibleTop + container.clientHeight;

  if (fieldTop < visibleTop + FOCUS_SCROLL_PADDING_PX) {
    container.scrollTop = fieldTop - FOCUS_SCROLL_PADDING_PX;
    return;
  }

  if (fieldBottom > visibleBottom - FOCUS_SCROLL_PADDING_PX) {
    container.scrollTop = fieldBottom - container.clientHeight + FOCUS_SCROLL_PADDING_PX;
  }
}

/**
 * Scrolls focused inputs into view inside a panel scroll container.
 */
export function usePanelInputFocusScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleFocusCapture = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (!target.matches("input, textarea, select")) {
      return;
    }

    const container = scrollRef.current;
    if (!container) {
      return;
    }

    window.requestAnimationFrame(() => {
      scrollFieldIntoPanelView(container, target);
    });
  }, []);

  return { scrollRef, handleFocusCapture };
}
