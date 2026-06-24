"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import SDLogo from "@/assets/Icons/SDLogo";
import { cn } from "@/shared/utils/cn";
import { resolveHeaderNavHref } from "@/shared/utils/navigation";
import type { HeaderNavLink } from "@/shared/lib/shellNavigation";
import BookAnAppointmentPanel from "@/features/appointment/components/BookAnAppointmentPanel";
import BookStoreVisitPanel from "@/features/products/components/detail/BookStoreVisitPanel";

type MobileNavigationProps = {
  isOpen: boolean;
  onClose: () => void;
  navLinks: HeaderNavLink[];
  cartCount: number;
};

const EXCLUDED_MOBILE_NAV_LABELS = new Set(["collection"]);

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

type MobileJewelleryCategory = {
  label: string;
  href: string;
  image: string | null;
};

const MOBILE_JEWELLERY_ROWS: MobileJewelleryCategory[][] = [
  [
    { label: "Bangles", href: "/jewellery/bangles", image: "/images/navigation/jewellery/bangles.png" },
    { label: "Necklaces", href: "/jewellery/necklaces", image: "/images/navigation/jewellery/necklaces-2.png" },
  ],
  [
    { label: "Nose pins", href: "/jewellery/nose-pins", image: "/images/navigation/jewellery/nose-pins.png" },
    { label: "Earrings", href: "/jewellery/earrings", image: "/images/navigation/jewellery/earrings.png" },
  ],
  [
    { label: "Rings", href: "/jewellery/rings", image: "/images/navigation/jewellery/rings-1.png" },
    { label: "Pendants", href: "/jewellery/pendants", image: "/images/navigation/jewellery/pendants.png" },
  ],
  [
    { label: "Bracelets", href: "/jewellery/bracelets", image: "/images/navigation/jewellery/bracelets.png" },
    { label: "All Products", href: "/jewellery", image: null },
  ],
];

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

    <div className="mx-4 mt-4 h-px shrink-0 bg-[#ECE9E9]" aria-hidden />

    <div className="flex min-h-0 flex-1 flex-col gap-[12px] overflow-y-auto px-4 pt-4 pb-6">
      {MOBILE_JEWELLERY_ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-[12px]">
          {row.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              onClick={onClose}
              className="flex min-w-0 flex-[1_0_0] flex-col gap-1"
            >
              <div className="relative h-100 w-full shrink-0 overflow-hidden">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#F8F1F6]">
                    <span className="font-gill text-[14px] leading-[110%] darkblack">
                      All Products
                    </span>
                  </div>
                )}
              </div>
              {cat.image && (
                <span className="font-gill text-[14px] leading-[110%] darkblack">
                  {cat.label}
                </span>
              )}
            </Link>
          ))}
        </div>
      ))}
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

const NavDivider = () => <div className="h-px w-full bg-[#ECE9E9]" aria-hidden />;

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
        className="flex h-6 w-full items-center justify-between"
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
      className="flex h-6 w-full items-center justify-between"
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
  const content = (
    <>
      <span className="flex min-w-0 items-center gap-1">
        <Image src={iconSrc} alt="" width={iconW} height={iconH} aria-hidden className="shrink-0" />
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

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="flex h-6 w-full items-center justify-between">
        {content}
      </button>
    );
  }

  return <div className="flex h-6 w-full items-center justify-between">{content}</div>;
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

        <div className="mt-6 h-px w-full bg-[#ECE9E9]" aria-hidden />

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

        <div className="mt-6 h-px w-full bg-[#ECE9E9]" aria-hidden />

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

const MobileNavigation = ({ isOpen, onClose, navLinks, cartCount }: MobileNavigationProps) => {
  const [subPanel, setSubPanel] = useState<
    "language" | "currency" | "appointment" | "jewellery" | "store-visit" | null
  >(null);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  const mobileNavLinks = navLinks.filter(
    (link) => !EXCLUDED_MOBILE_NAV_LABELS.has(link.label.trim().toLowerCase()),
  );

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
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentLangDisplay = LANGUAGES.find((l) => l.code === language)?.display ?? "English";
  const currentCurrencyDisplay = CURRENCIES.find((c) => c.code === currency)?.display ?? "India · ₹ INR";

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

        <div className="flex w-[112px] items-center justify-end gap-5">
          <Link href="/products" aria-label="Wishlist" onClick={handleClose} className="inline-flex size-6 items-center justify-center">
            <Heart size={24} strokeWidth={1.5} />
          </Link>
          <Link href="/contact" aria-label="Account" onClick={handleClose} className="inline-flex size-6 items-center justify-center">
            <User size={24} strokeWidth={1.5} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            onClick={handleClose}
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
          {mobileNavLinks.map((link, index) => {
            const isJewellery = link.label.trim().toLowerCase() === "jewellery";
            return (
              <Fragment key={link.label}>
                <MobileNavRow
                  label={link.label}
                  href={resolveHeaderNavHref(link.label, link.url)}
                  onNavigate={handleClose}
                  onOpenPanel={isJewellery ? () => setSubPanel("jewellery") : undefined}
                />
                {index < mobileNavLinks.length - 1 ? <NavDivider /> : null}
              </Fragment>
            );
          })}
        </nav>
      </div>

      <div className="shrink-0 bg-gray200 px-4 py-6">
        <div className="flex flex-col gap-3">
          <UtilityRow
            iconSrc="/images/navigation/appointment.svg"
            iconW={11}
            iconH={19}
            label="Book an Appointment"
            onClick={() => setSubPanel("appointment")}
          />
          <NavDivider />
          <UtilityRow
            iconSrc="/images/navigation/currency.svg"
            iconW={14}
            iconH={10}
            label="Currency"
            value={currentCurrencyDisplay}
            onClick={() => setSubPanel("currency")}
          />
          <NavDivider />
          <UtilityRow
            iconSrc="/images/navigation/globe.svg"
            iconW={15}
            iconH={15}
            label="Language"
            value={currentLangDisplay}
            onClick={() => setSubPanel("language")}
          />
          <NavDivider />
          <UtilityRow
            iconSrc="/images/navigation/map.svg"
            iconW={12}
            iconH={16}
            label="Find a Store"
            onClick={() => setSubPanel("store-visit")}
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
  );
};

export default MobileNavigation;
