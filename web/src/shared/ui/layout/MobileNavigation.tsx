"use client";

import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import SDLogo from "@/assets/Icons/SDLogo";
import SearchIcon from "@/assets/Icons/SearchIcon";
import WishlistNavLink from "@/features/wishlist/components/WishlistNavLink";
import AccountMenu from "@/features/auth/components/AccountMenu";
import { cn } from "@/shared/utils/cn";
import { resolveHeaderNavHref, isJewelleryNavLink } from "@/shared/utils/navigation";
import type { HeaderNavLink } from "@/shared/lib/shellNavigation";
import BookAnAppointmentPanel from "@/features/appointment/components/BookAnAppointmentPanel";
import BookStoreVisitPanel from "@/features/products/components/detail/BookStoreVisitPanel";
import ShoppingBagIcon from "@/assets/Icons/ShoppingBagIcon";
import HeaderIconBadge from "@/shared/ui/layout/HeaderIconBadge";
import { JewelleryCategoryMenu } from "@/shared/ui/layout/JewelleryCategoryMenu";
type MobileNavigationProps = {
  isOpen: boolean;
  onClose: () => void;
  navLinks: HeaderNavLink[];
  appointmentLink?: HeaderNavLink;
  cartCount: number;
  onProfileOpen?: () => void;
};

function scheduleEnterAnimation(onEnter: () => void) {
  let innerFrame = 0;
  const outerFrame = requestAnimationFrame(() => {
    innerFrame = requestAnimationFrame(onEnter);
  });
  return () => {
    cancelAnimationFrame(outerFrame);
    if (innerFrame) cancelAnimationFrame(innerFrame);
  };
}

type SubPanelId = "language" | "currency" | "appointment" | "jewellery" | "store-visit";

const MOBILE_NAV_TRANSITION_MS = 300;

const SEARCH_HREF = "/coming-soon";

function mobileNavShellMotionClass(visible: boolean) {
  return cn(
    "motion-safe:transform-gpu motion-safe:will-change-[opacity,transform] motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out",
    visible
      ? "motion-safe:translate-x-0 motion-safe:opacity-100"
      : "motion-safe:-translate-x-full motion-safe:opacity-0",
  );
}

function mobileNavSubPanelMotionClass(visible: boolean) {
  return cn(
    "motion-safe:transform-gpu motion-safe:will-change-[opacity,transform] motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out",
    visible
      ? "motion-safe:translate-x-0 motion-safe:opacity-100"
      : "motion-safe:translate-x-full motion-safe:opacity-0",
  );
}

function mobileNavBackdropMotionClass(visible: boolean) {
  return cn(
    "motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out",
    visible ? "opacity-100" : "opacity-0",
  );
}

const LANGUAGES = [
  { code: "en", label: "English", display: "English" },
  { code: "hi", label: "हिन्दी (Hindi)", display: "Hindi" },
  { code: "gu", label: "ગુજરાતી (Gujarati)", display: "Gujarati" },
  { code: "te", label: "తెలుగు (Telugu)", display: "Telugu" },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]["code"];

const CURRENCIES = [
  { code: "INR", country: "India", symbol: "₹", display: "India · ₹ INR" },
  { code: "USD", country: "United States", symbol: "$", display: "US · $ USD" },
  { code: "GBP", country: "United Kingdom", symbol: "£", display: "UK · £ GBP" },
  { code: "EUR", country: "European Union", symbol: "€", display: "EU · € EUR" },
] as const;

type CurrencyCode = (typeof CURRENCIES)[number]["code"];

type JewelleryPanelProps = {
  onBack: () => void;
  onClose: () => void;
};

const JewelleryPanel = ({ onBack, onClose }: JewelleryPanelProps) => (
  <div
    className="flex h-full w-full flex-col bg-white"
    role="dialog"
    aria-modal="true"
    aria-label="Jewellery categories"
  >
    <div className="flex shrink-0 items-center px-4 md:pt-6 pt-10">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="flex items-center gap-2"
      >
        <span className="inline-flex size-6 shrink-0 items-center justify-center">
          <Image
            src="/icons/chevron-right.svg"
            alt=""
            width={7}
            height={15}
            aria-hidden
            className="-scale-x-100"
          />
        </span>
        <span className="font-gill text-sm font-semibold uppercase leading-110 text-darkblack">
          Jewellery
        </span>
      </button>
    </div>

    <div className="mx-4 mt-4 h-px shrink-0 bg-aboutInactive" aria-hidden />

    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-6 pt-4">
      <JewelleryCategoryMenu variant="mobile" onClose={onClose} />
    </div>
  </div>
);

