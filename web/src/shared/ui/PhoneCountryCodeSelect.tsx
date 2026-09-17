"use client";

import { useEffect, useRef, useState } from "react";
import {
  APPOINTMENT_COUNTRY_CODES,
  DEFAULT_COUNTRY_CODE,
} from "@/shared/constants/appointmentForm";
import { cn } from "@/shared/utils/cn";

const LIST_ANIMATION_MS = 200;

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
  onChange: (code: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
};

/** Compact themed country-code picker for phone input rows. */
const PhoneCountryCodeSelect = ({
  id = "phone-country-code",
  value = DEFAULT_COUNTRY_CODE,
  onChange,
  onBlur,
  disabled = false,
  className,
}: PhoneCountryCodeSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRenderList, setShouldRenderList] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = `${id}-listbox`;

  useEffect(() => {
    if (isOpen) {
      setShouldRenderList(true);

      const frame = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
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
  }, [isOpen]);

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

  const selectCode = (code: string) => {
    onChange(code);
    setIsOpen(false);
    onBlur?.();
  };

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
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
        <span>{value}</span>
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
          className={cn(
            "verticleMobileScrollbar absolute left-0 top-full z-[90] mt-1 flex min-w-[112px] flex-col overflow-hidden bg-[#F2F2F2] shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
            "motion-safe:transform-gpu motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-safe:ease-out",
            "motion-safe:origin-top",
            isListVisible
              ? "motion-safe:translate-y-0 motion-safe:opacity-100"
              : "motion-safe:-translate-y-1 motion-safe:opacity-0",
            !isOpen && "pointer-events-none",
          )}
        >
          {APPOINTMENT_COUNTRY_CODES.map((entry) => {
            const selected = value === entry.code;

            return (
              <button
                key={entry.code}
                type="button"
                role="option"
                aria-selected={selected}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  selectCode(entry.code);
                }}
                className={cn(
                  "flex h-14 w-full shrink-0 items-center px-3 text-left font-gill text-sm leading-110",
                  "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
                  selected
                    ? "bg-[#DECAA0] font-normal text-darkblack"
                    : "font-normal text-neutral400 hover:bg-[#DECAA0] hover:text-darkblack",
                )}
              >
                {entry.code}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default PhoneCountryCodeSelect;
