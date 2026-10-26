"use client";

import { useCallback, useRef, useState } from "react";

const SWIPE_THRESHOLD_PX = 40;
const HORIZONTAL_LOCK_PX = 10;
const VERTICAL_SCROLL_LOCK_PX = 8;

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
    captured: false,
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    pointerId: 0,
    target: null as HTMLElement | null,
  });
  const lastGestureWasSwipeRef = useRef(false);
  const pointerSessionCancelledRef = useRef(false);

  const maxSlide = Math.max(0, slideCount - 1);

  const goToSlide = useCallback(
    (index: number) => {
      setActiveSlide(Math.max(0, Math.min(maxSlide, index)));
    },
    [maxSlide],
  );

  const releaseCapture = useCallback(() => {
    const { captured, pointerId, target } = dragState.current;
    if (!captured || !target) {
      return;
    }
    try {
      target.releasePointerCapture(pointerId);
    } catch {
      /* noop */
    }
    dragState.current.captured = false;
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled || slideCount < 2) return;
      pointerSessionCancelledRef.current = false;
      dragState.current = {
        active: true,
        captured: false,
        startX: event.clientX,
        startY: event.clientY,
        deltaX: 0,
        deltaY: 0,
        pointerId: event.pointerId,
        target: event.currentTarget,
      };
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

      // Prefer vertical scrolling when the gesture is clearly vertical.
      if (
        Math.abs(deltaY) > Math.abs(deltaX) &&
        Math.abs(deltaY) > VERTICAL_SCROLL_LOCK_PX
      ) {
        pointerSessionCancelledRef.current = true;
        dragState.current.active = false;
        setIsDragging(false);
        setDragOffset(0);
        releaseCapture();
        return;
      }

      const isHorizontalGesture =
        Math.abs(deltaX) > Math.abs(deltaY) &&
        Math.abs(deltaX) > HORIZONTAL_LOCK_PX;

      if (!isHorizontalGesture) {
        return;
      }

      if (!dragState.current.captured) {
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
          dragState.current.captured = true;
          dragState.current.target = event.currentTarget;
          dragState.current.pointerId = event.pointerId;
        } catch {
          return;
        }
      }

      setIsDragging(true);
      setDragOffset(deltaX);
    },
    [releaseCapture],
  );

  const endDrag = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!dragState.current.active) return;

      const { deltaX } = dragState.current;
      dragState.current.active = false;
      releaseCapture();

      setIsDragging(false);
      setDragOffset(0);

      lastGestureWasSwipeRef.current = false;

      if (Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
        lastGestureWasSwipeRef.current = true;
        setSuppressClick(true);
        if (deltaX <= -SWIPE_THRESHOLD_PX) goToSlide(activeSlide + 1);
        else if (deltaX >= SWIPE_THRESHOLD_PX) goToSlide(activeSlide - 1);
      }
    },
    [activeSlide, goToSlide, releaseCapture],
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
    lastGestureWasSwipeRef,
    pointerSessionCancelledRef,
  };
}
