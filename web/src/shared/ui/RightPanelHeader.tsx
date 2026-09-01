"use client";

import { cn } from "@/shared/utils/cn";
import {
  RIGHT_PANEL_CONTENT_PADDING_CLASS,
  RIGHT_PANEL_HEADER_PADDING_CLASS,
} from "./rightPanel";
import { RightPanelCloseButton } from "./RightPanelCloseButton";

type RightPanelHeaderProps = {
  title: string;
  onClose: () => void;
  closeAriaLabel: string;
  className?: string;
  /** Match title + divider inset to panel body (px-4 lg:px-6) instead of md:px-10 header padding. */
  alignWithContent?: boolean;
};

export function RightPanelHeader({
  title,
  onClose,
  closeAriaLabel,
  className,
  alignWithContent = false,
}: RightPanelHeaderProps) {
  const wrapperPadding = alignWithContent
    ? cn("md:pt-10 pt-6", RIGHT_PANEL_CONTENT_PADDING_CLASS)
    : RIGHT_PANEL_HEADER_PADDING_CLASS;

  return (
    <div className={cn("w-full shrink-0", wrapperPadding, className)}>
      <div className="flex h-[26px] items-center justify-between">
        <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">{title}</h2>
        <RightPanelCloseButton onClick={onClose} aria-label={closeAriaLabel} />
      </div>
      <div className="mt-6 h-px w-full bg-neutral300" aria-hidden />
    </div>
  );
}