const NavChevron = () => (
  <span className="inline-flex size-6 shrink-0 items-center justify-center">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18L15.5 11.5L9 5" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

    {/* <Image
      src="/icons/chevron-right.svg"
      alt=""
      width={7}
      height={15}
      aria-hidden
      className="-scale-y-100"
    /> */}
  </span>
);
type NavDividerProps = {
  className?: string;
};

const NavDivider = ({ className = "" }: NavDividerProps) => (
  <div
    className={`h-px w-full bg-aboutInactive ${className}`}
    aria-hidden
  />
);

type MobileNavRowProps = {
  label: string;
  href: string;
  onNavigate: () => void;
  onOpenPanel?: () => void;
};

const MobileNavRow = ({ label, href, onNavigate, onOpenPanel }: MobileNavRowProps) => {
  if (onOpenPanel) {
    return (
      <button
        type="button"
        onClick={onOpenPanel}
        className="flex h-4 font-normal w-full items-center justify-between"
      >
        <span className="font-gill text-sm uppercase leading-110 text-darkblack">{label}</span>
        <NavChevron />
      </button>
    );
  }
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex h-4 font-normal w-full items-center justify-between"
    >
      <span className="font-gill text-sm uppercase leading-110 text-darkblack">{label}</span>
      <NavChevron />
    </Link>
  );
};

type UtilityRowProps = {
  iconSrc: string;
  iconW: number;
  iconH: number;
  label: string;
  href?: string;
  value?: string;
  onNavigate?: () => void;
  onClick?: () => void;
};

const UtilityRow = ({ iconSrc, iconW, iconH, label, href, value, onNavigate, onClick }: UtilityRowProps) => {
  const rowClassName = "flex min-h-6 w-full items-center justify-between gap-2 font-normal";

  const content = (
    <>
      <span className="flex min-w-0 items-center gap-2">
        <span className="inline-flex size-6 shrink-0 items-center justify-center">
          <Image src={iconSrc} alt="" width={iconW} height={iconH} aria-hidden className="shrink-0" />
        </span>
        <span className="whitespace-nowrap font-gill text-sm leading-110 text-darkblack">{label}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {value ? (
          <span className="whitespace-nowrap font-gill text-sm font-light leading-110 text-darkblack">{value}</span>
        ) : null}
        <NavChevron />
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onNavigate} className={rowClassName}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={rowClassName}>
        {content}
      </button>
    );
  }

  return <div className={rowClassName}>{content}</div>;
};

type LanguagePanelProps = {
  selected: LanguageCode;
  onBack: () => void;
  onClose: () => void;
  onApply: (lang: LanguageCode) => void;
};

