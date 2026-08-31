import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import ShoppingBagIcon from "@/assets/Icons/ShoppingBagIcon";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { cn } from "@/shared/utils/cn";

const cartButtonSizing = "h-14 px-7 py-5";

export const CartDivider = ({
  weight = 1,
  className,
}: {
  weight?: 0.5 | 1;
  className?: string;
}) => (
  <div
    className={cn(
      "w-full shrink-0 bg-neutral300",
      weight === 0.5 ? "h-[0.5px]" : "h-px",
      className,
    )}
    aria-hidden
  />
);

export const CartMetaRow = ({
  parts,
  variant = "default",
}: {
  parts: string[];
  variant?: "default" | "checkout";
}) => {
  if (parts.length === 0) return null;

  const labelClassName =
    variant === "checkout"
      ? "font-gill text-sm font-light leading-normal tracking-[0.14px] text-darkblack"
      : "font-gill text-sm font-light leading-110 text-neutral500";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {parts.map((part, index) => (
        <span key={part} className="flex items-center gap-2">
          {index > 0 ? (
            <span className="h-4 w-[0.5px] shrink-0 bg-neutral300" aria-hidden />
          ) : null}
          <span className={labelClassName}>{part}</span>
        </span>
      ))}
    </div>
  );
};

type CartGiftBadgeProps = {
  variant?: "cart" | "drawer" | "checkout";
  className?: string;
};

export const CartGiftBadge = ({ variant = "cart", className }: CartGiftBadgeProps) => (
  <span
    className={cn(
      "inline-flex shrink-0 items-center justify-center font-gill text-darkblack",
      variant === "cart"
        ? "h-[22px] w-[42px] bg-[#D9B0CB] text-sm leading-110"
        : variant === "checkout"
          ? "bg-[#D9B0CB] px-3 py-1 text-sm font-normal leading-110"
          : "bg-[#D9B0CB] text-xs font-light leading-110 tracking-[0.01em]",
      className,
    )}
  >
    Gift
  </span>
);

type CartGiftCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
};

export const CartGiftCheckbox = ({
  checked,
  onChange,
  className,
  disabled = false,
}: CartGiftCheckboxProps) => (
  <span
    className={cn(
      "relative inline-flex size-4 shrink-0 items-center justify-center lg:size-5",
      disabled && "cursor-not-allowed opacity-60",
      className,
    )}
  >
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
      className="absolute inset-0 z-10 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
      aria-label="Mark this as a gift"
    />
    <span
      className={cn(
        "flex items-center justify-center transition-colors",
        checked
          ? "size-4 bg-linkGold lg:size-5"
          : "size-4 border-[0.8px] border-darkblack bg-white lg:size-5",
      )}
      aria-hidden
    >
      <Check
        className={cn(
          "size-3 transition-opacity",
          checked ? "text-white opacity-100" : "text-darkblack opacity-0",
        )}
        strokeWidth={2.5}
      />
    </span>
  </span>
);

type CartTextLinkProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export const CartTextLink = ({
  children,
  href,
  onClick,
  className,
  disabled = false,
}: CartTextLinkProps) => (
  <DetailTextLink href={href} onClick={onClick} className={className} disabled={disabled}>
    {children}
  </DetailTextLink>
);

const cartButtonBase =
  "inline-flex w-full items-center justify-center font-gill text-sm uppercase leading-110";

export const CartPrimaryButton = ({
  children,
  className,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    disabled={disabled}
    className={cn(
      cartButtonBase,
      cartButtonSizing,
      "btn-dark-slide border border-black text-white",
      disabled && "cursor-not-allowed opacity-60",
      className,
    )}
    {...props}
  >
    <span className="relative z-10">{children}</span>
  </button>
);

export const CartOutlineButton = ({
  children,
  className,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    disabled={disabled}
    className={cn(
      cartButtonBase,
      cartButtonSizing,
      "btn-border-slide border border-neutral300 text-darkblack",
      disabled && "cursor-not-allowed opacity-60",
      className,
    )}
    {...props}
  >
    <span className="relative z-10">{children}</span>
  </button>
);

type CartPrimaryLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
};

export const CartPrimaryLink = ({ children, href, className, onClick }: CartPrimaryLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      cartButtonBase,
      cartButtonSizing,
      "btn-dark-slide border border-black text-white",
      className,
    )}
  >
    <span className="relative z-10">{children}</span>
  </Link>
);

type CartOutlineLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
};

export const CartOutlineLink = ({ children, href, className, onClick }: CartOutlineLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      cartButtonBase,
      cartButtonSizing,
      "btn-border-slide border border-neutral300 text-darkblack",
      className,
    )}
  >
    <span className="relative z-10">{children}</span>
  </Link>
);

type CartSuccessCheckProps = {
  /** Figma bag drawer (2574:58792): 64px; default checkout/gift flows: 40px */
  size?: "sm" | "lg";
};

export const CartSuccessCheck = ({ size = "sm" }: CartSuccessCheckProps) => {
  const isLarge = size === "lg";

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center text-[#47CB6C]",
        isLarge ? "size-16" : "size-10",
      )}
      aria-hidden
    >
      <svg
        width={isLarge ? 64 : 42}
        height={isLarge ? 64 : 42}
        viewBox="0 0 42 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.9414 20.9414L18.9414 24.9414L26.9414 16.9414M40.9414 20.9414C40.9414 31.9871 31.9871 40.9414 20.9414 40.9414C9.89571 40.9414 0.941406 31.9871 0.941406 20.9414C0.941406 9.89571 9.89571 0.941406 20.9414 0.941406C31.9871 0.941406 40.9414 9.89571 40.9414 20.9414Z"
          stroke="currentColor"
          strokeWidth="1.88235"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};

type CartBagDrawerSuccessHeaderProps = {
  message: string;
};

/** Figma node 2574:58791 — bag drawer add-to-bag success */
export const CartBagDrawerSuccessHeader = ({ message }: CartBagDrawerSuccessHeaderProps) => (
  <div className="flex w-full flex-col items-center gap-4 text-center">
    <CartSuccessCheck size="lg" />
    <p className="m-0 font-gill text-base font-light leading-110 text-darkblack">{message}</p>
  </div>
);

type CartQuantityStepperProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled?: boolean;
};

const quantityButtonClassName =
  "flex size-4 items-center justify-center border-[0.8px] border-darkblack bg-white font-gill text-xs leading-none text-darkblack disabled:cursor-not-allowed disabled:opacity-60";

export const CartQuantityStepper = ({
  quantity,
  onDecrease,
  onIncrease,
  disabled = false,
}: CartQuantityStepperProps) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={onDecrease}
      disabled={disabled}
      aria-label="Decrease quantity"
      className={quantityButtonClassName}
    >
      −
    </button>
    <span className="min-w-4 text-center font-gill text-base leading-110 text-darkblack">
      {quantity}
    </span>
    <button
      type="button"
      onClick={onIncrease}
      disabled={disabled}
      aria-label="Increase quantity"
      className={quantityButtonClassName}
    >
      +
    </button>
  </div>
);

type CartMoreItemsNoteProps = {
  count: number;
};

export const CartMoreItemsNote = ({ count }: CartMoreItemsNoteProps) => (
  <div className="flex w-full items-center">
    <div className="flex h-6 shrink-0 items-center gap-2">
      <span className="inline-flex size-6 shrink-0 items-center justify-center overflow-hidden text-darkblack">
        <ShoppingBagIcon className="size-6" />
      </span>
      <p className="m-0 flex h-6 items-center font-gill text-base font-light leading-110 text-darkblack whitespace-nowrap">
        Your bag contains {count} more {count === 1 ? "item" : "items"}
      </p>
    </div>
  </div>
);

type CartPriceRowProps = {
  label: string;
  value: string;
  emphasis?: boolean;
};

export const CartPriceRow = ({ label, value, emphasis }: CartPriceRowProps) => (
  <div className="flex items-center justify-between">
    <span
      className={cn(
        "font-gill text-base leading-110 text-darkblack",
        !emphasis && "font-light",
      )}
    >
      {label}
    </span>
    <span className="font-gill text-base leading-110 text-darkblack">{value}</span>
  </div>
);
