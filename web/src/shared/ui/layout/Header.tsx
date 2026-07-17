"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, User } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { siteConfig } from "@/shared/lib/siteConfig";
import { cn } from "@/shared/utils/cn";
import SDLogo from "@/assets/Icons/SDLogo";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import { resolveHeaderNavHref, getHeaderVariant, isJewelleryNavLink } from "@/shared/utils/navigation";
import { resolveShellHeaderLinks } from "@/shared/lib/shellNavigation";
import MobileNavigation from "@/shared/ui/layout/MobileNavigation";
import ShoppingBagIcon from "@/assets/Icons/ShoppingBagIcon";
import MenuIcon from "@/assets/Icons/MenuIcon";
import HeaderIconBadge from "@/shared/ui/layout/HeaderIconBadge";

const JewelleryMegaMenu = dynamic(
  () =>
    import("@/shared/ui/layout/JewelleryMegaMenu").then((mod) => ({
      default: mod.JewelleryMegaMenu,
    })),
  { ssr: false, loading: () => null },
);

const preloadJewelleryMegaMenu = () => {
  void import("@/shared/ui/layout/JewelleryMegaMenu");
};

const iconButtonClass =
  "inline-flex size-6 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [jewelleryMenuOpen, setJewelleryMenuOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const pathname = usePathname() ?? "/";

  const menuOpen = mobileMenuOpen || jewelleryMenuOpen;
  const headerVariant = getHeaderVariant(pathname, { scrolled, menuOpen });
  const isOverlay = headerVariant === "overlay";

  const { data: shellData } = useHomepageShell();
  const headerNavigationLinks = useMemo(() => {
    const cmsLinks = shellData?.global?.headerNavigationLinks || shellData?.headerNavigationLinks;
    return resolveShellHeaderLinks(cmsLinks);
  }, [shellData]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setJewelleryMenuOpen(false);
  }, [pathname]);

  const openJewelleryMenu = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    preloadJewelleryMegaMenu();
    setJewelleryMenuOpen(true);
  }, []);

  const scheduleCloseJewelleryMenu = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setJewelleryMenuOpen(false), 150);
  }, []);

  const closeJewelleryMenuNow = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setJewelleryMenuOpen(false);
  }, []);

  const textClass = isOverlay ? "text-white" : "text-darkblack";
  const logoClass = isOverlay ? "text-white" : "text-darkMagenta";
  const hoverClass = isOverlay ? "hover:text-ivory/70" : "hover:text-neutral500";
  const navLinkClass = (active = false) =>
    cn(
      "inline-flex items-center font-gill uppercase transition-colors",
      "text-sm font-normal leading-[130%] tracking-[-0.02em]",
      "lg:text-sm lg:font-semibold lg:leading-110 lg:tracking-normal",
      active ? (isOverlay ? "text-primary" : "text-darkblack") : textClass,
      !active ? hoverClass : "",
    );

  const Logo = (
    <Link
      href="/"
      aria-label={siteConfig.brand.name}
      className={cn("inline-flex shrink-0 items-center justify-center leading-none", logoClass)}
    >
      <SDLogo className="!h-16 !w-20 md:!h-14 md:!w-14 lg:!h-[62px] lg:!w-[62px]" />
    </Link>
  );

  return (
    <>
      <header
        className={cn(
          "absolute top-0 inset-x-0 z-50 transition-colors duration-300",
          mobileMenuOpen ? "pointer-events-none opacity-0" : "",
          isOverlay ? "bg-transparent" : ["/cart", "/checkout"].includes(pathname)
            ? "bg-gray300"
            : "bg-white",
        )}
        aria-hidden={mobileMenuOpen}
      >
        {/* Figma 692:6742 — solid PDP header: white bg, py-24, dark nav; mobile bar 64px */}
        <div className="relative mx-auto flex h-16 w-full max-w-1440 items-center justify-between px-5 md:h-[104px] md:px-8 lg:px-10 lg:py-6 2xl:max-w-1920 2xl:px-[60px]">
          <div className="flex w-[120px] items-center gap-6 md:hidden">
            <button
              type="button"
              className={cn(iconButtonClass, textClass, hoverClass)}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <MenuIcon className="size-6" />
            </button>
            <button
              type="button"
              className={cn(iconButtonClass, textClass, hoverClass)}
              aria-label="Search"
            >
              <Search size={24} strokeWidth={1.5} />
            </button>
          </div>
          <div className="hidden md:flex md:items-center md:gap-4 lg:gap-10">
            {Logo}
            <nav className="hidden items-center md:flex md:gap-4 lg:gap-10" aria-label="Main navigation">
              {headerNavigationLinks.map((link) => {
                const isJewellery = isJewelleryNavLink(link.label);
                if (isJewellery) {
                  return (
                    <div
                      key={link.label}
                      className="inline-flex items-center"
                      onMouseEnter={openJewelleryMenu}
                      onMouseLeave={scheduleCloseJewelleryMenu}
                    >
                      <Link
                        href={resolveHeaderNavHref(link.label, link.url)}
                        className={navLinkClass(jewelleryMenuOpen)}
                      >
                        {link.label}
                      </Link>
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.label}
                    href={resolveHeaderNavHref(link.label, link.url)}
                    className={navLinkClass()}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="pointer-events-none absolute inset-x-0 flex justify-center md:hidden">
            <div className="pointer-events-auto">{Logo}</div>
          </div>
          <div className={cn("relative z-10 flex items-center gap-6 lg:gap-[24px]", textClass)}>
            <button
              type="button"
              className={cn("!hidden md:!flex", iconButtonClass, hoverClass)}
              aria-label="Search"
            >
              <Search size={24} strokeWidth={1.5} />
            </button>

            <Link
              href="/products"
              className={cn("relative inline-flex", iconButtonClass, hoverClass)}
              aria-label={
                wishlistCount > 0 ? `Wishlist, ${wishlistCount} items` : "Wishlist"
              }
            >
              <Heart size={24} strokeWidth={1.5} />
              <HeaderIconBadge count={wishlistCount} />
            </Link>

            <Link
              href="/contact"
              className={cn("inline-flex", iconButtonClass, hoverClass)}
              aria-label="Account"
            >
              <User size={24} strokeWidth={1.5} />
            </Link>

            <Link
              href="/cart"
              className={cn("relative inline-flex", iconButtonClass, hoverClass)}
              aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart"}
            >
              <ShoppingBagIcon className="size-6" />
              <HeaderIconBadge count={cartCount} />
            </Link>
          </div>
        </div>

        {jewelleryMenuOpen && (
          <JewelleryMegaMenu
            onMouseEnter={openJewelleryMenu}
            onMouseLeave={scheduleCloseJewelleryMenu}
            onClose={closeJewelleryMenuNow}
          />
        )}
      </header>

      {jewelleryMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onMouseEnter={scheduleCloseJewelleryMenu}
        />
      )}

      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={headerNavigationLinks}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />
    </>
  );
};

export default Header;
