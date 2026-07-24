"use client";

type MobileStickyFooterSpacerProps = {
  height: number;
};

/** Reserves document flow space above the fixed mobile sticky footer. */
export function MobileStickyFooterSpacer({ height }: MobileStickyFooterSpacerProps) {
  return (
    <div
      className="pointer-events-none w-full shrink-0 md:hidden"
      style={{ height, minHeight: height }}
      aria-hidden
    />
  );
}
