"use client";

import ShoppingBagIcon from "@/assets/Icons/ShoppingBagIcon";
import { useUiPlatform } from "@/shared/hooks/use-ui-platform";
import { cn } from "@/shared/utils/cn";

type CartMoreItemsNoteProps = {
  count: number;
};

export const CartMoreItemsNote = ({ count }: CartMoreItemsNoteProps) => {
  const { windows } = useUiPlatform();

  return (
    <div className="flex w-full items-center">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center leading-none",
            !windows && "-translate-y-1",
          )}
          aria-hidden
        >
          <ShoppingBagIcon className="size-6 shrink-0" />
        </span>
        <p className="m-0 flex items-center font-gill text-base font-light leading-110 text-darkblack">
          Your bag contains {count} more {count === 1 ? "item" : "items"}
        </p>
      </div>
    </div>
  );
};
