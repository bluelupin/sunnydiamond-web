"use client";

import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";

const SWIPE_THRESHOLD_PX = 40;

type UseHorizontalCarouselSwipeOptions = {
  slideCount: number;
  onNext: () => void;
  onPrevious: () => void;
  enabled?: boolean;
};

export function useHorizontalCarouselSwipe({
  slideCount,
  onNext,
  onPrevious,
  enabled = true,
}: UseHorizontalCarouselSwipeOptions) {
  const dragState = useRef({
    active: false,
    startX: 0,
    startY: 0,
    deltaX: 0,
    pointerId: 0,
  });

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || slideCount < 2) return;
      if ((event.target as HTMLElement).closest("button")) return;

      dragState.current = {
        active: true,
        startX: event.clientX,
        startY: event.clientY,
        deltaX: 0,
        pointerId: event.pointerId,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [enabled, slideCount],
  );

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (!dragState.current.active) return;

    const deltaX = event.clientX - dragState.current.startX;
    const deltaY = event.clientY - dragState.current.startY;
    dragState.current.deltaX = deltaX;

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
      dragState.current.active = false;
      try {
        event.currentTarget.releasePointerCapture(dragState.current.pointerId);
      } catch {
        /* noop */
      }
    }
  }, []);

  const endDrag = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!dragState.current.active) return;

      const { deltaX, pointerId } = dragState.current;
      dragState.current.active = false;

      try {
        event.currentTarget.releasePointerCapture(pointerId);
      } catch {
        /* noop */
      }

      if (deltaX <= -SWIPE_THRESHOLD_PX) {
        onNext();
      } else if (deltaX >= SWIPE_THRESHOLD_PX) {
        onPrevious();
      }
    },
    [onNext, onPrevious],
  );

  const swipeProps =
    enabled && slideCount >= 2
      ? {
          onPointerDown,
          onPointerMove,
          onPointerUp: endDrag,
          onPointerCancel: endDrag,
        }
      : {};

  return { swipeProps };
}
