"use client";

import { getProfileAvatarInitial } from "@/features/account/utils/formatAccountData";
import { useUiPlatform } from "@/shared/hooks/use-ui-platform";
import { cn } from "@/shared/utils/cn";

type AccountAvatarIconProps = {
  firstName: string;
  className?: string;
};

/** Header account avatar with first-name initial. */
export function AccountAvatarIcon({ firstName, className }: AccountAvatarIconProps) {
  const initial = getProfileAvatarInitial(firstName);
  const { windows } = useUiPlatform();
  return (
    <div
      className={cn(
        "relative inline-flex size-6 shrink-0 overflow-hidden rounded-full bg-gold200 items-center justify-center font-gill text-sm font-normal text-darkblack",
        className,
      )}
      aria-hidden
    >
      <span className={cn("inline-flex items-center justify-center", !windows && "pt-1")}>
        {initial}
      </span>
    </div>
  );
}
