import { cn } from "@/shared/utils/cn";

type HeaderIconBadgeProps = {
  count: number;
  className?: string;
};

const HeaderIconBadge = ({ count, className }: HeaderIconBadgeProps) => {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "absolute flex items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground",
        "-right-1 -top-1 min-w-4 px-1 text-[9px] md:-right-0.5 md:-top-2 md:h-5 md:min-w-5 md:text-[10px]",
        className,
      )}
      aria-hidden
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};

export default HeaderIconBadge;
