"use client";

import { Check, ChevronLeft } from "lucide-react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import CareersChevronDownIcon from "@/features/careers/components/shared/CareersChevronDownIcon";
import { cn } from "@/shared/utils/cn";

export const giftCardFieldLabelClass =
  "font-gill text-base font-normal leading-110 text-darkblack";

export const giftCardSectionHeadingClass =
  "font-larken text-xl font-light leading-110 text-darkblack";

type GiftCardTextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  focused?: boolean;
};

export const GiftCardTextField = ({
  id,
  label,
  value,
  onChange,
  placeholder = "Enter",
  type = "text",
  inputMode,
  focused = false,
}: GiftCardTextFieldProps) => (
  <div className="flex flex-col gap-2">
    <label className={giftCardFieldLabelClass} htmlFor={id}>{label}</label>
    <div
      className={cn(
        "flex h-14 items-center bg-gray200 p-3 focus-within:border focus-within:border-darkblack",
      )}
    >
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:text-gray600"
      />
    </div>
  </div>
);

type GiftCardPhoneFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const GiftCardPhoneField = ({
  id,
  label,
  value,
  onChange,
}: GiftCardPhoneFieldProps) => (
  <div className="flex flex-col gap-2">
    <label className={giftCardFieldLabelClass} htmlFor={id}>{label}</label>
    <div
      className={cn(
        "flex h-14 items-center gap-2 bg-gray200 p-3 focus-within:border focus-within:border-darkblack",
      )}
    >
      <div className="flex shrink-0 items-center gap-2">
        <span className="font-gill text-base font-normal leading-110 text-darkblack">+91</span>
        <CareersChevronDownIcon />
      </div>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
        placeholder="Enter"
        className="min-w-0 flex-1 bg-transparent font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:text-gray600"
      />
    </div>
  </div>
);

type GiftCardSelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Array<{ label: string; value: string }>;
};

export const GiftCardSelectField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  options,
}: GiftCardSelectFieldProps) => (
  <div className="flex flex-col gap-2">
    <label className={giftCardFieldLabelClass} htmlFor={id}>{label}</label>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-14 w-full appearance-none bg-gray200 p-3 pr-10 font-gill text-base font-normal leading-110 text-darkblack outline-none",
          !value && "text-gray600",
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <CareersChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
    </div>
  </div>
);

type GiftCardTextAreaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export const GiftCardTextAreaField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
}: GiftCardTextAreaFieldProps) => {
  const hasValue = value.trim().length > 0;

  return (
    <div className="flex flex-col gap-2">
      <label className={giftCardFieldLabelClass} htmlFor={id}>{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className={cn(
          "min-h-[100px] w-full resize-none bg-gray200 p-3 font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:text-gray600",
          hasValue && "border border-darkblack",
        )}
      />
    </div>
  );
};

type GiftCardToggleOptionProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
};

export const GiftCardToggleOption = ({ label, selected, onSelect }: GiftCardToggleOptionProps) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      "flex h-14 flex-1 items-center justify-center p-3 font-gill text-base font-normal leading-110 text-darkblack transition-colors",
      selected ? "bg-gold300" : "bg-gray200",
    )}
  >
    {label}
  </button>
);

type GiftCardCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export const GiftCardCheckbox = ({ checked, onChange, label }: GiftCardCheckboxProps) => (
  <label className="flex cursor-pointer items-center gap-2">
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex size-6 shrink-0 items-center justify-center border-[0.8px] border-darkblack bg-white",
        checked && "border-transparent bg-linkGold",
      )}
    >
      <Check
        className={cn("size-3.5 text-white transition-opacity", checked ? "opacity-100" : "opacity-0")}
        strokeWidth={2.5}
      />
    </button>
    <span className="font-gill text-base font-light leading-110 text-darkblack">{label}</span>
  </label>
);

type GiftCardPanelHeaderProps = {
  onClose: () => void;
  onBack?: () => void;
  title: string;
};

export const GiftCardPanelHeader = ({ onClose, onBack, title }: GiftCardPanelHeaderProps) => (
  <div className="shrink-0 px-6 pt-10">
    <div className="flex h-[26px] items-center justify-between">
      <div className="flex items-center gap-2">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="flex size-6 items-center justify-center text-darkblack"
          >
            <ChevronLeft className="size-6" strokeWidth={1.5} />
          </button>
        ) : null}
        <h2 className="font-larken text-32 font-light leading-110 text-darkblack">{title}</h2>
      </div>
      <button type="button" onClick={onClose} aria-label="Close gift card flow">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
    <div className="mt-6 h-px w-full bg-neutral300" aria-hidden />
  </div>
);
