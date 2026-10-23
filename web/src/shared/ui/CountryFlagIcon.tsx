"use client";

import { hasFlag } from "country-flag-icons";
import { cn } from "@/shared/utils/cn";

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

  if (!normalized || !hasFlag(normalized)) {
    return <InternationalFlagPlaceholder className={className} />;
  }

  return (
    <span
      className={cn(
        "inline-flex size-6 shrink-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      {/* Static SVGs do not need the Next image optimizer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/flags/3x2/${normalized}.svg`}
        alt=""
        width={24}
        height={24}
        loading="lazy"
        decoding="async"
        className="block h-full w-full object-contain"
      />
    </span>
  );
}
