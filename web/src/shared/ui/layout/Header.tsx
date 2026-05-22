 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Search, Heart, User } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext";
import { siteConfig } from "@/shared/lib/siteConfig";
import { cn } from "@/shared/utils/cn";
import SDLogo from "@/assets/Icons/SDLogo";
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const pathname = usePathname() ?? "/";

  const isHome = pathname === "/";
  const overlay = isHome && !scrolled && !mobileMenuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-colors duration-300",
        overlay
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur-sm border-b border-border",
      )}
    >
      <div className="container relative flex items-center justify-between h-16 md:h-20">
        {/* Left: mobile hamburger | Desktop: logo + nav */}
       <div className="flex items-center gap-6 md:gap-4 lg:gap-6 xl:gap-10">
          <button
            className={cn("md:hidden p-2 -ml-2", textClass)}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Desktop logo (inline) */}
          <div className="hidden md:block">{Logo}</div>

          {/* Desktop nav inline next to logo */}
         <nav className="hidden md:flex items-center gap-7 md:gap-4 lg:gap-9" aria-label="Main navigation">
            {siteConfig.navigation.main.map((link) => (
              <Link
                key={link.label}
                href={link.to}
               className={cn(
  "lg:text-base md:text-15 text-sm font-gill font-normal leading-[130%] tracking-[-0.02em] uppercase transition-colors",
  textClass,
  hoverClass,
)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile centered logo */}
        <div className="md:hidden absolute left-1/2 -translate-x-1/2">
          {Logo}
        </div>

        {/* Right: icons */}
        <div className={cn("flex items-center gap-1 lg:gap-2", textClass)}>
          <button
            className={cn("p-2 transition-colors", hoverClass)}
            aria-label="Search"
          >
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

      {mobileMenuOpen && (
        <nav
          className="md:hidden border-t border-border bg-background px-6 py-6 space-y-4 animate-fade-in"
          aria-label="Mobile navigation"
        >
          {siteConfig.navigation.main.map((link) => (
            <Link
              key={link.label}
              href={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-body text-sm tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
