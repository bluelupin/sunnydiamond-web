"use client";

import { getProfileAvatarInitial } from "../utils/formatAccountData";
import { useUiPlatform } from "@/shared/hooks/use-ui-platform";
import { cn } from "@/shared/utils/cn";

type ProfileAvatarProps = {
  firstName: string;
  className?: string;
};

export function ProfileAvatar({ firstName, className }: ProfileAvatarProps) {
  const { windows } = useUiPlatform();
  const initial = getProfileAvatarInitial(firstName);

  return (
    <div
      className={cn(
        "flex size-[60px] shrink-0 items-center justify-center rounded-full bg-lightGold md:size-[90px]",
        className,
      )}
      aria-label={`${firstName.trim() || "Profile"} avatar`}
    >
      <span
        className={cn(
          "block font-gill text-[28px] font-normal leading-none text-darkblack md:text-[40px]",
          !windows && "translate-y-0.5",
        )}
      >
        {initial}
      </span>
    </div>
  );
}
