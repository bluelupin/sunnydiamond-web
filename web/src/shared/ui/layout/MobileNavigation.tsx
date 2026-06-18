"use client";

import { Fragment, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import SDLogo from "@/assets/Icons/SDLogo";
import { resolveHeaderNavHref } from "@/shared/utils/navigation";
import type { HeaderNavLink } from "@/shared/lib/shellNavigation";

type MobileNavigationProps = {
  isOpen: boolean;
  onClose: () => void;
  navLinks: HeaderNavLink[];
  cartCount: number;
};

const EXCLUDED_MOBILE_NAV_LABELS = new Set(["collection"]);

const NavChevron = () => (
  <Image
    src="/images/navigation/chevron-right.svg"
    alt=""
    width={24}
    height={24}
    aria-hidden
    className="-scale-y-100 shrink-0"
  />
);

const NavDivider = () => <div className="h-px w-full bg-[#ECE9E9]" aria-hidden />;

type MobileNavRowProps = {
  label: string;
  href: string;
  onNavigate: () => void;
};

const MobileNavRow = ({ label, href, onNavigate }: MobileNavRowProps) => (
  <Link
    href={href}
    onClick={onNavigate}
    className="flex h-6 w-full items-center justify-between"
  >
    <span className="font-gill text-sm uppercase leading-110 text-darkblack">{label}</span>
    <NavChevron />
  </Link>
);

type UtilityRowProps = {
  iconSrc: string;
  iconSize: number;
  label: string;
  href?: string;
  value?: string;
  onNavigate?: () => void;
};

const UtilityRow = ({ iconSrc, iconSize, label, href, value, onNavigate }: UtilityRowProps) => {
  const content = (
    <>
      <span className="flex min-w-0 items-center gap-1">
        <Image src={iconSrc} alt="" width={iconSize} height={iconSize} aria-hidden className="shrink-0" />
        <span className="font-gill text-sm leading-110 text-darkblack">{label}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {value ? (
          <span className="font-gill text-sm font-light leading-110 text-darkblack">{value}</span>
        ) : null}
        <NavChevron />
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onNavigate} className="flex h-6 w-full items-center justify-between">
        {content}
      </Link>
    );
  }

  return <div className="flex h-6 w-full items-center justify-between">{content}</div>;
};

const MobileNavigation = ({ isOpen, onClose, navLinks, cartCount }: MobileNavigationProps) => {
  const mobileNavLinks = navLinks.filter(
    (link) => !EXCLUDED_MOBILE_NAV_LABELS.has(link.label.trim().toLowerCase()),
  );

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-white md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-4">
        <div className="flex w-[120px] items-center">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex size-6 items-center justify-center"
          >
            <Image
              src="/images/navigation/menu-close.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden
            />
          </button>
        </div>

        <Link href="/" aria-label="Sunny Diamonds home" onClick={onClose} className="h-16 w-20 shrink-0">
          <SDLogo className="!h-16 !w-20 text-darkMagenta" />
        </Link>

        <div className="flex w-[112px] items-center justify-end gap-5">
          <Link href="/products" aria-label="Wishlist" onClick={onClose} className="inline-flex size-6 items-center justify-center">
            <Heart size={24} strokeWidth={1.5} />
          </Link>
          <Link href="/contact" aria-label="Account" onClick={onClose} className="inline-flex size-6 items-center justify-center">
            <User size={24} strokeWidth={1.5} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            onClick={onClose}
            className="relative inline-flex size-6 items-center justify-center"
          >
            <ShoppingBag size={24} strokeWidth={1.5} />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4">
        <div className="mt-2 flex h-[46px] w-full items-center gap-2 border border-aboutInactive bg-aboutInactive p-3">
          <Search size={16} strokeWidth={1.5} aria-hidden className="shrink-0 text-darkblack" />
          <span className="font-gill text-sm font-light leading-110 text-darkblack">
            What are you looking for ?
          </span>
        </div>

        <nav aria-label="Main navigation" className="mt-6 flex w-full flex-col gap-4">
          {mobileNavLinks.map((link, index) => (
            <Fragment key={link.label}>
              <MobileNavRow
                label={link.label}
                href={resolveHeaderNavHref(link.label, link.url)}
                onNavigate={onClose}
              />
              {index < mobileNavLinks.length - 1 ? <NavDivider /> : null}
            </Fragment>
          ))}
        </nav>
      </div>

      <div className="shrink-0 bg-gray200 px-4 py-6">
        <div className="flex flex-col gap-3">
          <UtilityRow
            iconSrc="/images/navigation/appointment.svg"
            iconSize={20}
            label="Book an Appointment"
            href="/book-an-appointment"
            onNavigate={onClose}
          />
          <NavDivider />
          <UtilityRow
            iconSrc="/images/navigation/currency.svg"
            iconSize={20}
            label="Currency"
            value="India · ₹ INR"
          />
          <NavDivider />
          <UtilityRow
            iconSrc="/images/navigation/globe.svg"
            iconSize={24}
            label="Language"
            value="English"
          />
          <NavDivider />
          <UtilityRow
            iconSrc="/images/navigation/map.svg"
            iconSize={24}
            label="Find a Store"
            href="/store-locator"
            onNavigate={onClose}
          />
        </div>

        <div className="mt-40 flex items-center justify-center gap-2">
          <Image
            src="/images/navigation/footer-star.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden
            className="shrink-0"
          />
          <p className="font-gill text-sm leading-110 text-[#AB863B]">
            Handicrafted Brilliance. Since 1989.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
