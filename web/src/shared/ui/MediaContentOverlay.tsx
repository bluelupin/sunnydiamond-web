import { cn } from "@/shared/utils/cn";

type MediaContentOverlayProps = {
  /** Uniform scrim, e.g. 0.3 → rgba(0,0,0,0.3) */
  solidOpacity?: number;
  /** Bottom gradient for white text legibility */
  gradient?: "bottom" | "bottom-strong";
  className?: string;
};

/**
 * Scrim / gradient layer between media (image or video) and foreground content.
 * Always `pointer-events-none` and `aria-hidden`.
 */
const MediaContentOverlay = ({
  solidOpacity,
  gradient,
  className,
}: MediaContentOverlayProps) => {
  if (solidOpacity === undefined && !gradient) {
    return null;
  }

  return (
    <>
      {solidOpacity !== undefined ? (
        <div
          aria-hidden
          className={cn("pointer-events-none absolute inset-0 bg-black", className)}
          style={{ opacity: solidOpacity }}
        />
      ) : null}
      {gradient === "bottom" ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent",
            className,
          )}
        />
      ) : null}
      {gradient === "bottom-strong" ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-t from-darkblack/85 via-darkblack/35 to-transparent",
            className,
          )}
        />
      ) : null}
    </>
  );
};

export default MediaContentOverlay;
