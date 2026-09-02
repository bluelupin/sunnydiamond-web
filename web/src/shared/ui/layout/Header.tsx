"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/features/cart/context/CartContext";
import WishlistNavLink from "@/features/wishlist/components/WishlistNavLink";
import { siteConfig } from "@/shared/lib/siteConfig";
import { cn } from "@/shared/utils/cn";
import SDLogo from "@/assets/Icons/SDLogo";
import SearchIcon from "@/assets/Icons/SearchIcon";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import {
  resolveHeaderNavHref,
  getHeaderSurfaceClass,
  getHeaderVariant,
  isAuthRoute,
  isHeroOverlayRoute,
  isJewelleryNavLink,
} from "@/shared/utils/navigation";
import { usePageLoading } from "@/shared/context/PageLoadingContext";
import MobileThemeColor from "@/shared/ui/layout/MobileThemeColor";
import { resolveShellHeaderLinks, splitShellHeaderNavLinks } from "@/shared/lib/shellNavigation";
import MobileNavigation from "@/shared/ui/layout/MobileNavigation";
import ShoppingBagIcon from "@/assets/Icons/ShoppingBagIcon";
import AccountMenu from "@/features/auth/components/AccountMenu";
import { ProfileMobileNavSheet } from "@/features/account/components/ProfileMobileNavSheet";
import { mapProfileNavItems } from "@/services/profile/profile-page.mapper";
import { useProfilePageCms } from "@/shared/lib/providers/ProfilePageCmsProvider";
import MenuIcon from "@/assets/Icons/MenuIcon";
import HeaderIconBadge from "@/shared/ui/layout/HeaderIconBadge";
import { useCanHover } from "@/shared/hooks/use-can-hover";
import { useMobileHeaderLayout } from "@/shared/hooks/use-mobile-header-layout";
import { useCareersHeaderMode } from "@/features/careers/context/careersHeaderBridge";
import {
  CAREERS_ALL_OPENINGS_ROUTE,
  CAREERS_ROUTE,
} from "@/features/careers/constants/careersRoutes";

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

