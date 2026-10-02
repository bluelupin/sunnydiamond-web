import { cn } from "@/shared/utils/cn";

/** Footer fade height — rounded from 71px Figma spec to 72px. */
export const PANEL_FOOTER_GRADIENT_HEIGHT = 72;

/** Shared with panel scroll bodies so footer, header, and content align (Figma price breakup). */
export const panelFooterHorizontalPaddingClassName = "px-4";

export const panelFooterContentPaddingClassName = cn(
  panelFooterHorizontalPaddingClassName,
  "py-6",
);

const panelFooterContentClassName = cn(
  "border-t border-neutral300/50 bg-white",
  panelFooterContentPaddingClassName,
);

type PanelFooterGradientProps = {
  className?: string;
  /** Overlays the bottom of the scroll area above a sticky footer. */
  overlay?: boolean;
};

export function PanelFooterGradient({ className, overlay }: PanelFooterGradientProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none h-72 bg-gradient-to-b from-white/0 to-white",
        overlay ? "absolute bottom-full left-0 z-10 w-full" : "shrink-0",
        className,
      )}
    />
  );
}

/** Horizontal row for paired panel footer actions (e.g. Clear + Apply). */
export const panelFooterDualActionsClassName = "flex w-full gap-6";

type PanelFooterDualActionsProps = {
  children: React.ReactNode;
  className?: string;
};

export function PanelFooterDualActions({ children, className }: PanelFooterDualActionsProps) {
  return <div className={cn(panelFooterDualActionsClassName, className)}>{children}</div>;
}

type PanelFooterProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  showGradient?: boolean;
  footerRef?: React.Ref<HTMLDivElement>;
};

export function PanelFooter({
  children,
  className,
  contentClassName,
  showGradient = true,
  footerRef,
}: PanelFooterProps) {
  return (
    <div ref={footerRef} className={cn("relative shrink-0", className)}>
      {showGradient ? <PanelFooterGradient overlay /> : null}
      <div className={cn(panelFooterContentClassName, contentClassName)}>{children}</div>
    </div>
  );
}
