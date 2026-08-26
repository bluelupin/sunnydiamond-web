"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { invalidFieldClassName } from "@/shared/utils/formValidation";

const LIST_ANIMATION_MS = 200;

type InlineCustomSelectProps = {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  labelClassName?: string;
  triggerClassName?: string;
  listClassName?: string;
  optionClassName?: string;
  invalid?: boolean;
  errorId?: string;
  hideLabel?: boolean;
  placeholderClassName?: string;
};

const SelectChevron = ({ open }: { open: boolean }) => (
  <span
    className={cn(
      "pointer-events-none inline-flex size-[24px] shrink-0 items-center justify-center overflow-visible text-darkblack",
    )}
    aria-hidden
  >
    <span
      className={cn(
        "inline-flex size-[16px] items-center justify-center overflow-visible motion-safe:origin-center motion-safe:transform-gpu",
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

const InlineCustomSelect = ({
  id,
  label,
  value,
  options,
  placeholder = "Select",
  onChange,
  onBlur,
  labelClassName,
  triggerClassName,
  listClassName,
  optionClassName,
  invalid = false,
  errorId,
  hideLabel = false,
  placeholderClassName,
}: InlineCustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRenderList, setShouldRenderList] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = `${id}-label`;
  const listboxId = `${id}-listbox`;
  const valueId = `${id}-value`;

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

  const selectedOption = options.find((option) => option === value);
  const triggerLabel = selectedOption ?? placeholder;
  const showPlaceholder = !selectedOption;

  const selectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
    onBlur?.();
  };

  return (
    <div ref={rootRef} className="relative flex w-full flex-col gap-2">
      {!hideLabel ? (
        <span
          id={labelId}
          className={cn(
            "font-gill text-sm font-normal leading-110 text-darkblack",
            labelClassName,
          )}
        >
          {label}
        </span>
      ) : null}
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-labelledby={hideLabel ? undefined : `${labelId} ${valueId}`}
        aria-label={hideLabel ? label : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={errorId}
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((current) => !current);
        }}
        className={cn(
          "flex h-14 w-full items-center justify-between bg-[#F2F2F2] p-3 font-gill text-sm leading-110 outline-none",
          "motion-safe:transition-[border-color,background-color] motion-safe:duration-200 motion-safe:ease-in-out",
          isOpen ? "border border-darkblack" : "border border-transparent",
          invalid && !isOpen && invalidFieldClassName,
          showPlaceholder
            ? (placeholderClassName ?? "font-light text-neutral400")
            : "font-normal text-darkblack",
          triggerClassName,
        )}
      >
        <span id={valueId}>{triggerLabel}</span>
        <SelectChevron open={isOpen} />
      </button>
      {shouldRenderList ? (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          aria-hidden={!isOpen}
          onMouseDown={(event) => {
            // Keep focus on the trigger until the option click completes.
            event.preventDefault();
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
          className={cn(
            "absolute left-0 right-0 top-full z-[90] mt-1 flex max-h-64 flex-col overflow-y-auto bg-[#F2F2F2] shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
            "motion-safe:transform-gpu motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-safe:ease-out",
            "motion-safe:origin-top",
            isListVisible
              ? "motion-safe:translate-y-0 motion-safe:opacity-100"
              : "motion-safe:-translate-y-1 motion-safe:opacity-0",
            !isOpen && "pointer-events-none",
            listClassName,
          )}
        >
          {options.map((option) => {
            const selected = value === option;

            return (
              <button
                key={option}
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
                  selectOption(option);
                }}
                className={cn(
                  "flex h-14 w-full shrink-0 items-center p-3 text-left font-gill text-sm leading-110",
                  "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
                  selected
                    ? "bg-[#DECAA0] font-normal text-darkblack"
                    : "font-normal text-neutral400 hover:bg-[#DECAA0] hover:text-darkblack",
                  optionClassName,
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default InlineCustomSelect;
