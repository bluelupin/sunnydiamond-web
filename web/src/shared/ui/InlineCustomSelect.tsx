"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { appointmentLabelClassName } from "@/shared/constants/appointmentForm";
import { cn } from "@/shared/utils/cn";
import { invalidFieldClassName } from "@/shared/utils/formValidation";

/** Portaled list — overlay panels must ignore outside clicks on this node (e.g. gift card sheet). */
export const INLINE_CUSTOM_SELECT_LISTBOX_SELECTOR = "[data-inline-custom-select-listbox]";

const LIST_ANIMATION_MS = 200;
const LIST_GAP_PX = 4;
const VIEWPORT_PADDING_PX = 8;
const LIST_MAX_HEIGHT_PX = 256;

type ListPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

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
  /**
   * `inline` renders the list under the trigger (for modal sheets where body portals
   * cannot receive clicks). Default `portaled` matches Contact Us page behaviour.
   */
  listPlacement?: "portaled" | "inline";
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
  listPlacement = "portaled",
}: InlineCustomSelectProps) => {
  const isInlineList = listPlacement === "inline";
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRenderList, setShouldRenderList] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
  const [listPosition, setListPosition] = useState<ListPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const labelId = `${id}-label`;
  const listboxId = `${id}-listbox`;
  const valueId = `${id}-value`;

  const updateListPosition = useCallback(() => {
    const trigger = triggerRef.current;
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
      Math.max(availableSpace - LIST_GAP_PX, 112),
    );
    const top = openUpward
      ? rect.top - LIST_GAP_PX - maxHeight
      : rect.bottom + LIST_GAP_PX;

    setListPosition({
      top,
      left: rect.left,
      width: rect.width,
      maxHeight,
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShouldRenderList(true);
      if (!isInlineList) {
        updateListPosition();
      }

      const frame = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (!isInlineList) {
            updateListPosition();
          }
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
      if (!isInlineList) {
        setListPosition(null);
      }
    }, LIST_ANIMATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isInlineList, isOpen, updateListPosition]);

  useEffect(() => {
    if (!isOpen || isInlineList) {
      return;
    }

    updateListPosition();

    const handleLayoutChange = () => {
      updateListPosition();
    };

    window.addEventListener("resize", handleLayoutChange);
    window.addEventListener("scroll", handleLayoutChange, true);

    return () => {
      window.removeEventListener("resize", handleLayoutChange);
      window.removeEventListener("scroll", handleLayoutChange, true);
    };
  }, [isInlineList, isOpen, updateListPosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || listRef.current?.contains(target)) {
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

  const listbox =
    shouldRenderList && (isInlineList || listPosition) ? (
      <div
        ref={listRef}
        id={listboxId}
        data-inline-custom-select-listbox=""
        role="listbox"
        aria-labelledby={labelId}
        aria-hidden={!isOpen}
        style={
          isInlineList
            ? { maxHeight: LIST_MAX_HEIGHT_PX }
            : {
                position: "fixed",
                top: listPosition!.top,
                left: listPosition!.left,
                width: listPosition!.width,
                maxHeight: listPosition!.maxHeight,
              }
        }
        onClick={(event) => {
          event.stopPropagation();
        }}
        onWheel={(event) => {
          event.stopPropagation();
        }}
        onTouchMove={(event) => {
          event.stopPropagation();
        }}
        className={cn(
          "verticleMobileScrollbar flex flex-col overflow-y-auto overscroll-contain bg-[#F2F2F2] shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
          "motion-safe:transform-gpu motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-safe:ease-out",
          "motion-safe:origin-top",
          isInlineList
            ? "absolute left-0 top-[calc(100%+4px)] z-[80] w-full"
            : "z-[100] fixed",
          isListVisible
            ? "motion-safe:translate-y-0 motion-safe:opacity-100"
            : "motion-safe:-translate-y-1 motion-safe:opacity-0",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
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
    ) : null;

  return (
    <div ref={rootRef} className="relative flex w-full flex-col gap-2">
      {!hideLabel ? (
        <span
          id={labelId}
          className={cn(appointmentLabelClassName, labelClassName)}
        >
          {label}
        </span>
      ) : null}
      <button
        ref={triggerRef}
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
          triggerClassName,
          // Placeholder/value colour must win over triggerClassName text colour.
          showPlaceholder
            ? (placeholderClassName ?? "font-light text-neutral400")
            : "font-normal text-darkblack",
        )}
      >
        <span id={valueId}>{triggerLabel}</span>
        <SelectChevron open={isOpen} />
      </button>
      {listbox
        ? isInlineList
          ? listbox
          : createPortal(listbox, document.body)
        : null}
    </div>
  );
};

export default InlineCustomSelect;