const SEARCH_HREF = "/coming-soon";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileNavOpen, setProfileNavOpen] = useState(false);
  const [jewelleryMenuOpen, setJewelleryMenuOpen] = useState(false);
  const [jewelleryMenuMounted, setJewelleryMenuMounted] = useState(false);
  const jewelleryMenuMountedRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { totalItems: cartCount } = useCart();
  const pathname = usePathname() ?? "/";
  const canHoverNav = useCanHover();
  const isMobileHeader = useMobileHeaderLayout();

  const openProfileNav = useCallback(() => {
    setProfileNavOpen(true);
  }, []);

  const { isPageLoading } = usePageLoading();
  const careersHeaderMode = useCareersHeaderMode(pathname);

  const isAuthPage = isAuthRoute(pathname);
  const menuOpen = mobileMenuOpen || jewelleryMenuOpen;
  const headerHidden = mobileMenuOpen || profileNavOpen;
  const pathnameHeaderVariant = getHeaderVariant(pathname, { menuOpen });
  const isCareersHeaderManagedRoute =
    pathname === CAREERS_ROUTE || pathname === CAREERS_ALL_OPENINGS_ROUTE;
  const headerVariant =
    isCareersHeaderManagedRoute && careersHeaderMode === "solid"
      ? "solid"
      : pathnameHeaderVariant;
  const isLoadingHeader = isPageLoading && isHeroOverlayRoute(pathname) && !menuOpen;
  const headerSurfaceClass = isLoadingHeader
    ? "bg-white"
    : getHeaderSurfaceClass(pathname, headerVariant);
  const isOverlay = headerVariant === "overlay";
  const isLightOverlay = !isLoadingHeader && isOverlay && !isAuthPage;
  const themeHeaderVariant = isLoadingHeader ? "solid" : headerVariant;

  const { data: shellData } = useHomepageShell();
  const profilePage = useProfilePageCms();
  const profileNavItems = useMemo(
    () => mapProfileNavItems(profilePage?.sideTabs ?? []),
    [profilePage?.sideTabs],
  );
  const headerNavigationLinks = useMemo(() => {
    const cmsLinks = shellData?.global?.headerNavigationLinks || shellData?.headerNavigationLinks;
    return resolveShellHeaderLinks(cmsLinks);
  }, [shellData]);
  const { primaryLinks, appointmentLink } = useMemo(
    () => splitShellHeaderNavLinks(headerNavigationLinks),
    [headerNavigationLinks],
  );

  useLayoutEffect(() => {
    setMobileMenuOpen(false);
    setJewelleryMenuOpen(false);
    setJewelleryMenuMounted(false);
    jewelleryMenuMountedRef.current = false;
  }, [pathname]);

  const openJewelleryMenu = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    preloadJewelleryMegaMenu();

    if (!jewelleryMenuMountedRef.current) {
      jewelleryMenuMountedRef.current = true;
      setJewelleryMenuMounted(true);
      setJewelleryMenuOpen(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setJewelleryMenuOpen(true));
      });
      return;
    }

    setJewelleryMenuOpen(true);
  }, []);

  const scheduleCloseJewelleryMenu = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setJewelleryMenuOpen(false), 150);
  }, []);

  const closeJewelleryMenuNow = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setJewelleryMenuOpen(false);
  }, []);

  const toggleJewelleryMenu = useCallback(() => {
    if (jewelleryMenuOpen) {
      closeJewelleryMenuNow();
      return;
    }
    openJewelleryMenu();
  }, [closeJewelleryMenuNow, jewelleryMenuOpen, openJewelleryMenu]);

  const showJewelleryMenuLayer = jewelleryMenuMounted;

  const handleJewelleryNavClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (canHoverNav) return;
      event.preventDefault();
      toggleJewelleryMenu();
    },
    [canHoverNav, toggleJewelleryMenu],
  );

  const textClass = isLightOverlay ? "text-white" : "text-darkblack";
  const logoClass = isLightOverlay ? "text-white" : isAuthPage ? "text-darkblack" : "text-darkMagenta";
  const hoverClass = isLightOverlay ? "hover:text-linkGold" : "hover:text-linkGold";
  const navLinkClass = (active = false) =>
    cn(
      "inline-flex items-center font-gill uppercase transition-colors",
      "text-sm font-normal leading-[130%] tracking-[-0.02em]",
      "lg:text-sm lg:font-semibold lg:leading-110 lg:tracking-normal",
      active ? (isLightOverlay ? "text-primary" : "text-darkblack") : textClass,
      !active ? hoverClass : "",
    );

  const Logo = (
    <Link
      href="/"
      aria-label={siteConfig.brand.name}
      className={cn("inline-flex shrink-0 items-center justify-center leading-none", logoClass)}
    >
      <SDLogo className="!h-16 !w-20 md:landscape:!h-14 md:landscape:!w-14 lg:landscape:!h-[62px] lg:landscape:!w-[62px]" />
    </Link>
  );

  return (
    <>
      <MobileThemeColor pathname={pathname} headerVariant={themeHeaderVariant} />
      <header
        className={cn(
          "absolute top-0 inset-x-0 z-50",
          headerHidden ? "pointer-events-none opacity-0" : "",
        )}
        aria-hidden={headerHidden}
      >
        <div
          className={cn(
            "w-full max-md:pt-[env(safe-area-inset-top,0px)] md:max-desktop:portrait:pt-[env(safe-area-inset-top,0px)] md:landscape:pt-0",
            headerSurfaceClass,
          )}
        >
          {/* Figma 692:6742 — solid PDP header: white bg, py-24, dark nav; mobile bar 64px */}
          <div className="relative mx-auto flex h-16 w-full max-w-1440 items-center justify-between px-5 md:landscape:h-[104px] md:landscape:px-8 md:landscape:pt-0 lg:landscape:px-10 lg:landscape:py-6 2xl:max-w-1920 2xl:landscape:px-[60px]">
            <div className="flex w-[120px] items-center gap-6 md:landscape:hidden">
              <button
                type="button"
                className={cn(iconButtonClass, textClass, hoverClass)}
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
              >
                <MenuIcon className="size-6" />
              </button>
              <Link
                href={SEARCH_HREF}
                className={cn(iconButtonClass, textClass, hoverClass)}
                aria-label="Search"
              >
                <SearchIcon className="size-6" />
              </Link>
            </div>
            <div className="hidden md:landscape:flex md:landscape:items-center md:landscape:gap-4 lg:landscape:gap-10">
              {Logo}
              <nav className="hidden items-center md:landscape:flex md:landscape:gap-4 lg:landscape:gap-10" aria-label="Main navigation">
                {primaryLinks.map((link) => {
                  const isJewellery = isJewelleryNavLink(link.label);
                  if (isJewellery) {
                    return (
                      <div
                        key={link.id ?? link.label}
                        className="inline-flex items-center"
                        onMouseEnter={canHoverNav ? openJewelleryMenu : undefined}
                        onMouseLeave={canHoverNav ? scheduleCloseJewelleryMenu : undefined}
                      >
                        <Link
                          href={resolveHeaderNavHref(link.label, link.url)}
                          className={navLinkClass(jewelleryMenuOpen)}
                          aria-expanded={jewelleryMenuOpen}
                          aria-haspopup="true"
                          onClick={handleJewelleryNavClick}
                        >
                          {link.label}
                        </Link>
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={link.id ?? link.label}
                      href={resolveHeaderNavHref(link.label, link.url)}
                      className={navLinkClass()}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                {appointmentLink ? (
                  <Link
                    href={resolveHeaderNavHref(appointmentLink.label, appointmentLink.url)}
                    className={navLinkClass()}
                  >
                    {appointmentLink.label}
                  </Link>
                ) : null}
              </nav>
            </div>
            <div className="pointer-events-none absolute inset-x-0 flex justify-center md:landscape:hidden">
              <div className="pointer-events-auto">{Logo}</div>
            </div>
            <div className={cn("relative z-10 flex items-center gap-6 lg:gap-[24px]", textClass)}>
              <Link
                href={SEARCH_HREF}
                className={cn("!hidden md:landscape:!flex", iconButtonClass, hoverClass)}
                aria-label="Search"
              >
                <SearchIcon className="size-6" />
              </Link>

              <WishlistNavLink className={cn(iconButtonClass, hoverClass)} />

              <Link
                href="/cart"
                className={cn("relative md:!inline-flex !hidden", iconButtonClass, hoverClass)}
                aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart"}
              >
                <ShoppingBagIcon className="size-6" />
                <HeaderIconBadge count={cartCount} />
              </Link>

              <AccountMenu
                className={cn("inline-flex", iconButtonClass, hoverClass)}
                onProfileOpen={isMobileHeader ? openProfileNav : undefined}
              />
              <Link
                href="/cart"
                className={cn("relative md:!hidden !inline-flex", iconButtonClass, hoverClass)}
                aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart"}
              >
                <ShoppingBagIcon className="size-6" />
                <HeaderIconBadge count={cartCount} />
              </Link>
            </div>
          </div>

          {showJewelleryMenuLayer ? (
            <JewelleryMegaMenu
              open={jewelleryMenuOpen}
              onMouseEnter={canHoverNav ? openJewelleryMenu : undefined}
              onMouseLeave={canHoverNav ? scheduleCloseJewelleryMenu : undefined}
              onClose={closeJewelleryMenuNow}
            />
          ) : null}
        </div>
      </header>

      {showJewelleryMenuLayer ? (
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/50",
            "motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out",
            jewelleryMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={canHoverNav ? undefined : closeJewelleryMenuNow}
          onMouseEnter={canHoverNav ? scheduleCloseJewelleryMenu : undefined}
          aria-hidden={!jewelleryMenuOpen}
        />
      ) : null}

      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={primaryLinks}
        appointmentLink={appointmentLink}
        cartCount={cartCount}
        onProfileOpen={isMobileHeader ? openProfileNav : undefined}
      />

      <ProfileMobileNavSheet
        open={profileNavOpen}
        onOpenChange={setProfileNavOpen}
        navItems={profileNavItems}
        cartCount={cartCount}
      />
    </>
  );
};

export default Header;
