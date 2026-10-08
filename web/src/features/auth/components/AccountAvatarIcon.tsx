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
  const { platform } = useUiPlatform();
  const initial = getProfileAvatarInitial(firstName);

  return (
    <div
      className={cn(
        "relative inline-flex size-6 shrink-0 overflow-hidden rounded-full bg-gold200 items-center justify-center font-gill text-sm font-normal text-darkblack",
        className,
      )}
      aria-hidden
    >
      <span
        className={cn(
          "grid size-full place-items-center leading-none",
          platform === "other" && "translate-y-0.5",
        )}
      >
        {initial}
      </span>
    </div>
  );
}
