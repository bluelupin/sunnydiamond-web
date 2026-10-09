"use client";

import { useUiPlatform } from "@/shared/hooks/use-ui-platform";
import { getProfileAvatarInitial } from "../utils/formatAccountData";
import { cn } from "@/shared/utils/cn";

type ProfileAvatarProps = {
  firstName: string;
  className?: string;
};

export function ProfileAvatar({ firstName, className }: ProfileAvatarProps) {
  const initial = getProfileAvatarInitial(firstName);
  const { windows } = useUiPlatform();
  return (
    <div
      className={cn(
        "flex size-[60px] shrink-0 items-center justify-center rounded-full bg-lightGold md:size-[90px]",
        className,
      )}
      aria-label={`${firstName.trim() || "Profile"} avatar`}
    >
      <span className={cn(!windows && "translate-y-[2px]", "inline-flex size-full items-center justify-center font-gill text-[28px] font-normal leading-none text-darkblack md:text-[40px]")}>
        {initial}
      </span>
    </div>
  );
}
