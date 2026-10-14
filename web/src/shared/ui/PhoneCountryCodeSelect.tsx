"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_COUNTRY_CODE } from "@/shared/constants/appointmentForm";
import {
  formatPhoneDialCodeLabel,
  resolvePhoneCountryCodeDisplayFromEntry,
} from "@/shared/constants/phoneCountryCodeDisplay";
import {
  filterPhoneCountryEntriesByDialCodes,
  resolvePhoneCountryEntryInList,
  type PhoneCountryEntry,
} from "@/shared/constants/phoneCountryCodes";
import { MOBILE_MAX_WIDTH_PX } from "@/shared/lib/breakpoints";
import { CountryFlagIcon } from "@/shared/ui/CountryFlagIcon";
import { cn } from "@/shared/utils/cn";

const LIST_ANIMATION_MS = 200;
const LIST_MAX_HEIGHT_PX = 280;
const LIST_GAP_PX = 24;
const VIEWPORT_PADDING_PX = 8;
const LIST_MIN_HEIGHT_PX = 112;

const SelectChevron = ({ open }: { open: boolean }) => (
  <span
    className="inline-flex size-6 shrink-0 items-center justify-center overflow-visible text-darkblack"
    aria-hidden
  >
    <span
      className={cn(
        "inline-flex size-4 items-center justify-center overflow-visible motion-safe:origin-center motion-safe:transform-gpu",
        "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-in-out",
        open ? "-rotate-90" : "rotate-90",
      )}
    >
      <svg
        width="7.038"
        height="14.651"
        viewBox="-0.5 -0.5 8.03817 15.6508"
        fill="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
        className="block shrink-0 overflow-visible"
        aria-hidden
      >
        <path
          d="M0.379628 0.325396L6.37963 7.3254L0.379628 14.3254"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  </span>
);

