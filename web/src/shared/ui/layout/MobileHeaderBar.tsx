import Link from "next/link";
import { User } from "lucide-react";
import SDLogo from "@/assets/Icons/SDLogo";
import ShoppingBagIcon from "@/assets/Icons/ShoppingBagIcon";
import HeaderIconBadge from "@/shared/ui/layout/HeaderIconBadge";
import { cn } from "@/shared/utils/cn";

type MobileHeaderBarProps = {
  leading: React.ReactNode;
  cartCount: number;
  logoClassName?: string;
  iconClassName?: string;
  onNavigate?: () => void;
};

const MobileHeaderBar = ({
  leading,
  cartCount,
  logoClassName = "text-darkMagenta",
  iconClassName = "text-darkblack",
  onNavigate,
}: MobileHeaderBarProps) => {
  const iconButtonClass = cn(
    "inline-flex size-6 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2",
    iconClassName,
  );

  return (
    <div className="flex h-16 w-full shrink-0 items-center justify-between px-4 md:hidden">
      <div className="flex w-[120px] items-center gap-6">{leading}</div>

      <Link
        href="/"
        aria-label="Sunny Diamonds home"
        onClick={onNavigate}
        className={cn("inline-flex shrink-0 items-center justify-center leading-none", logoClassName)}
      >
        <SDLogo className="!h-16 !w-20" />
      </Link>

      <div className="flex w-[120px] items-center justify-end gap-6">
        <Link href="/contact" aria-label="Account" className={iconButtonClass} onClick={onNavigate}>
          <User size={24} strokeWidth={1.5} />
        </Link>

        <Link
          href="/cart"
          aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart"}
          className={cn("relative", iconButtonClass)}
          onClick={onNavigate}
        >
          <ShoppingBagIcon className="size-6" />
          <HeaderIconBadge count={cartCount} className="bg-darkblack text-white" />
        </Link>
      </div>
    </div>
  );
};

export default MobileHeaderBar;
