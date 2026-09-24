"use client";

import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { TABLET_UP_MEDIA_QUERY } from "@/shared/lib/breakpoints";

type UsePdpPurchaseStickySyncOptions = {
  galleryRef: RefObject<HTMLElement | null>;
  purchaseRef: RefObject<HTMLElement | null>;
  /** Re-measure when product identity changes. */
  productId: string | number;
};

type StickySyncMetrics = {
  /** Height of the sticky containing block (purchase + runway below it). */
  stickyRegionHeight: number;
  /** Invisible runway below purchase — collapsed in layout via negative margin on details. */
  stickyRunwayHeight: number;
  /** True once scroll has passed the bottom-alignment point. */
  isBottomAligned: boolean;
};

function readStickyTopPx(element: HTMLElement): number {
  const value = window.getComputedStyle(element).top;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function checkPurchaseStuck(purchaseNode: HTMLElement, stickyTopPx: number): boolean {
  const { top } = purchaseNode.getBoundingClientRect();
  return top <= stickyTopPx + 1;
}

/**
 * Measures layout offsets while purchase is in normal flow (not stuck).
 * Returns runway height so CSS sticky releases when gallery bottom meets purchase bottom.
 */
function measureStickyRegionHeight(
  galleryNode: HTMLElement,
  purchaseNode: HTMLElement,
  cachedTopDelta: number | null,
): { regionHeight: number; topDelta: number } {
  const galleryHeight = galleryNode.offsetHeight;
  const purchaseHeight = purchaseNode.offsetHeight;
  const stickyTopPx = readStickyTopPx(purchaseNode);

  let topDelta = cachedTopDelta;
  if (!checkPurchaseStuck(purchaseNode, stickyTopPx)) {
    const galleryRect = galleryNode.getBoundingClientRect();
    const purchaseRect = purchaseNode.getBoundingClientRect();
    topDelta = purchaseRect.top - galleryRect.top;
  }

  const resolvedTopDelta = topDelta ?? 0;
  const regionHeight = Math.max(purchaseHeight, galleryHeight - resolvedTopDelta);

  return { regionHeight, topDelta: resolvedTopDelta };
}

function areBottomEdgesAligned(
  galleryNode: HTMLElement,
  purchaseNode: HTMLElement,
): boolean {
  const galleryBottom = galleryNode.getBoundingClientRect().bottom;
  const purchaseBottom = purchaseNode.getBoundingClientRect().bottom;
  return galleryBottom <= purchaseBottom + 1;
}

export function usePdpPurchaseStickySync({
  galleryRef,
  purchaseRef,
  productId,
}: UsePdpPurchaseStickySyncOptions): StickySyncMetrics {
  const [stickyRegionHeight, setStickyRegionHeight] = useState(0);
  const [stickyRunwayHeight, setStickyRunwayHeight] = useState(0);
  const [isBottomAligned, setIsBottomAligned] = useState(false);
  const topDeltaRef = useRef<number | null>(null);

  const remeasure = useCallback(() => {
    const galleryNode = galleryRef.current;
    const purchaseNode = purchaseRef.current;
    const mediaQuery = window.matchMedia(TABLET_UP_MEDIA_QUERY);

    if (!galleryNode || !purchaseNode || !mediaQuery.matches) {
      topDeltaRef.current = null;
      setStickyRegionHeight(0);
      setStickyRunwayHeight(0);
      setIsBottomAligned(false);
      return;
    }

    const { regionHeight, topDelta } = measureStickyRegionHeight(
      galleryNode,
      purchaseNode,
      topDeltaRef.current,
    );
    const purchaseHeight = purchaseNode.offsetHeight;
    topDeltaRef.current = topDelta;
    setStickyRegionHeight(regionHeight);
    setStickyRunwayHeight(Math.max(0, regionHeight - purchaseHeight));
    setIsBottomAligned(areBottomEdgesAligned(galleryNode, purchaseNode));
  }, [galleryRef, purchaseRef]);

  useLayoutEffect(() => {
    const galleryNode = galleryRef.current;
    const purchaseNode = purchaseRef.current;
    if (!galleryNode || !purchaseNode) {
      return;
    }

    const mediaQuery = window.matchMedia(TABLET_UP_MEDIA_QUERY);
    let rafId: number | null = null;
    let scrollRafId: number | null = null;

    const scheduleRemeasure = () => {
      if (rafId != null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          remeasure();
        });
      });
    };

    const onScroll = () => {
      if (!mediaQuery.matches) {
        return;
      }

      if (scrollRafId != null) {
        return;
      }

      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = null;

        const gallery = galleryRef.current;
        const purchase = purchaseRef.current;
        if (!gallery || !purchase) {
          return;
        }

        setIsBottomAligned(areBottomEdgesAligned(gallery, purchase));

        if (window.scrollY < 8) {
          topDeltaRef.current = null;
          remeasure();
        }
      });
    };

    remeasure();
    scheduleRemeasure();

    const resizeObserver = new ResizeObserver(scheduleRemeasure);
    resizeObserver.observe(galleryNode);
    resizeObserver.observe(purchaseNode);

    mediaQuery.addEventListener("change", scheduleRemeasure);
    window.addEventListener("resize", scheduleRemeasure);
    window.addEventListener("scroll", onScroll, { passive: true });

    const pendingImages: HTMLImageElement[] = [];
    galleryNode.querySelectorAll("img").forEach((img) => {
      if (img.complete) {
        return;
      }

      pendingImages.push(img);
      img.addEventListener("load", scheduleRemeasure);
      img.addEventListener("error", scheduleRemeasure);
    });

    return () => {
      if (rafId != null) {
        cancelAnimationFrame(rafId);
      }
      if (scrollRafId != null) {
        cancelAnimationFrame(scrollRafId);
      }
      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", scheduleRemeasure);
      window.removeEventListener("resize", scheduleRemeasure);
      window.removeEventListener("scroll", onScroll);
      pendingImages.forEach((img) => {
        img.removeEventListener("load", scheduleRemeasure);
        img.removeEventListener("error", scheduleRemeasure);
      });
    };
  }, [galleryRef, purchaseRef, productId, remeasure]);

  return { stickyRegionHeight, stickyRunwayHeight, isBottomAligned };
}