type PhoneCountryCodeSelectProps = {
  id?: string;
  value?: string;
  /** ISO 3166-1 alpha-2 when disambiguating shared dial codes (e.g. +1). */
  countryIso?: string;
  onChange: (code: string, countryIso?: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
  /** Restrict to specific E.164 dial codes (rare). Omit for the full sovereign-country list (195). */
  codes?: readonly string[];
};

/** Phone row container (prefix + national input), including nested checkout layout. */
function resolvePhoneFieldRow(root: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = root.parentElement;

  while (node && node !== document.body) {
    const hasPhoneInput = node.querySelector("input");
    const hasCodeTrigger = node.querySelector('button[aria-haspopup="listbox"]');

    if (hasPhoneInput && hasCodeTrigger && node.classList.contains("h-14")) {
      return node;
    }

    node = node.parentElement;
  }

  return root.parentElement;
}

/** Compact themed country-code picker for phone input rows. */
const PhoneCountryCodeSelect = ({
  id = "phone-country-code",
  value = DEFAULT_COUNTRY_CODE,
  countryIso,
  onChange,
  onBlur,
  disabled = false,
  className,
  codes,
}: PhoneCountryCodeSelectProps) => {
  const listEntries = useMemo(
    () => filterPhoneCountryEntriesByDialCodes(codes),
    [codes],
  );

  const [selectedCountryIso, setSelectedCountryIso] = useState(() => {
    return (
      resolvePhoneCountryEntryInList(value, listEntries, { iso: countryIso })?.country ?? "IN"
    );
  });

  const [isOpen, setIsOpen] = useState(false);
  const [shouldRenderList, setShouldRenderList] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
  const [listOpensUpward, setListOpensUpward] = useState(false);
  const [listMaxHeight, setListMaxHeight] = useState(LIST_MAX_HEIGHT_PX);
  const [listFieldWidthStyle, setListFieldWidthStyle] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = `${id}-listbox`;

  const selectedEntry = useMemo(
    () =>
      resolvePhoneCountryEntryInList(value, listEntries, {
        iso: countryIso,
        preferredIso: selectedCountryIso,
      }),
    [value, listEntries, countryIso, selectedCountryIso],
  );

  useEffect(() => {
    const resolved = resolvePhoneCountryEntryInList(value, listEntries, {
      iso: countryIso,
      preferredIso: selectedCountryIso,
    });
    if (resolved && resolved.country !== selectedCountryIso) {
      setSelectedCountryIso(resolved.country);
    }
  }, [value, listEntries, countryIso, selectedCountryIso]);

  const triggerDialCode = selectedEntry?.code ?? value;

  const updateListPlacement = useCallback(() => {
    const trigger = triggerRef.current;
    const root = rootRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING_PX;
    const spaceAbove = rect.top - VIEWPORT_PADDING_PX;
    const openUpward = spaceBelow < LIST_MAX_HEIGHT_PX && spaceAbove > spaceBelow;
    const availableSpace = openUpward ? spaceAbove : spaceBelow;
    const maxHeight = Math.min(
      LIST_MAX_HEIGHT_PX,
      Math.max(availableSpace - LIST_GAP_PX, LIST_MIN_HEIGHT_PX),
    );

    setListOpensUpward(openUpward);
    setListMaxHeight(maxHeight);

    const isMobileViewport = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH_PX}px)`).matches;
    if (isMobileViewport && root) {
      const row = resolvePhoneFieldRow(root);
      if (row) {
        const rowRect = row.getBoundingClientRect();
        const rootRect = root.getBoundingClientRect();
        setListFieldWidthStyle({
          left: rowRect.left - rootRect.left,
          width: rowRect.width,
        });
        return;
      }
    }

    setListFieldWidthStyle(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShouldRenderList(true);
      updateListPlacement();

      const frame = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          updateListPlacement();
          setIsListVisible(true);
        });
      });

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }

    setIsListVisible(false);

    const timeoutId = window.setTimeout(() => {
      setShouldRenderList(false);
    }, LIST_ANIMATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen, updateListPlacement]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updateListPlacement();

    const handleLayoutChange = () => {
      updateListPlacement();
    };

    window.addEventListener("resize", handleLayoutChange);
    window.addEventListener("scroll", handleLayoutChange, true);

    return () => {
      window.removeEventListener("resize", handleLayoutChange);
      window.removeEventListener("scroll", handleLayoutChange, true);
    };
  }, [isOpen, updateListPlacement]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) {
        return;
      }

      setIsOpen(false);
      onBlur?.();
    };

    const timeoutId = window.setTimeout(() => {
      document.addEventListener("pointerdown", handlePointerDown);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, onBlur]);

  const selectEntry = (entry: PhoneCountryEntry) => {
    setSelectedCountryIso(entry.country);
    onChange(entry.code, entry.country);
    setIsOpen(false);
    onBlur?.();
  };

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label="Country code"
        onClick={(event) => {
          event.stopPropagation();
          if (disabled) {
            return;
          }

          setIsOpen((current) => !current);
        }}
        className={cn(
          "flex items-center gap-1 bg-transparent font-gill text-base font-normal leading-110 text-darkblack outline-none",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span>{triggerDialCode}</span>
        <SelectChevron open={isOpen} />
      </button>
      {shouldRenderList ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Country code"
          aria-hidden={!isOpen}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
          style={{
            maxHeight: listMaxHeight,
            ...(listFieldWidthStyle
              ? { left: listFieldWidthStyle.left, width: listFieldWidthStyle.width }
              : {}),
          }}
          className={cn(
            "verticleMobileScrollbar absolute z-[90] flex flex-col overflow-y-auto bg-[#F2F2F2] shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
            listFieldWidthStyle ? "min-w-0 max-w-none" : "-left-[13px] min-w-[280px]",
            "motion-safe:transform-gpu motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-safe:ease-out",
            listOpensUpward ? "bottom-full mb-6 motion-safe:origin-bottom" : "top-full mt-6 motion-safe:origin-top",
            isListVisible
              ? "motion-safe:translate-y-0 motion-safe:opacity-100"
              : listOpensUpward
                ? "motion-safe:translate-y-1 motion-safe:opacity-0"
                : "motion-safe:-translate-y-1 motion-safe:opacity-0",
            !isOpen && "pointer-events-none",
          )}
        >
          {listEntries.map((entry) => {
            const selected = entry.country === selectedCountryIso;
            const display = resolvePhoneCountryCodeDisplayFromEntry(entry);
            const countryLabel = `${display.name} (${display.iso})`;
            const dialCodeLabel = formatPhoneDialCodeLabel(display.code);

            return (
              <button
                key={`${entry.country}-${entry.code}`}
                type="button"
                role="option"
                aria-selected={selected}
                aria-label={`${countryLabel} ${dialCodeLabel}`}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  selectEntry(entry);
                }}
                className={cn(
                  "flex h-14 w-full shrink-0 items-center gap-2 p-3 text-left font-gill text-base font-normal leading-110",
                  "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
                  selected
                    ? "bg-gold300 text-darkblack"
                    : "bg-[#F2F2F2] text-neutral500 hover:bg-gold300 hover:text-darkblack",
                )}
              >
                <CountryFlagIcon iso={display.iso} />
                <span className="min-w-0 flex-1 truncate whitespace-nowrap">{countryLabel}</span>
                <span className="ml-auto shrink-0 whitespace-nowrap tabular-nums">{dialCodeLabel}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default PhoneCountryCodeSelect;
