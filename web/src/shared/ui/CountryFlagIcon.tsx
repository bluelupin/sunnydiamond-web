"use client";

import AE from "country-flag-icons/react/3x2/AE";
import AF from "country-flag-icons/react/3x2/AF";
import AL from "country-flag-icons/react/3x2/AL";
import AU from "country-flag-icons/react/3x2/AU";
import BH from "country-flag-icons/react/3x2/BH";
import GB from "country-flag-icons/react/3x2/GB";
import IN from "country-flag-icons/react/3x2/IN";
import KW from "country-flag-icons/react/3x2/KW";
import NZ from "country-flag-icons/react/3x2/NZ";
import OM from "country-flag-icons/react/3x2/OM";
import QA from "country-flag-icons/react/3x2/QA";
import SA from "country-flag-icons/react/3x2/SA";
import SG from "country-flag-icons/react/3x2/SG";
import US from "country-flag-icons/react/3x2/US";
import { cn } from "@/shared/utils/cn";

type CountryFlagComponent = typeof IN;

/** ISO codes used by `phoneCountryCodeDisplay` — tree-shaken per-country imports. */
const FLAG_BY_ISO: Record<string, CountryFlagComponent> = {
  AE,
  AF,
  AL,
  AU,
  BH,
  GB,
  IN,
  KW,
  NZ,
  OM,
  QA,
  SA,
  SG,
  US,
};

function InternationalFlagPlaceholder({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-6 shrink-0 text-neutral500", className)}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M3 12h18M12 3c2.5 2.8 4 6.2 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6.2-4 9s1.5 6.2 4 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

type CountryFlagIconProps = {
  iso: string;
  className?: string;
};

/** Figma 6752:65169 — 24×24 flag in phone country-code list rows. */
export function CountryFlagIcon({ iso, className }: CountryFlagIconProps) {
  const normalized = iso.trim().toUpperCase();
  const Flag = normalized ? FLAG_BY_ISO[normalized] : undefined;

  if (!Flag) {
    return <InternationalFlagPlaceholder className={className} />;
  }

  return (
    <span
      className={cn("inline-flex size-6 shrink-0 overflow-hidden", className)}
      aria-hidden
    >
      <Flag className="h-full w-full" />
    </span>
  );
}
