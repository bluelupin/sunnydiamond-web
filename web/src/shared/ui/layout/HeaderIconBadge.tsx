import { cn } from "@/shared/utils/cn";

type HeaderIconBadgeProps = {
  count: number;
  className?: string;
};

const HeaderIconBadge = ({ count, className }: HeaderIconBadgeProps) => {
  if (count <= 0) return null;

  const displayCount = count > 99 ? "99+" : String(count);
  const badgeSizeClass =
    displayCount.length === 1
      ? "size-[22px] text-[11px] md:size-5 md:text-[10px]"
      : displayCount.length === 2
        ? "size-[22px] text-[10px] md:size-5 md:text-[10px]"
        : "h-[22px] min-w-[24px] px-1 text-[8px] md:h-5 md:min-w-5 md:px-1 md:text-[10px]";

  return (
    <span
      className={cn(
        "absolute flex items-center justify-center rounded-full bg-darkblack font-semibold leading-none text-white",
        "-right-2 -top-1.5",
        badgeSizeClass,
        className,
      )}
      aria-hidden
    >
      {displayCount}
    </span>
  );
};

export default HeaderIconBadge;
