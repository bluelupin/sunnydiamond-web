"use client";

import { Check, ChevronDown } from "lucide-react";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import FormFieldError from "@/shared/ui/FormFieldError";
import PhoneCountryCodeSelect from "@/shared/ui/PhoneCountryCodeSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/utils/cn";
import { invalidFieldClassName, invalidFieldContainerClassName } from "@/shared/utils/formValidation";
import { DEFAULT_COUNTRY_CODE } from "@/shared/constants/appointmentForm";
import ChevronDownIcon from "@/assets/Icons/ChevronDownIcon";

function formatRequiredFieldLabel(label: string): string {
  return label.endsWith("*") ? label : `${label}*`;
}

type CheckoutFieldLabelProps = {
  id: string;
  label: string;
  optional?: boolean;
};

const CheckoutFieldLabel = ({ id, label, optional }: CheckoutFieldLabelProps) => (
  <label htmlFor={id} className="font-gill text-base font-normal leading-110 text-darkblack">
    {optional ? label : formatRequiredFieldLabel(label)}
    {optional ? <span className="font-light text-gray600"> (Optional)</span> : null}
  </label>
);

export type CheckoutFieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  error?: string;
  invalid?: boolean;
  disabled?: boolean;
};

export const CheckoutField = ({
  id,
  label,
  optional,
  value,
  onChange,
  onBlur,
  placeholder = "Enter",
  type = "text",
  error,
  invalid,
  disabled = false,
}: CheckoutFieldProps) => (
  <div className="flex flex-col gap-2">
    <CheckoutFieldLabel id={id} label={label} optional={optional} />
    <input
      id={id}
      type={type}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      aria-invalid={invalid || undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(
        "h-14 w-full border border-transparent bg-aboutInactive px-3 font-gill text-base leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600 focus:border-darkblack",
        disabled && "cursor-not-allowed opacity-60",
        invalid && invalidFieldClassName,
      )}
    />
    <FormFieldError id={`${id}-error`} message={error} />
  </div>
);

type CheckoutSelectFieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  invalid?: boolean;
  disabled?: boolean;
};

export const CheckoutSelectField = ({
  id,
  label,
  optional,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "-select-",
  error,
  invalid,
  disabled = false,
}: CheckoutSelectFieldProps) => (
  <div className="flex flex-col gap-2">
    <CheckoutFieldLabel id={id} label={label} optional={optional} />
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(nextValue) => {
        onChange(nextValue);
        onBlur?.();
      }}
    >
      <SelectTrigger
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "h-14 rounded-none border-0 bg-aboutInactive px-3 font-gill text-base text-darkblack focus:ring-0",
          invalid && invalidFieldClassName,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <FormFieldError id={`${id}-error`} message={error} />
  </div>
);

type CheckoutPhoneFieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  countryCode?: string;
  onCountryCodeChange?: (code: string) => void;
  verified?: boolean;
  onVerify?: () => void;
  showVerify?: boolean;
  /** "email" locks the field to an address — no country prefix, no phone parsing. */
  mode?: "phone" | "phoneOrEmail" | "email";
  error?: string;
  invalid?: boolean;
  disabled?: boolean;
};

export const CheckoutPhoneField = ({
  id,
  label,
  optional,
  value,
  onChange,
  onBlur,
  countryCode = DEFAULT_COUNTRY_CODE,
  onCountryCodeChange,
  verified,
  onVerify,
  showVerify = true,
  mode = "phone",
  error,
  invalid,
  disabled = false,
}: CheckoutPhoneFieldProps) => {
  const isEmailInput = mode === "email" || (mode === "phoneOrEmail" && /[a-zA-Z@]/.test(value));
  const shouldShowVerify = showVerify;

  return (
  <div className="flex flex-col gap-2">
    <CheckoutFieldLabel id={id} label={label} optional={optional} />
    <div
      className={cn(
        "relative flex h-14 items-center justify-between gap-2 border border-transparent bg-aboutInactive px-3 focus-within:border-darkblack",
        disabled && "cursor-not-allowed opacity-60",
        invalid && invalidFieldContainerClassName,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {!isEmailInput ? (
          <PhoneCountryCodeSelect
            id={`${id}-country-code`}
            value={countryCode}
            onChange={(code) => onCountryCodeChange?.(code)}
            disabled={disabled || !onCountryCodeChange}
          />
        ) : null}
        <input
          id={id}
          type={isEmailInput ? "email" : "tel"}
          inputMode={isEmailInput ? "email" : "numeric"}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder="Enter"
          autoComplete={isEmailInput ? "email" : "tel"}
          aria-invalid={invalid || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600",
            disabled && "cursor-not-allowed",
          )}
        />
      </div>
      {shouldShowVerify ? (
        verified ? (
          <span className="flex shrink-0 items-center gap-1 font-gill text-base font-normal leading-110 text-green600">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 10.75L6.25 16L18.25 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Verified
          </span>
        ) : (
          <DetailTextLink onClick={onVerify} disabled={disabled}>VERIFY</DetailTextLink>
        )
      ) : null}
    </div>
    <FormFieldError id={`${id}-error`} message={error} />
  </div>
  );
};

type CheckoutSectionCardProps = {
  children: React.ReactNode;
  className?: string;
  gapClassName?: string;
};

export const CheckoutSectionCard = ({
  children,
  className,
  gapClassName = "gap-6",
}: CheckoutSectionCardProps) => (
  <section className={cn("flex flex-col bg-white px-4 py-6 lg:px-6", gapClassName, className)}>
    {children}
  </section>
);

type CheckoutSectionHeadingProps = {
  children: React.ReactNode;
  onEdit?: () => void;
  editDisabled?: boolean;
};

export const CheckoutSectionHeading = ({
  children,
  onEdit,
  editDisabled = false,
}: CheckoutSectionHeadingProps) => (
  <div className="flex items-center justify-between gap-4">
    <h2 className="font-gill text-2xl font-normal leading-110 text-darkblack">{children}</h2>
    {onEdit ? (
      <DetailTextLink
        onClick={onEdit}
        disabled={editDisabled}
        className={editDisabled ? "opacity-40" : undefined}
      >
        EDIT
      </DetailTextLink>
    ) : null}
  </div>
);

export const CheckoutSubheading = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3 className={cn("font-gill text-xl font-normal leading-110 text-darkblack", className)}>
    {children}
  </h3>
);

type CheckoutCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  readOnly?: boolean;
  disabled?: boolean;
};

export const CheckoutCheckbox = ({
  checked,
  onChange,
  label,
  readOnly,
  disabled = false,
}: CheckoutCheckboxProps) => {
  const isLocked = Boolean(readOnly || disabled);

  return (
  <label className={cn("flex items-center gap-2", isLocked ? "cursor-default" : "cursor-pointer")}>
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => !isLocked && onChange(!checked)}
      disabled={isLocked}
      className={cn(
        "flex size-4 shrink-0 items-center justify-center border-[0.8px] border-darkblack bg-white",
        checked && "border-transparent bg-linkGold",
        isLocked && "cursor-not-allowed",
        disabled && "opacity-60",
      )}
    >
      <Check
        className={cn("size-3 text-white transition-opacity", checked ? "opacity-100" : "opacity-0")}
        strokeWidth={2.5}
      />
    </button>
    <span className="flex h-4 items-center font-gill text-base font-light leading-none text-darkblack">{label}</span>
  </label>
  );
};

type CheckoutRadioOptionProps = {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  children?: React.ReactNode;
  align?: "center" | "start";
  disabled?: boolean;
};

export const CheckoutRadioRow = ({
  checked,
  onChange,
  label,
  align = "center",
  disabled = false,
}: Omit<CheckoutRadioOptionProps, "children">) => (
  <label
    className={cn(
      "flex gap-2",
      disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      align === "start" ? "items-start" : "items-center",
    )}
  >
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onChange();
        }
      }}
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full border-[0.8px] border-darkblack bg-white",
        align === "start" && "mt-1",
      )}
    >
      <span
        className={cn(
          "size-2.5 rounded-full bg-darkblack transition-opacity",
          checked ? "opacity-100" : "opacity-0",
        )}
      />
    </button>
    <div className="font-gill text-base font-normal leading-110 text-darkblack">{label}</div>
  </label>
);

export const CheckoutRadioOption = ({
  checked,
  onChange,
  label,
  children,
  align = "center",
}: CheckoutRadioOptionProps) => (
  <div className="flex flex-col gap-4">
    <CheckoutRadioRow checked={checked} onChange={onChange} label={label} align={align} />
    {checked ? children : null}
  </div>
);

export const CheckoutSummaryDivider = () => (
  <div className="h-px w-full shrink-0 bg-neutral300" aria-hidden />
);

export const CheckoutPriceRow = ({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) => (
  <div className="flex items-center justify-between">
    <span
      className={cn(
        "font-gill text-base leading-110 text-darkblack",
        !emphasis && "font-light",
      )}
    >
      {label}
    </span>
    <span className="font-gill text-base font-normal leading-110 text-darkblack">{value}</span>
  </div>
);

export const CheckoutSummaryText = ({ children }: { children: React.ReactNode }) => (
  <p className="font-gill text-base font-light leading-110 text-darkblack">{children}</p>
);

export const CheckoutAddressBlock = ({
  name,
  lines,
}: {
  name: string;
  lines: string[];
}) => (
  <div className="flex flex-col gap-2">
    <p className="font-gill text-base font-normal leading-110 text-darkblack">{name}</p>
    <div className="font-gill text-base font-light leading-110 text-darkblack space-y-2">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  </div>
);
