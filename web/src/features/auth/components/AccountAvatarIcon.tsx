import { getProfileAvatarInitial } from "@/features/account/utils/formatAccountData";
import { cn } from "@/shared/utils/cn";

type AccountAvatarIconProps = {
  firstName: string;
  className?: string;
};

/** Figma 1052:66381 — header account avatar with first-name initial */
export function AccountAvatarIcon({ firstName, className }: AccountAvatarIconProps) {
  const initial = getProfileAvatarInitial(firstName);

  return (
    <span
      className={cn(
        "relative inline-flex size-6 shrink-0 overflow-hidden rounded-full bg-lightGold",
        className,
      )}
      aria-hidden
    >
      <span
        className="absolute left-1/2 top-[calc(50%+0.5px)] flex w-[11px] -translate-x-1/2 -translate-y-1/2 flex-col justify-center font-gill text-sm font-normal leading-110 text-darkblack"
      >
        {initial}
      </span>
    </span>
  );
}
