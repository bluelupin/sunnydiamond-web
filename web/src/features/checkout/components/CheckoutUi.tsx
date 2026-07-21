"use client";

import { Check, ChevronDown } from "lucide-react";
import EditIcon from "@/assets/Icons/EditIcon";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import FormFieldError from "@/shared/ui/FormFieldError";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/utils/cn";
import { invalidFieldClassName, invalidFieldContainerClassName } from "@/shared/utils/formValidation";
import ChevronDownIcon from "@/assets/Icons/ChevronDownIcon";

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
}: CheckoutFieldProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="font-gill text-base font-normal leading-110 text-darkblack">
      {label}
      {optional ? (
        <span className="font-light text-gray600"> (Optional)</span>
      ) : null}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      aria-invalid={invalid || undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(
        "h-14 w-full border border-transparent bg-aboutInactive px-3 font-gill text-base leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600 focus:border-darkblack",
        invalid && invalidFieldClassName,
      )}
    />
    <FormFieldError id={`${id}-error`} message={error} />
  </div>
);

type CheckoutSelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: { value: string; label: string }[];
  error?: string;
  invalid?: boolean;
};

export const CheckoutSelectField = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  options,
  error,
  invalid,
}: CheckoutSelectFieldProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="font-gill text-base font-normal leading-110 text-darkblack">
      {label}
    </label>
    <Select
      value={value}
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
        <SelectValue placeholder="-select-" />
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
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  verified?: boolean;
  onVerify?: () => void;
  showVerify?: boolean;
  error?: string;
  invalid?: boolean;
};

export const CheckoutPhoneField = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  verified,
  onVerify,
  showVerify = true,
  error,
  invalid,
}: CheckoutPhoneFieldProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="font-gill text-base font-normal leading-110 text-darkblack">
      {label}
    </label>
    <div
      className={cn(
        "flex h-14 items-center justify-between gap-2 border border-transparent bg-aboutInactive px-3 focus-within:border-darkblack",
        invalid && invalidFieldContainerClassName,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="shrink-0 font-gill text-base font-normal leading-110 text-darkblack">+91</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-darkblack">
          <path fillRule="evenodd" clipRule="evenodd" d="M2.13134 7.6664C2.17617 7.62638 2.23002 7.59412 2.28982 7.57145C2.34963 7.54879 2.4142 7.53616 2.47986 7.53431C2.54552 7.53245 2.61097 7.54139 2.67248 7.56063C2.73399 7.57986 2.79035 7.60901 2.83833 7.6464L9.99833 13.2131L17.1583 7.6464C17.2553 7.57092 17.3842 7.53063 17.5168 7.53438C17.6494 7.53813 17.7748 7.58562 17.8653 7.6664C17.9559 7.74718 18.0043 7.85463 17.9998 7.96513C17.9953 8.07562 17.9383 8.18009 17.8413 8.25557L10.3413 14.0889C10.2488 14.1608 10.1269 14.2008 10.0003 14.2008C9.87376 14.2008 9.7519 14.1608 9.65933 14.0889L2.15933 8.25557C2.11124 8.21826 2.07245 8.17343 2.04516 8.12362C2.01787 8.07382 2.00263 8.02002 2.00031 7.9653C1.99799 7.91058 2.00863 7.85602 2.03163 7.80474C2.05462 7.75345 2.08953 7.70644 2.13433 7.6664H2.13134Z" fill="currentColor" />
        </svg>
        <input
          id={id}
          type="tel"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder="Enter"
          aria-invalid={invalid || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600"
        />
      </div>
      {showVerify ? (
        verified ? (
          <span className="flex shrink-0 items-center gap-1 font-gill text-base font-normal leading-110 text-green600">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 10.75L6.25 16L18.25 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Verified
          </span>
        ) : (
          <DetailTextLink onClick={onVerify}>VERIFY</DetailTextLink>
        )
      ) : null}
    </div>
    <FormFieldError id={`${id}-error`} message={error} />
  </div>
);

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
};

export const CheckoutSectionHeading = ({ children, onEdit }: CheckoutSectionHeadingProps) => (
  <div className="flex items-center justify-between">
    <h2 className="font-gill text-xl font-normal leading-110 text-darkblack lg:text-2xl">{children}</h2>
    {onEdit ? (
      <button type="button" onClick={onEdit} aria-label={`Edit ${children}`} className="shrink-0">
        <EditIcon className="size-6 text-darkblack" />
      </button>
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
};

export const CheckoutCheckbox = ({ checked, onChange, label, readOnly }: CheckoutCheckboxProps) => (
  <label className={cn("flex items-center gap-2", readOnly ? "cursor-default" : "cursor-pointer")}>
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => !readOnly && onChange(!checked)}
      disabled={readOnly}
      className={cn(
        "flex size-4 shrink-0 items-center justify-center border-[0.8px] border-darkblack bg-white",
        checked && "border-transparent bg-linkGold",
        readOnly && "cursor-default",
      )}
    >
      <Check
        className={cn("size-3 text-white transition-opacity", checked ? "opacity-100" : "opacity-0")}
        strokeWidth={2.5}
      />
    </button>
    <span className="font-gill text-base font-light leading-110 text-darkblack">{label}</span>
  </label>
);

type CheckoutRadioOptionProps = {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  children?: React.ReactNode;
  align?: "center" | "start";
};

export const CheckoutRadioRow = ({
  checked,
  onChange,
  label,
  align = "center",
}: Omit<CheckoutRadioOptionProps, "children">) => (
  <label
    className={cn(
      "flex cursor-pointer gap-2",
      align === "start" ? "items-start" : "items-center",
    )}
  >
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onChange}
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
