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
  invalid?: boolean;
  errorId?: string;
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
  invalid = false,
  errorId,
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

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen, onBlur]);

  const selectedOption = options.find((option) => option === value);
  const triggerLabel = selectedOption ?? placeholder;
  const showPlaceholder = !selectedOption;

  return (
    <div ref={rootRef} className="flex flex-col gap-[8px]">
      <span
        id={labelId}
        className={cn(
          "font-gill text-sm font-normal leading-110 text-darkblack",
          labelClassName,
        )}
      >
        {label}
      </span>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-labelledby={`${labelId} ${valueId}`}
        aria-invalid={invalid || undefined}
        aria-describedby={errorId}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "flex h-[56px] w-full items-center justify-between bg-[#F2F2F2] p-[12px] font-gill text-sm leading-110 outline-none",
          isOpen ? "border border-darkblack" : "border border-transparent",
          invalid && !isOpen && invalidFieldClassName,
          showPlaceholder && !isOpen ? "font-light text-neutral400" : "font-normal text-darkblack",
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
          className="flex w-full flex-col bg-[#F2F2F2]"
        >
          {options.map((option) => {
            const selected = value === option;

            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  onBlur?.();
                }}
                className={cn(
                  "flex h-[56px] w-full items-center p-[12px] text-left font-gill text-sm leading-110 transition-colors",
                  selected
                    ? "bg-[#DECAA0] font-normal text-darkblack"
                    : "font-normal text-neutral400 hover:bg-[#DECAA0] hover:text-darkblack",
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
