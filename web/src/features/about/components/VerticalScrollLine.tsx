"use client";

import { useRef } from "react";
import { cn } from "@/shared/utils/cn";
import { useScrollProgressLine } from "../hooks/useScrollProgressLine";

type VerticalScrollLineProps = {
  className?: string;
  lineFill?: number;
  reducedMotion?: boolean;
  visible?: boolean;
  lineHeight?: number;
};

const revealEase = "duration-700 ease-reveal";

const VerticalScrollLine = ({
  className,
  lineFill: lineFillProp,
  reducedMotion: reducedMotionProp,
  visible: visibleProp,
  lineHeight = 105,
}: VerticalScrollLineProps) => {
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
          `transition-opacity ${revealEase} motion-reduce:transition-none`,
        )}
        style={{ height: lineHeight }}
      >
        <div
          className={cn(
            "w-px origin-top bg-gradient-to-b from-darkMagenta to-goldAccent",
            reducedMotion || externalLineFill
              ? ""
              : "transition-transform duration-500 ease-out motion-reduce:transition-none",
          )}
          style={{ height: lineHeight, transform: `scaleY(${lineFill})` }}
        />
      </div>
    </div>
  );
};

export default VerticalScrollLine;
