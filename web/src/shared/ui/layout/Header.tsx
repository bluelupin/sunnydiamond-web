"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, Search, Heart, User } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { siteConfig } from "@/shared/lib/siteConfig";
import { cn } from "@/shared/utils/cn";
import SDLogo from "@/assets/Icons/SDLogo";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import { resolveHeaderNavHref, isHeroOverlayRoute } from "@/shared/utils/navigation";
import { resolveShellHeaderLinks } from "@/shared/lib/shellNavigation";
import MobileNavigation from "@/shared/ui/layout/MobileNavigation";
import { JewelleryMegaMenu } from "@/shared/ui/layout/JewelleryMegaMenu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [jewelleryMenuOpen, setJewelleryMenuOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { totalItems } = useCart();
  const pathname = usePathname() ?? "/";

  const heroOverlayRoute = isHeroOverlayRoute(pathname);
  const overlay =
    heroOverlayRoute && !scrolled && !mobileMenuOpen && !jewelleryMenuOpen;

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
    setJewelleryMenuOpen(true);
  }, []);

  const scheduleCloseJewelleryMenu = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setJewelleryMenuOpen(false), 150);
  }, []);

  const closeJewelleryMenuNow = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setJewelleryMenuOpen(false);
  }, []);

  const textClass = overlay ? "text-white" : "text-darkblack";
  const hoverClass = overlay ? "hover:text-ivory/70" : "hover:text-primary";
  const Logo = (
    <Link
      href="/"
      aria-label={siteConfig.brand.name}
      className={cn(
        "flex items-center justify-center font-heading italic font-semibold leading-none",
        "text-3xl md:text-4xl",
        textClass,
      )}
    >
      <SDLogo />
    </Link>
  );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-colors duration-300",
          mobileMenuOpen ? "pointer-events-none opacity-0" : "",
          overlay
            ? "bg-transparent"
            : "bg-background/95 backdrop-blur-sm border-b border-border",
        )}
        aria-hidden={mobileMenuOpen}
      >
        <div className="container relative flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-6 md:gap-4 lg:gap-6 xl:gap-10">
            <button
              className={cn("md:hidden p-2 -ml-2", textClass)}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={22} />
            </button>

            <div className="hidden md:block">{Logo}</div>

            <nav className="hidden md:flex items-center gap-7 md:gap-4 lg:gap-9" aria-label="Main navigation">
              {headerNavigationLinks.map((link) => {
                const isJewellery = link.label.trim().toLowerCase() === "jewellery";
                if (isJewellery) {
                  return (
                    <div
                      key={link.label}
                      onMouseEnter={openJewelleryMenu}
                      onMouseLeave={scheduleCloseJewelleryMenu}
                    >
                      <Link
                        href={resolveHeaderNavHref(link.label, link.url)}
                        className={cn(
                          "lg:text-base md:text-15 text-sm font-gill font-normal leading-[130%] tracking-[-0.02em] uppercase transition-colors",
                          jewelleryMenuOpen ? "text-primary" : textClass,
                          !jewelleryMenuOpen ? hoverClass : "",
                        )}
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
                    className={cn(
                      "lg:text-base md:text-15 text-sm font-gill font-normal leading-[130%] tracking-[-0.02em] uppercase transition-colors",
                      textClass,
                      hoverClass,
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="md:hidden absolute left-1/2 -translate-x-1/2">{Logo}</div>

          <div className={cn("flex items-center gap-1 lg:gap-2", textClass)}>
            <button className={cn("p-2 transition-colors", hoverClass)} aria-label="Search">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link
              href="/products"
              className={cn("p-2 transition-colors", hoverClass)}
              aria-label="Wishlist"
            >
              <Heart size={20} strokeWidth={1.5} />
            </Link>
            <Link
              href="/cart"
              className={cn("p-2 transition-colors relative", hoverClass)}
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              href="/contact"
              className={cn("p-2 transition-colors hidden md:inline-flex", hoverClass)}
              aria-label="Account"
            >
              <User size={20} strokeWidth={1.5} />
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

      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={headerNavigationLinks}
        cartCount={totalItems}
      />
    </>
  );
};

export default Header;
