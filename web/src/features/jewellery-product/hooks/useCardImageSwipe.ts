"use client";

import { useCallback, useRef, useState } from "react";

const SWIPE_THRESHOLD_PX = 40;

type UseCardImageSwipeOptions = {
  slideCount: number;
  enabled?: boolean;
};

export function useCardImageSwipe({ slideCount, enabled = true }: UseCardImageSwipeOptions) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [suppressClick, setSuppressClick] = useState(false);
  const dragState = useRef({
    active: false,
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    pointerId: 0,
  });

  const maxSlide = Math.max(0, slideCount - 1);

  const goToSlide = useCallback(
    (index: number) => {
      setActiveSlide(Math.max(0, Math.min(maxSlide, index)));
    },
    [maxSlide],
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled || slideCount < 2) return;
      dragState.current = {
        active: true,
        startX: event.clientX,
        startY: event.clientY,
        deltaX: 0,
        deltaY: 0,
        pointerId: event.pointerId,
      };
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [enabled, slideCount],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!dragState.current.active) return;
      const deltaX = event.clientX - dragState.current.startX;
      const deltaY = event.clientY - dragState.current.startY;
      dragState.current.deltaX = deltaX;
      dragState.current.deltaY = deltaY;

      // Vertical scroll should not trigger image swipe or hide product copy.
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
        dragState.current.active = false;
        setIsDragging(false);
        setDragOffset(0);
        try {
          event.currentTarget.releasePointerCapture(dragState.current.pointerId);
        } catch {
          /* noop */
        }
        return;
      }

      setDragOffset(deltaX);
    },
    [],
  );

  const endDrag = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!dragState.current.active) return;

      const { deltaX, pointerId } = dragState.current;
      dragState.current.active = false;

      try {
        event.currentTarget.releasePointerCapture(pointerId);
      } catch {
        /* noop */
      }

      setIsDragging(false);
      setDragOffset(0);

      if (Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
        setSuppressClick(true);
        if (deltaX <= -SWIPE_THRESHOLD_PX) goToSlide(activeSlide + 1);
        else if (deltaX >= SWIPE_THRESHOLD_PX) goToSlide(activeSlide - 1);
      }
    },
    [activeSlide, goToSlide],
  );

  const handleLinkClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (suppressClick) {
        event.preventDefault();
        setSuppressClick(false);
      }
    },
    [suppressClick],
  );

  return {
    activeSlide,
    dragOffset,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    handleLinkClick,
    goToSlide,
  };
}
