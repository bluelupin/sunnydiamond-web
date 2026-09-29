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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6 shrink-0">
            <path d="M19.4042 7.5H4.09102C3.90668 7.49998 3.72868 7.56734 3.59055 7.68942C3.45241 7.8115 3.36367 7.97986 3.34102 8.16281L2.00509 19.4128C1.99273 19.5184 2.00295 19.6254 2.03507 19.7267C2.06718 19.828 2.12046 19.9213 2.19138 20.0005C2.2623 20.0796 2.34923 20.1428 2.44641 20.1858C2.54359 20.2288 2.64881 20.2507 2.75509 20.25H20.7401C20.8464 20.2507 20.9516 20.2288 21.0488 20.1858C21.1459 20.1428 21.2329 20.0796 21.3038 20.0005C21.3747 19.9213 21.428 19.828 21.4601 19.7267C21.4922 19.6254 21.5024 19.5184 21.4901 19.4128L20.1542 8.16281C20.1315 7.97986 20.0428 7.8115 19.9046 7.68942C19.7665 7.56734 19.5885 7.49998 19.4042 7.5Z" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.99805 7.5V6.75C7.99805 5.75544 8.39314 4.80161 9.0964 4.09835C9.79966 3.39509 10.7535 3 11.748 3C12.7426 3 13.6964 3.39509 14.3997 4.09835C15.103 4.80161 15.498 5.75544 15.498 6.75V7.5" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="m-0 flex items-center font-gill text-base font-light leading-110 text-darkblack">
          Your bag contains {count} more {count === 1 ? "item" : "items"}
        </p>
      </div>
    </div>
  );
};
