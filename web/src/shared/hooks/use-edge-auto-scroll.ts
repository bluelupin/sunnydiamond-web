"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

type ScrollVelocity = {
  x: number;
  y: number;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

type UseEdgeAutoScrollOptions = {
  edgeZone?: number;
  maxSpeedPxPerSec?: number;
};

const DEFAULT_EDGE_ZONE = 80;
const DEFAULT_MAX_SPEED_PX_PER_SEC = 840;

const getEdgeIntensity = (distanceFromEdge: number, edgeZone: number) =>
  Math.max(0, Math.min(1, (edgeZone - distanceFromEdge) / edgeZone));

const isPointerInsideRect = (
  clientX: number,
  clientY: number,
  rect: DOMRect,
) =>
  clientX >= rect.left &&
  clientX <= rect.right &&
  clientY >= rect.top &&
  clientY <= rect.bottom;

export const useEdgeAutoScroll = (
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  options: UseEdgeAutoScrollOptions = {},
) => {
  const edgeZone = options.edgeZone ?? DEFAULT_EDGE_ZONE;
  const maxSpeedPxPerSec = options.maxSpeedPxPerSec ?? DEFAULT_MAX_SPEED_PX_PER_SEC;

  const pointerRef = useRef<PointerState>({ x: 0, y: 0, active: false });
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const stop = useCallback(() => {
    pointerRef.current.active = false;
    lastFrameRef.current = null;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const computeVelocity = useCallback(
    (clientX: number, clientY: number): ScrollVelocity => {
      const container = containerRef.current;
      if (!container) {
        return { x: 0, y: 0 };
      }

      const rect = container.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;

      let xIntensity = 0;
      let yIntensity = 0;

      if (offsetX >= 0 && offsetX <= rect.width) {
        if (offsetX < edgeZone) {
          xIntensity = -getEdgeIntensity(offsetX, edgeZone);
        } else if (offsetX > rect.width - edgeZone) {
          xIntensity = getEdgeIntensity(rect.width - offsetX, edgeZone);
        }
      }

      if (offsetY >= 0 && offsetY <= rect.height) {
        if (offsetY < edgeZone) {
          yIntensity = -getEdgeIntensity(offsetY, edgeZone);
        } else if (offsetY > rect.height - edgeZone) {
          yIntensity = getEdgeIntensity(rect.height - offsetY, edgeZone);
        }
      }

      return {
        x: xIntensity * maxSpeedPxPerSec,
        y: yIntensity * maxSpeedPxPerSec,
      };
    },
    [containerRef, edgeZone, maxSpeedPxPerSec],
  );

  const tick = useCallback(
    (timestamp: number) => {
      const container = containerRef.current;
      const pointer = pointerRef.current;

      if (
        !container ||
        !pointer.active ||
        reducedMotionRef.current
      ) {
        stop();
        return;
      }

      const velocity = computeVelocity(pointer.x, pointer.y);

      if (velocity.x === 0 && velocity.y === 0) {
        stop();
        return;
      }

      if (lastFrameRef.current === null) {
        lastFrameRef.current = timestamp;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const deltaSec = (timestamp - lastFrameRef.current) / 1000;
      lastFrameRef.current = timestamp;

      if (deltaSec > 0) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        const maxScrollTop = container.scrollHeight - container.clientHeight;

        if (maxScrollLeft > 0 && velocity.x !== 0) {
          container.scrollLeft = Math.max(
            0,
            Math.min(maxScrollLeft, container.scrollLeft + velocity.x * deltaSec),
          );
        }

        if (maxScrollTop > 0 && velocity.y !== 0) {
          container.scrollTop = Math.max(
            0,
            Math.min(maxScrollTop, container.scrollTop + velocity.y * deltaSec),
          );
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [computeVelocity, containerRef, stop],
  );

  const startLoopIfNeeded = useCallback(() => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  useEffect(() => {
    if (!enabled) {
      stop();
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotionRef.current || event.pointerType === "touch") {
        return;
      }

      const container = containerRef.current;
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const inside = isPointerInsideRect(event.clientX, event.clientY, rect);

      if (!inside) {
        stop();
        return;
      }

      pointerRef.current = {
        x: event.clientX,
        y: event.clientY,
        active: true,
      };

      const velocity = computeVelocity(event.clientX, event.clientY);

      if (velocity.x !== 0 || velocity.y !== 0) {
        startLoopIfNeeded();
        return;
      }

      stop();
    };

    const handlePointerLeaveWindow = (event: PointerEvent) => {
      if (event.relatedTarget === null) {
        stop();
      }
    };

    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerout", handlePointerLeaveWindow);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerout", handlePointerLeaveWindow);
      stop();
    };
  }, [computeVelocity, containerRef, enabled, startLoopIfNeeded, stop]);

  useEffect(() => stop, [stop]);
};
