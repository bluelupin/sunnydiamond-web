"use client";

import { useRef, useSyncExternalStore } from "react";
import { cn } from "@/shared/utils/cn";
import {
  DESKTOP_MEDIA_QUERY,
  TABLET_UP_MEDIA_QUERY,
} from "@/shared/lib/breakpoints";
import { useScrollProgressLine } from "../hooks/useScrollProgressLine";

type ResponsiveBreakpoint = "mobile" | "md" | "lg";

export type ResponsiveLineValue<T> = T | {
  /** Base value — mobile (<768px) unless overridden by `md` / `lg` */
  default?: T;
  md?: T;
  lg?: T;
};

type VerticalScrollLineProps = {
  className?: string;
  lineFill?: number;
  reducedMotion?: boolean;
  visible?: boolean;
  /** Line height in pixels — scalar or per-breakpoint values */
  height?: ResponsiveLineValue<number>;
  /** @deprecated Use `height` instead */
  lineHeight?: number;
  /** Line fill color or CSS background — scalar or per-breakpoint values */
  backgroundColor?: ResponsiveLineValue<string>;
};

const revealEase = "duration-700 ease-reveal";
const DEFAULT_HEIGHT = 58;

function resolveResponsiveValue<T>(
  value: ResponsiveLineValue<T> | undefined,
  fallback: T,
  breakpoint: ResponsiveBreakpoint,
): T {
  if (value === undefined) {
    return fallback;
  }

  if (typeof value !== "object" || value === null) {
    return value;
  }

  const config = value as { default?: T; md?: T; lg?: T };

  if (breakpoint === "lg") {
    return config.lg ?? config.md ?? config.default ?? fallback;
  }

  if (breakpoint === "md") {
    return config.md ?? config.default ?? fallback;
  }

  return config.default ?? fallback;
}

function getResponsiveBreakpoint(): ResponsiveBreakpoint {
  if (typeof window === "undefined") {
    return "mobile";
  }

  if (window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
    return "lg";
  }

  if (window.matchMedia(TABLET_UP_MEDIA_QUERY).matches) {
    return "md";
  }

  return "mobile";
}

function subscribeResponsiveBreakpoint(onStoreChange: () => void) {
  const mdQuery = window.matchMedia(TABLET_UP_MEDIA_QUERY);
  const lgQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

  mdQuery.addEventListener("change", onStoreChange);
  lgQuery.addEventListener("change", onStoreChange);

  return () => {
    mdQuery.removeEventListener("change", onStoreChange);
    lgQuery.removeEventListener("change", onStoreChange);
  };
}

function useResponsiveBreakpoint(): ResponsiveBreakpoint {
  return useSyncExternalStore(
    subscribeResponsiveBreakpoint,
    getResponsiveBreakpoint,
    () => "mobile",
  );
}

const VerticalScrollLine = ({
  className,
  lineFill: lineFillProp,
  reducedMotion: reducedMotionProp,
  visible: visibleProp,
  height,
  lineHeight,
  backgroundColor,
}: VerticalScrollLineProps) => {
  const breakpoint = useResponsiveBreakpoint();
  const resolvedHeight = resolveResponsiveValue(
    height ?? lineHeight,
    DEFAULT_HEIGHT,
    breakpoint,
  );
  const resolvedBackgroundColor =
    backgroundColor !== undefined
      ? resolveResponsiveValue(backgroundColor, "", breakpoint)
      : undefined;
  const sectionRef = useRef<HTMLDivElement>(null);
  const externalLineFill = lineFillProp !== undefined;
  const internal = useScrollProgressLine(externalLineFill ? { current: null } : sectionRef);

  const lineFill = lineFillProp ?? internal.lineFill;
  const visible =
    visibleProp ?? (lineFillProp !== undefined ? lineFill > 0.02 : internal.visible);
  const reducedMotion = reducedMotionProp ?? internal.reducedMotion;

  return (
    <div
      ref={externalLineFill ? undefined : sectionRef}
      className={cn("flex w-full justify-center bg-white", className)}
      aria-hidden
    >
      <div
        className={cn(
          "w-px overflow-hidden",
          visible ? "opacity-100" : "opacity-0",
          !externalLineFill && !reducedMotion &&
          `transition-opacity ${revealEase} motion-reduce:transition-none`,
        )}
        style={{ height: resolvedHeight }}
      >
        <div
          className={cn(
            "w-[1px] origin-top",
            !resolvedBackgroundColor && "bg-gradient-to-b from-[#722257] to-[#DDA957]",
            reducedMotion || externalLineFill
              ? ""
              : "transition-transform duration-500 ease-out motion-reduce:transition-none",
          )}
          style={{
            height: resolvedHeight,
            transform: `scaleY(${lineFill})`,
            ...(resolvedBackgroundColor ? { background: resolvedBackgroundColor } : null),
          }}
        />
      </div>
    </div>
  );
};

export default VerticalScrollLine;
