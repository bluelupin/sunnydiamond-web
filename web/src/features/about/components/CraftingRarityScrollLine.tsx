"use client";

import { cn } from "@/shared/utils/cn";
import { craftingRarityLineSpec } from "../hooks/useCraftingRarityScrollReveal";

type CraftingRarityScrollLineProps = {
  className?: string;
  lineHeight?: number;
};

/** Vertical line driven by `useCraftingRarityScrollReveal` (Reveal V2 scroll-scrub). */
const CraftingRarityScrollLine = ({
  className,
  lineHeight = craftingRarityLineSpec.height,
}: CraftingRarityScrollLineProps) => (
  <div
    data-reveal-mask="line"
    className={cn("flex w-full justify-center overflow-hidden bg-white", className)}
    aria-hidden
  >
    <div
      data-reveal-line="wrapper"
      className="w-px overflow-hidden opacity-0"
      style={{ height: lineHeight }}
    >
      <div
        data-reveal-line="fill"
        className="w-px origin-top bg-gradient-to-b from-darkMagenta to-goldAccent"
        style={{ height: lineHeight, transform: "scaleY(0)" }}
      />
    </div>
  </div>
);

export default CraftingRarityScrollLine;
