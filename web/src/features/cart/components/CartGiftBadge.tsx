"use client";

import { useUiPlatform } from "@/shared/hooks/use-ui-platform";
import { cn } from "@/shared/utils/cn";

type CartGiftBadgeProps = {
  className?: string;
};

export const CartGiftBadge = ({ className }: CartGiftBadgeProps) => {
  const { windows } = useUiPlatform();

  return (
    <div
      className={cn(
        "flex h-[23px] items-center justify-center whitespace-nowrap bg-mauve300 px-3 py-1 font-gill text-sm font-normal text-darkblack",
        className,
      )}
    >
      <span className={cn("block leading-none", !windows && "translate-y-0.5")}>Gift</span>
    </div>
  );
};
