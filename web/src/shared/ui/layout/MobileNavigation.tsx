"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
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
};

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
    className="absolute inset-0 flex flex-col bg-white"
    role="dialog"
    aria-modal="true"
    aria-label="Jewellery categories"
  >
    <div className="flex shrink-0 items-center justify-between px-4 pt-6">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="flex items-center gap-2"
      >
        <span className="inline-flex size-6 shrink-0 items-center justify-center">
          <Image
            src="/images/navigation/chevron-right.svg"
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

    <div className="mx-4 mt-4 h-px shrink-0 bg-aboutInactive" aria-hidden />

    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-6 pt-4">
      <JewelleryCategoryMenu variant="mobile" onClose={onClose} />
    </div>
  </div>
);

const NavChevron = () => (
  <span className="inline-flex size-6 shrink-0 items-center justify-center">
    <Image
      src="/images/navigation/chevron-right.svg"
      alt=""
      width={7}
      height={15}
      aria-hidden
      className="-scale-y-100"
    />
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
      className="absolute inset-0 flex flex-col bg-white"
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
                src="/images/navigation/chevron-right.svg"
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
              src="/images/navigation/menu-close.svg"
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
      className="absolute inset-0 flex flex-col bg-white"
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
                src="/images/navigation/chevron-right.svg"
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
              src="/images/navigation/menu-close.svg"
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
  appointmentLink = { label: "Book an Appointment", url: "/book-an-appointment" },
  cartCount,
}: MobileNavigationProps) => {
  const [subPanel, setSubPanel] = useState<
    "language" | "currency" | "appointment" | "jewellery" | "store-visit" | null
  >(null);
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
      setSearchQuery("");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  }, []);

  const handleAccountClick = useCallback(() => {
    handleClose();
  }, [handleClose]);

  if (!isOpen) return null;

  const currentLangDisplay = LANGUAGES.find((l) => l.code === language)?.display ?? "English";
  const currentCurrencyDisplay = CURRENCIES.find((c) => c.code === currency)?.display ?? "India · ₹ INR";

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[59] hidden bg-black/50 md:portrait:block md:landscape:hidden"
        onClick={handleClose}
        aria-label="Close menu"
      />

      <div
        className={cn(
          "fixed z-[60] flex flex-col bg-white md:landscape:hidden",
          "inset-0",
          "md:portrait:inset-x-auto md:portrait:inset-y-0 md:portrait:left-0 md:portrait:w-[60%] md:portrait:max-w-[60%]",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
      <div className="flex h-16 shrink-0 items-center justify-between px-4 gap-4">
        <div className="flex w-[120px] items-center">
          <button
            type="button"
            onClick={handleClose}
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

        <Link href="/" aria-label="Sunny Diamonds home" onClick={handleClose} className="h-16 w-20 shrink-0">
          <SDLogo className="!h-16 !w-20 text-darkMagenta" />
        </Link>

        <div className="flex w-[112px] items-center justify-end gap-6">
          <WishlistNavLink
            onNavigate={handleClose}
            className="relative inline-flex size-6 items-center justify-center"
          />
          <AccountMenu onNavigate={handleAccountClick} className="inline-flex size-6 items-center justify-center" />
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
              <Fragment key={link.label}>
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
          <UtilityRow
            iconSrc="/images/navigation/appointment.svg"
            iconW={20}
            iconH={20}
            label={appointmentLink.label}
            onClick={() => setSubPanel("appointment")}
          />
          <NavDivider className="bg-chalk300" />
          <UtilityRow
            iconSrc="/images/navigation/currency.svg"
            iconW={20}
            iconH={20}
            label="Currency"
            value={currentCurrencyDisplay}
            onClick={() => setSubPanel("currency")}
          />
          <NavDivider className="bg-chalk300" />
          <UtilityRow
            iconSrc="/images/navigation/globe.svg"
            iconW={24}
            iconH={24}
            label="Language"
            value={currentLangDisplay}
            onClick={() => setSubPanel("language")}
          />
          <NavDivider className="bg-chalk300" />
          <UtilityRow
            iconSrc="/images/navigation/map.svg"
            iconW={24}
            iconH={24}
            label="Find a Store"
            onClick={() => setSubPanel("store-visit")}
          />
        </div>

        <div className="mt-10 flex items-center justify-center text-center gap-2">
          <span className="inline-flex size-6 shrink-0 items-center justify-center">
            <Image
              src="/images/navigation/footer-star.svg"
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

      {subPanel === "language" && (
        <LanguagePanel
          selected={language}
          onBack={() => setSubPanel(null)}
          onClose={handleClose}
          onApply={handleApplyLanguage}
        />
      )}

      {subPanel === "currency" && (
        <CurrencyPanel
          selected={currency}
          onBack={() => setSubPanel(null)}
          onClose={handleClose}
          onApply={handleApplyCurrency}
        />
      )}

      {subPanel === "appointment" && (
        <BookAnAppointmentPanel
          variant="embedded"
          onBack={() => setSubPanel(null)}
          onClose={handleClose}
        />
      )}

      {subPanel === "jewellery" && (
        <JewelleryPanel
          onBack={() => setSubPanel(null)}
          onClose={handleClose}
        />
      )}

      {subPanel === "store-visit" && (
        <BookStoreVisitPanel
          variant="embedded"
          onBack={() => setSubPanel(null)}
          onClose={handleClose}
        />
      )}
      </div>
    </>
  );
};

export default MobileNavigation;
