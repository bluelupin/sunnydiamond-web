"use client";

import { Check, ChevronDown, Pencil } from "lucide-react";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/utils/cn";

export type CheckoutFieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
};

export const CheckoutField = ({
  id,
  label,
  optional,
  value,
  onChange,
  placeholder = "Enter",
  type = "text",
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
      placeholder={placeholder}
      className="h-14 w-full border border-transparent bg-aboutInactive px-3 font-gill text-base leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600 focus:border-darkblack"
    />
  </div>
);

type CheckoutSelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

export const CheckoutSelectField = ({
  id,
  label,
  value,
  onChange,
  options,
}: CheckoutSelectFieldProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="font-gill text-base font-normal leading-110 text-darkblack">
      {label}
    </label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        className="h-14 rounded-none border-0 bg-aboutInactive px-3 font-gill text-base text-darkblack focus:ring-0"
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
  </div>
);

type CheckoutPhoneFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  verified?: boolean;
  onVerify?: () => void;
  showVerify?: boolean;
};

export const CheckoutPhoneField = ({
  id,
  label,
  value,
  onChange,
  verified,
  onVerify,
  showVerify = true,
}: CheckoutPhoneFieldProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="font-gill text-base font-normal leading-110 text-darkblack">
      {label}
    </label>
    <div className="flex h-14 items-center justify-between gap-2 border border-transparent bg-aboutInactive px-3 focus-within:border-darkblack">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="shrink-0 font-gill text-base font-normal leading-110 text-darkblack">+91</span>
        <ChevronDown className="size-5 shrink-0 text-darkblack" aria-hidden />
        <input
          id={id}
          type="tel"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter"
          className="min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600"
        />
      </div>
      {showVerify ? (
        verified ? (
          <span className="flex shrink-0 items-center gap-1 font-gill text-base font-normal leading-110 text-[#47CB6C]">
            <Check className="size-4" strokeWidth={2.5} />
            Verified
          </span>
        ) : (
          <DetailTextLink onClick={onVerify}>Verify</DetailTextLink>
        )
      ) : null}
    </div>
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
  <section className={cn("flex flex-col bg-white px-4 py-6", gapClassName, className)}>
    {children}
  </section>
);

type CheckoutSectionHeadingProps = {
  children: React.ReactNode;
  onEdit?: () => void;
};

export const CheckoutSectionHeading = ({ children, onEdit }: CheckoutSectionHeadingProps) => (
  <div className="flex items-center justify-between gap-4">
    <h2 className="font-gill text-2xl font-normal leading-110 text-darkblack">{children}</h2>
    {onEdit ? (
      <button type="button" onClick={onEdit} aria-label={`Edit ${children}`}>
        <Pencil className="size-4 text-darkblack" />
      </button>
    ) : null}
  </div>
);

export const CheckoutSubheading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-gill text-xl font-normal leading-110 text-darkblack">{children}</h3>
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
};

export const CheckoutRadioOption = ({
  checked,
  onChange,
  label,
  children,
}: CheckoutRadioOptionProps) => (
  <div className="flex flex-col gap-4">
    <label className="flex cursor-pointer items-center gap-2">
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        onClick={onChange}
        className="flex size-4 shrink-0 items-center justify-center rounded-full border-[0.8px] border-darkblack bg-white"
      >
        <span className={cn("size-2 rounded-full bg-darkblack transition-opacity", checked ? "opacity-100" : "opacity-0")} />
      </button>
      <span className="font-gill text-base font-normal leading-110 text-darkblack">{label}</span>
    </label>
    {checked ? children : null}
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
    <div className="font-gill text-base font-light leading-110 text-darkblack">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  </div>
);
