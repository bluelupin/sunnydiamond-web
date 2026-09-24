"use client";

import { useUiPlatform } from "@/shared/hooks/use-ui-platform";
import { cn } from "@/shared/utils/cn";

export function HeroDiamondIcon() {
  const { windows } = useUiPlatform();

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center leading-none",
        !windows && "-translate-y-0.5",
      )}
      aria-hidden
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 shrink-0 md:h-6 md:w-6"
      >
        <path
          d="M7.25 3H17.75L23 9L12.5 20.25L2 9L7.25 3Z"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 3L12.5 19.5"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
