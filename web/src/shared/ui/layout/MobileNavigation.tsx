"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import SDLogo from "@/assets/Icons/SDLogo";
import { cn } from "@/shared/utils/cn";
import { resolveHeaderNavHref } from "@/shared/utils/navigation";
import type { HeaderNavLink } from "@/shared/lib/shellNavigation";

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

const TIME_SLOTS = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
] as const;

const COUNTRY_CODES = [
  { code: "+91", country: "IN" },
  { code: "+1", country: "US" },
  { code: "+44", country: "GB" },
] as const;

const fieldClass =
  "h-14 w-full bg-[#F2F2F2] px-3 font-gill text-sm leading-110 text-darkblack placeholder:text-[#999999] outline-none";

const labelClass = "font-gill text-sm leading-110 text-darkblack";

type AppointmentPanelProps = {
  onBack: () => void;
  onClose: () => void;
};

const AppointmentPanel = ({ onBack, onClose }: AppointmentPanelProps) => {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const handleClear = () => {
    setName("");
    setPhone("");
    setEmail("");
    setDate("");
    setSelectedSlot(null);
    setNote("");
  };

  return (
    <div
      className="absolute inset-0 flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Book an appointment"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-4 pt-6">
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
              Book an Appointment
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

        <div className="mx-4 mt-6 h-px bg-[#ECE9E9]" aria-hidden />

        <div className="flex flex-col gap-6 px-4 pt-6 pb-2">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Your Name*</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={fieldClass}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Phone No.*</label>
            <div className="flex h-14 w-full items-center gap-3 bg-[#F2F2F2] px-3">
              <div className="flex shrink-0 items-center gap-0.5">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-transparent font-gill text-sm leading-110 text-darkblack outline-none"
                  aria-label="Country code"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>{c.code}</option>
                  ))}
                </select>
              </div>
              <div className="h-4 w-px bg-[#CCCCCC]" aria-hidden />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="min-w-0 flex-1 bg-transparent font-gill text-sm leading-110 text-darkblack placeholder:text-[#999999] outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={fieldClass}
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Date</label>
            <div className="relative flex h-14 w-full items-center bg-[#F2F2F2] px-3">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 bg-transparent font-gill text-sm leading-110 text-darkblack outline-none [color-scheme:light]"
              />
            </div>
          </div>

          {/* Time Slots */}
          <div className="flex flex-col gap-2">
            <span className={labelClass}>Time Slots</span>
            <div className="flex flex-col gap-3">
              {Array.from({ length: TIME_SLOTS.length / 2 }, (_, row) => (
                <div key={row} className="flex gap-2">
                  {([TIME_SLOTS[row * 2], TIME_SLOTS[row * 2 + 1]] as string[]).map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(isSelected ? null : slot)}
                        className={cn(
                          "flex h-14 flex-1 items-center justify-center font-gill text-base leading-110",
                          isSelected
                            ? "bg-[#DECAA0] font-normal text-darkblack"
                            : "bg-[#F2F2F2] font-light text-darkblack",
                        )}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Describe more about your visit</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tell us what you're looking for…"
              rows={4}
              className="w-full resize-none bg-[#F2F2F2] p-3 font-gill text-sm leading-110 text-darkblack placeholder:text-[#999999] outline-none"
              style={{ height: "100px" }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0">
        <div className="pointer-events-none h-[71px] bg-gradient-to-b from-transparent to-white" aria-hidden />
        <div className="flex flex-col items-center gap-4 border-t border-[#CCCCCC]/50 bg-white px-4 py-6">
          <p className="font-gill text-sm font-light leading-110 tracking-[0.252px] text-[#4D4D4D]">
            Our representative will get in touch with you soon
          </p>
          <div className="flex w-full items-center gap-0">
            <button
              type="button"
              onClick={handleClear}
              className="flex h-14 flex-1 items-center justify-center border border-[#CCCCCC] font-gill text-sm uppercase leading-110 text-darkblack"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-14 flex-1 items-center justify-center bg-darkblack font-gill text-sm uppercase leading-110 text-white"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [subPanel, setSubPanel] = useState<"language" | "currency" | "appointment" | null>(null);
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
          {mobileNavLinks.map((link, index) => (
            <Fragment key={link.label}>
              <MobileNavRow
                label={link.label}
                href={resolveHeaderNavHref(link.label, link.url)}
                onNavigate={handleClose}
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
            href="/store-locator"
            onNavigate={handleClose}
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
        <AppointmentPanel
          onBack={() => setSubPanel(null)}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default MobileNavigation;
