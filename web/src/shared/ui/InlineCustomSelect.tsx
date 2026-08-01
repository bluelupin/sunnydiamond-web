"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import { invalidFieldClassName } from "@/shared/utils/formValidation";

const SELECT_CHEVRON_ICON = "/images/jewellery/chevron-down-filter.svg";

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
    className="pointer-events-none inline-flex size-[24px] shrink-0 items-center justify-center"
    aria-hidden
  >
    <Image
      src={SELECT_CHEVRON_ICON}
      alt=""
      width={7}
      height={15}
      className={cn(
        "shrink-0 object-contain transition-transform duration-200",
        open ? "-rotate-90" : "rotate-90",
      )}
      style={{ width: 7.038, height: 14.651 }}
    />
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
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = `${id}-label`;
  const listboxId = `${id}-listbox`;
  const valueId = `${id}-value`;

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
          isOpen ? "border border-darkblack" : "border border-transparent",
          invalid && !isOpen && invalidFieldClassName,
          showPlaceholder && !isOpen
            ? (placeholderClassName ?? "font-light text-neutral400")
            : "font-normal text-darkblack",
          triggerClassName,
        )}
      >
        <span id={valueId}>{triggerLabel}</span>
        <SelectChevron open={isOpen} />
      </button>
      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          className={cn(
            "absolute left-0 right-0 top-full z-[90] mt-1 flex max-h-64 flex-col overflow-y-auto bg-[#F2F2F2] shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
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
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  selectOption(option);
                }}
                className={cn(
                  "flex h-14 w-full shrink-0 items-center p-3 text-left font-gill text-sm leading-110 transition-colors",
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