const LanguagePanel = ({ selected, onBack, onClose, onApply }: LanguagePanelProps) => {
  const [draft, setDraft] = useState<LanguageCode>(selected);

  return (
    <div
      className="absolute inset-0 flex h-full w-full flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Language selection"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="flex items-center gap-2"
          >
            <span className="inline-flex size-6 shrink-0 items-center justify-center">
              <Image
                src="/icons/chevron-right.svg"
                alt=""
                width={7}
                height={15}
                aria-hidden
                className="-scale-x-100"
              />
            </span>
            <span className="font-larken text-2xl font-light leading-110 text-darkblack">
              Language
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
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

        <div className="mt-6 h-px w-full bg-aboutInactive" aria-hidden />

        <div className="mt-6 flex flex-col">
          {LANGUAGES.map((lang) => {
            const isSelected = draft === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setDraft(lang.code)}
                className={cn(
                  "flex h-14 w-full items-center px-3 text-left font-gill text-sm leading-110",
                  isSelected ? "bg-[#DECAA0] text-darkblack" : "text-[#999999]",
                )}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="shrink-0">
        <div className="pointer-events-none h-[71px] bg-gradient-to-b from-transparent to-white" aria-hidden />
        <div className="border-t border-[#CCCCCC]/50 bg-white px-4 py-6">
          <button
            type="button"
            onClick={() => onApply(draft)}
            className="flex h-14 w-full items-center justify-center bg-darkblack font-gill text-sm uppercase leading-110 text-white"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

type CurrencyPanelProps = {
  selected: CurrencyCode;
  onBack: () => void;
  onClose: () => void;
  onApply: (code: CurrencyCode) => void;
};

const CurrencyPanel = ({ selected, onBack, onClose, onApply }: CurrencyPanelProps) => {
  const [draft, setDraft] = useState<CurrencyCode>(selected);

  return (
    <div
      className="absolute inset-0 flex h-full w-full flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Region and currency selection"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="flex items-center gap-2"
          >
            <span className="inline-flex size-6 shrink-0 items-center justify-center">
              <Image
                src="/icons/chevron-right.svg"
                alt=""
                width={7}
                height={15}
                aria-hidden
                className="-scale-x-100"
              />
            </span>
            <span className="font-larken text-2xl font-light leading-110 text-darkblack">
              Region &amp; Currency
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
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

        <div className="mt-6 h-px w-full bg-aboutInactive" aria-hidden />

        <div className="mt-6 flex flex-col">
          {CURRENCIES.map((currency) => {
            const isSelected = draft === currency.code;
            return (
              <button
                key={currency.code}
                type="button"
                onClick={() => setDraft(currency.code)}
                className={cn(
                  "flex h-14 w-full items-center justify-between px-3 font-gill text-sm leading-110",
                  isSelected ? "bg-[#DECAA0] text-darkblack" : "text-[#999999]",
                )}
              >
                <span>{currency.country}</span>
                <span>{currency.symbol} {currency.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="shrink-0">
        <div className="pointer-events-none h-[71px] bg-gradient-to-b from-transparent to-white" aria-hidden />
        <div className="border-t border-[#CCCCCC]/50 bg-white px-4 py-6">
          <button
            type="button"
            onClick={() => onApply(draft)}
            className="flex h-14 w-full items-center justify-center bg-darkblack font-gill text-sm uppercase leading-110 text-white"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const MobileNavigation = ({
  isOpen,
  onClose,
  navLinks,
  appointmentLink,
  cartCount,
  onProfileOpen,
}: MobileNavigationProps) => {
  const [subPanel, setSubPanel] = useState<SubPanelId | null>(null);
  const [displayedSubPanel, setDisplayedSubPanel] = useState<SubPanelId | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubPanelVisible, setIsSubPanelVisible] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subPanelCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shellWasMountedRef = useRef(false);
  const displayedSubPanelRef = useRef<SubPanelId | null>(null);
  const isSubPanelVisibleRef = useRef(false);
  const cancelEnterAnimationRef = useRef<(() => void) | null>(null);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleApplyLanguage = useCallback((lang: LanguageCode) => {
    setLanguage(lang);
    setSubPanel(null);
  }, []);

  const handleApplyCurrency = useCallback((code: CurrencyCode) => {
    setCurrency(code);
    setSubPanel(null);
  }, []);

  const handleClose = useCallback(() => {
    setSubPanel(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      setSubPanel(null);
      setDisplayedSubPanel(null);
      displayedSubPanelRef.current = null;
      setIsSubPanelVisible(false);
      isSubPanelVisibleRef.current = false;
      setSearchQuery("");
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (isOpen) {
      const shouldAnimateEnter = !shellWasMountedRef.current;
      setIsRendered(true);
      shellWasMountedRef.current = true;

      if (shouldAnimateEnter) {
        setIsVisible(false);
        return scheduleEnterAnimation(() => setIsVisible(true));
      }

      setIsVisible(true);
      return;
    }

    setIsVisible(false);
    closeTimerRef.current = setTimeout(() => {
      setIsRendered(false);
      shellWasMountedRef.current = false;
      closeTimerRef.current = null;
    }, MOBILE_NAV_TRANSITION_MS);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    if (subPanelCloseTimerRef.current) {
      clearTimeout(subPanelCloseTimerRef.current);
      subPanelCloseTimerRef.current = null;
    }

    if (cancelEnterAnimationRef.current) {
      cancelEnterAnimationRef.current();
      cancelEnterAnimationRef.current = null;
    }

    if (subPanel) {
      const panelChanged = displayedSubPanelRef.current !== subPanel;

      if (panelChanged) {
        setDisplayedSubPanel(subPanel);
        displayedSubPanelRef.current = subPanel;
      }

      const resumingDuringClose =
        !panelChanged && displayedSubPanelRef.current === subPanel && !isSubPanelVisibleRef.current;

      if (resumingDuringClose) {
        setIsSubPanelVisible(true);
        isSubPanelVisibleRef.current = true;
        return;
      }

      if (panelChanged || !isSubPanelVisibleRef.current) {
        setIsSubPanelVisible(false);
        isSubPanelVisibleRef.current = false;
        cancelEnterAnimationRef.current = scheduleEnterAnimation(() => {
          setIsSubPanelVisible(true);
          isSubPanelVisibleRef.current = true;
          cancelEnterAnimationRef.current = null;
        });
        return () => {
          cancelEnterAnimationRef.current?.();
          cancelEnterAnimationRef.current = null;
        };
      }

      return;
    }

    if (!displayedSubPanelRef.current) return;

    setIsSubPanelVisible(false);
    isSubPanelVisibleRef.current = false;
    subPanelCloseTimerRef.current = setTimeout(() => {
      setDisplayedSubPanel(null);
      displayedSubPanelRef.current = null;
      subPanelCloseTimerRef.current = null;
    }, MOBILE_NAV_TRANSITION_MS);
  }, [isOpen, subPanel]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (subPanelCloseTimerRef.current) clearTimeout(subPanelCloseTimerRef.current);
      cancelEnterAnimationRef.current?.();
    };
  }, []);

  useEffect(() => {
    if (!isRendered) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isRendered]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  }, []);

  if (!isRendered) return null;

  const currentLangDisplay = LANGUAGES.find((l) => l.code === language)?.display ?? "English";
  const currentCurrencyDisplay = CURRENCIES.find((c) => c.code === currency)?.display ?? "India · ₹ INR";

  return (
    <>
      <button
        type="button"
        className={cn(
          "fixed inset-0 z-[59] bg-black/50 md:landscape:hidden",
          "hidden md:portrait:block",
          mobileNavBackdropMotionClass(isVisible),
        )}
        onClick={handleClose}
        aria-label="Close menu"
        aria-hidden={!isVisible}
        tabIndex={isVisible ? 0 : -1}
      />

      <div
        className={cn(
          "fixed z-[60] flex flex-col overflow-hidden overflow-x-hidden bg-white md:landscape:hidden",
          "inset-0",
          "md:portrait:inset-x-auto md:portrait:inset-y-0 md:portrait:left-0 md:portrait:w-[60%] md:portrait:max-w-[60%]",
          mobileNavShellMotionClass(isVisible),
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!isVisible}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4 gap-4">
          <div className="flex w-[120px] items-center gap-6">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close menu"
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
            <Link
              href={SEARCH_HREF}
              onClick={handleClose}
              aria-label="Search"
              className="inline-flex size-6 items-center justify-center"
            >
              <SearchIcon className="size-6 text-darkblack" />
            </Link>
          </div>

          <Link href="/" aria-label="Sunny Diamonds home" onClick={handleClose} className="h-16 w-20 shrink-0">
            <SDLogo className="!h-16 !w-20 text-darkMagenta" />
          </Link>

          <div className="flex w-[112px] items-center justify-end gap-6">
            <WishlistNavLink
              onNavigate={handleClose}
              className="relative inline-flex size-6 items-center justify-center"
            />
            <AccountMenu
              onNavigate={handleClose}
              onProfileOpen={onProfileOpen}
              className="inline-flex size-6 items-center justify-center"
            />
            <Link
              href="/cart"
              aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart"}
              onClick={handleClose}
              className="relative inline-flex size-6 items-center justify-center"
            >
              <ShoppingBagIcon className="size-6" />
              <HeaderIconBadge count={cartCount} />
            </Link>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4">
          <form
            role="search"
            className="mt-2 flex h-[46px] w-full items-center gap-2 border border-aboutInactive bg-aboutInactive p-3"
            onSubmit={(event) => event.preventDefault()}
          >
            <SearchIcon className="size-4 shrink-0 text-darkblack" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="What are you looking for ?"
              aria-label="Search"
              autoComplete="off"
              className="min-w-0 flex-1 appearance-none border-0 bg-transparent font-gill text-sm font-light leading-110 text-darkblack outline-none placeholder:font-gill placeholder:text-sm placeholder:font-light placeholder:leading-110 placeholder:text-darkblack"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
              >
                <X size={16} strokeWidth={1.5} aria-hidden />
              </button>
            ) : null}
          </form>

          <nav aria-label="Main navigation" className="mt-6 flex w-full flex-col gap-4">
            {navLinks.map((link, index) => {
              const isJewellery = isJewelleryNavLink(link.label);
              return (
                <Fragment key={link.id ?? link.label}>
                  <MobileNavRow
                    label={link.label}
                    href={resolveHeaderNavHref(link.label, link.url)}
                    onNavigate={handleClose}
                    onOpenPanel={isJewellery ? () => setSubPanel("jewellery") : undefined}
                  />
                  {index < navLinks.length - 1 ? <NavDivider /> : null}
                </Fragment>
              );
            })}
          </nav>
        </div>

        <div className="shrink-0 bg-gray200 px-4 py-6">
          <div className="flex flex-col gap-3">
            {appointmentLink ? (
              <>
                <UtilityRow
                  iconSrc="/icons/appointment.svg"
                  iconW={20}
                  iconH={20}
                  label={appointmentLink.label}
                  onClick={() => setSubPanel("appointment")}
                />
                <NavDivider className="bg-chalk300" />
              </>
            ) : null}
            <UtilityRow
              iconSrc="/icons/currency.svg"
              iconW={20}
              iconH={20}
              label="Currency"
              value={currentCurrencyDisplay}
              onClick={() => setSubPanel("currency")}
            />
            <NavDivider className="bg-chalk300" />
            <UtilityRow
              iconSrc="/icons/globe.svg"
              iconW={24}
              iconH={24}
              label="Language"
              value={currentLangDisplay}
              onClick={() => setSubPanel("language")}
            />
            <NavDivider className="bg-chalk300" />
            <UtilityRow
              iconSrc="/icons/map.svg"
              iconW={24}
              iconH={24}
              label="Find a Store"
              onClick={() => setSubPanel("store-visit")}
            />
          </div>

          <div className="mt-10 flex items-center justify-center text-center gap-2">
            <span className="inline-flex size-6 shrink-0 items-center justify-center">
              <Image
                src="/icons/footer-star.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden
                className="shrink-0"
              />
            </span>
            <p className="whitespace-nowrap font-gill text-sm leading-110 text-linkGold">
              Handicrafted Brilliance. Since 1989.
            </p>
          </div>
        </div>

        {displayedSubPanel === "language" ? (
          <div
            className={cn("absolute inset-0 z-10", mobileNavSubPanelMotionClass(isSubPanelVisible))}
            aria-hidden={!isSubPanelVisible}
          >
            <LanguagePanel
              selected={language}
              onBack={() => setSubPanel(null)}
              onClose={handleClose}
              onApply={handleApplyLanguage}
            />
          </div>
        ) : null}

        {displayedSubPanel === "currency" ? (
          <div
            className={cn("absolute inset-0 z-10", mobileNavSubPanelMotionClass(isSubPanelVisible))}
            aria-hidden={!isSubPanelVisible}
          >
            <CurrencyPanel
              selected={currency}
              onBack={() => setSubPanel(null)}
              onClose={handleClose}
              onApply={handleApplyCurrency}
            />
          </div>
        ) : null}

        {displayedSubPanel === "appointment" ? (
          <div
            className={cn("absolute inset-0 z-10", mobileNavSubPanelMotionClass(isSubPanelVisible))}
            aria-hidden={!isSubPanelVisible}
          >
            <BookAnAppointmentPanel
              variant="embedded"
              onBack={() => setSubPanel(null)}
              onClose={handleClose}
            />
          </div>
        ) : null}

        {displayedSubPanel === "jewellery" ? (
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 top-16 z-10",
              mobileNavSubPanelMotionClass(isSubPanelVisible),
            )}
            aria-hidden={!isSubPanelVisible}
          >
            <JewelleryPanel onBack={() => setSubPanel(null)} onClose={handleClose} />
          </div>
        ) : null}

        {displayedSubPanel === "store-visit" ? (
          <div
            className={cn("absolute inset-0 z-10", mobileNavSubPanelMotionClass(isSubPanelVisible))}
            aria-hidden={!isSubPanelVisible}
          >
            <BookStoreVisitPanel
              variant="embedded"
              onBack={() => setSubPanel(null)}
              onClose={handleClose}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default MobileNavigation;
