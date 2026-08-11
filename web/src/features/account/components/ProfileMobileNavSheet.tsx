"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SDLogo from "@/assets/Icons/SDLogo";
import ShoppingBagIcon from "@/assets/Icons/ShoppingBagIcon";
import WishlistNavLink from "@/features/wishlist/components/WishlistNavLink";
import { AccountAvatarIcon } from "@/features/auth/components/AccountAvatarIcon";
import { useAuth } from "@/features/auth/context/AuthContext";
import HeaderIconBadge from "@/shared/ui/layout/HeaderIconBadge";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";
import {
  DEFAULT_PROFILE_SECTION,
  PROFILE_NAV_ITEMS,
  type ProfileNavItem,
} from "../data/profileSections";
import type { ProfileSectionId } from "../types";

type ProfileMobileNavSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSection?: ProfileSectionId;
  onSectionChange?: (section: ProfileSectionId) => void;
  cartCount?: number;
};

const NavChevron = () => (
  <span className="inline-flex size-6 shrink-0 items-center justify-center">
    <Image
      src="/icons/chevron-right.svg"
      alt=""
      width={7}
      height={15}
      aria-hidden
      className="-scale-y-100"
    />
  </span>
);

const NavDivider = () => <div className="h-px w-full bg-neutral300" aria-hidden />;

type ProfileNavSheetHeaderProps = {
  onClose: () => void;
  cartCount: number;
  firstName: string;
};

function ProfileNavSheetHeader({ onClose, cartCount, firstName }: ProfileNavSheetHeaderProps) {
  return (
    <div className="flex h-16 shrink-0 items-center justify-between gap-4 px-4">
      <div className="flex w-[120px] items-center">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close profile menu"
          className="inline-flex size-6 items-center justify-center"
        >
          <Image
            src="/icons/menu-close.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden
          />
        </button>
      </div>

      <Link
        href="/"
        aria-label="Sunny Diamonds home"
        onClick={onClose}
        className="h-16 w-20 shrink-0"
      >
        <SDLogo className="!h-16 !w-20 text-darkMagenta" />
      </Link>

      <div className="flex w-[112px] items-center justify-end gap-6">
        <WishlistNavLink
          onNavigate={onClose}
          className="relative inline-flex size-6 items-center justify-center"
        />
        <span className="inline-flex size-6 items-center justify-center" aria-hidden>
          <AccountAvatarIcon firstName={firstName} />
        </span>
        <Link
          href="/cart"
          aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart"}
          onClick={onClose}
          className="relative inline-flex size-6 items-center justify-center"
        >
          <ShoppingBagIcon className="size-6" />
          <HeaderIconBadge count={cartCount} />
        </Link>
      </div>
    </div>
  );
}

export function ProfileMobileNavSheet({
  open,
  onOpenChange,
  activeSection,
  onSectionChange,
  cartCount = 0,
}: ProfileMobileNavSheetProps) {
  const router = useRouter();
  const { customer } = useAuth();

  const handleNavItem = (item: ProfileNavItem) => {
    onOpenChange(false);

    if (item.kind === "link") {
      router.push(item.href);
      return;
    }

    if (onSectionChange) {
      onSectionChange(item.id);
      return;
    }

    const params = new URLSearchParams();
    if (item.id !== DEFAULT_PROFILE_SECTION) {
      params.set("section", item.id);
    }

    const query = params.toString();
    router.push(query ? `/profile?${query}` : "/profile");
  };

  if (!customer) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        overlayClassName="bg-[rgba(30,30,30,0.3)] backdrop-blur-[10px]"
        className="h-auto max-h-[min(553px,100%)] w-full max-w-full gap-0 rounded-none border-0 bg-white p-0 shadow-none sm:max-w-full data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top [&>button]:hidden"
      >
        <SheetTitle className="sr-only">Profile navigation</SheetTitle>
        <ProfileNavSheetHeader
          onClose={() => onOpenChange(false)}
          cartCount={cartCount}
          firstName={customer.firstname}
        />

        <nav aria-label="Profile sections" className="flex flex-col gap-4 px-4 pb-8">
          {PROFILE_NAV_ITEMS.map((item, index) => {
            const key = item.kind === "link" ? item.href : item.id;
            const isActive = item.kind === "section" && item.id === activeSection;

            return (
              <div key={key} className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => handleNavItem(item)}
                  aria-current={isActive ? "page" : undefined}
                  className="flex w-full items-center justify-between text-left font-gill text-base font-normal leading-110 text-darkblack"
                >
                  <span>{item.label}</span>
                  <NavChevron />
                </button>
                {index < PROFILE_NAV_ITEMS.length - 1 ? <NavDivider /> : null}
              </div>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
