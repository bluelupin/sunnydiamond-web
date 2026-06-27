import { cn } from "@/shared/utils/cn";

/** Footer fade height — rounded from 71px Figma spec to 72px. */
export const PANEL_FOOTER_GRADIENT_HEIGHT = 72;

const panelFooterContentClassName =
  "border-t border-neutral300/50 bg-white px-4 py-6 lg:px-8";

export function PanelFooterGradient({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none h-72 shrink-0 bg-gradient-to-b from-white/0 to-white",
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
    <div className={cn("flex shrink-0 flex-col", className)}>
      <PanelFooterGradient className="-mb-72" />
      <div className={cn(panelFooterContentClassName, contentClassName)}>{children}</div>
    </div>
  );
}
