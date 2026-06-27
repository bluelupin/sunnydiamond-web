import { cn } from "@/shared/utils/cn";

/** Footer fade height — rounded from 71px Figma spec to 72px. */
export const PANEL_FOOTER_GRADIENT_HEIGHT = 72;

const panelFooterContentClassName =
  "border-t border-neutral300/50 bg-white px-4 py-6 lg:px-8";

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

type PanelFooterProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export function PanelFooter({ children, className, contentClassName }: PanelFooterProps) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <PanelFooterGradient overlay />
      <div className={cn(panelFooterContentClassName, contentClassName)}>{children}</div>
    </div>
  );
}
