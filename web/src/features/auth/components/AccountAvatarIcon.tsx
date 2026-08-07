import { getProfileAvatarInitial } from "@/features/account/utils/formatAccountData";
import { cn } from "@/shared/utils/cn";

type AccountAvatarIconProps = {
  firstName: string;
  className?: string;
};

/** header account avatar with first-name initial */
export function AccountAvatarIcon({ firstName, className }: AccountAvatarIconProps) {
  const initial = getProfileAvatarInitial(firstName);

  return (
    <div
      className={cn(
        "relative inline-flex size-6 shrink-0 overflow-hidden rounded-full bg-lightGold items-center justify-center font-gill text-sm font-normal text-darkblack",
        className,
      )}
      aria-hidden
    >
      {initial}
    </div>
  );
}
