"use client";

import { useRef } from "react";
import { cn } from "@/shared/utils/cn";
import { useScrollProgressLine } from "../hooks/useScrollProgressLine";

type VerticalScrollLineProps = {
  className?: string;
};

const revealEase = "duration-700 ease-reveal";

const VerticalScrollLine = ({ className }: VerticalScrollLineProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lineFill, visible, reducedMotion } = useScrollProgressLine(sectionRef);

  return (
    <div
      ref={sectionRef}
      className={cn("flex w-full justify-center bg-white", className)}
      aria-hidden
    >
      <div
        className={cn(
          "h-105 w-px overflow-hidden",
          visible ? "opacity-100" : "opacity-0",
          `transition-opacity ${revealEase} motion-reduce:transition-none`,
        )}
      >
        <div
          className={cn(
            "h-105 w-px origin-top bg-gradient-to-b from-darkMagenta to-goldAccent",
            reducedMotion ? "" : "transition-transform duration-500 ease-out motion-reduce:transition-none",
          )}
          style={{ transform: `scaleY(${lineFill})` }}
        />
      </div>
    </div>
  );
};

export default VerticalScrollLine;
