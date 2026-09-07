"use client";

import { type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

/** Outer shell: fixed footer below a scrollable header + body region. */
export const RIGHT_PANEL_SCROLL_LAYOUT_CLASS =
  "flex min-h-0 flex-1 flex-col overflow-hidden bg-white";

/** Scrollable header + body region for right panels and drawers. */
export const RIGHT_PANEL_SCROLL_AREA_CLASS =
  "relative min-h-0 flex-1 overflow-y-auto overscroll-contain DrawerVerticleScrollbar";

type RightPanelScrollLayoutProps = {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  scrollClassName?: string;
};

export function RightPanelScrollLayout({
  children,
  footer,
  className,
  scrollClassName,
}: RightPanelScrollLayoutProps) {
  return (
    <div className={cn(RIGHT_PANEL_SCROLL_LAYOUT_CLASS, className)}>
      <div className={cn(RIGHT_PANEL_SCROLL_AREA_CLASS, scrollClassName)}>{children}</div>
      {footer}
    </div>
  );
}
