import { cn } from "@/shared/utils/cn";

export const PANEL_FOOTER_GRADIENT_HEIGHT = 71;

const panelFooterContentClassName =
  "border-t border-neutral300/50 bg-white px-4 py-6 lg:px-8";

export function PanelFooterGradient({
  className,
  position = "footer",
}: {
  className?: string;
  position?: "footer" | "overlay";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none z-10 bg-gradient-to-b from-white/0 to-white",
        position === "footer" ? "absolute inset-x-0 bottom-full" : "absolute inset-x-0 bottom-0",
        className,
      )}
      style={{ height: PANEL_FOOTER_GRADIENT_HEIGHT }}
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
      <PanelFooterGradient />
      <div className={cn("relative z-20", panelFooterContentClassName, contentClassName)}>
        {children}
      </div>
    </div>
  );
}
