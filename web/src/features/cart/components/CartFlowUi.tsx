import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import ShoppingBagIcon from "@/assets/Icons/ShoppingBagIcon";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { cn } from "@/shared/utils/cn";
import { cartFlowSpec } from "../data/cartFlowSpec";

export const CartDivider = ({
  weight = 1,
  color = "#CCCCCC",
}: {
  weight?: 0.5 | 1;
  color?: string;
}) => (
  <div className="w-full shrink-0" style={{ height: `${weight}px`, backgroundColor: color }} aria-hidden />
);

export const CartMetaRow = ({ parts }: { parts: string[] }) => {
  if (parts.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center"
      style={{ gap: cartFlowSpec.card.metaGap }}
    >
      {parts.map((part, index) => (
        <span key={part} className="flex items-center" style={{ gap: cartFlowSpec.card.metaGap }}>
          {index > 0 ? (
            <span
              className="w-[0.5px] shrink-0 bg-neutral300"
              style={{ height: cartFlowSpec.card.metaDividerHeight }}
              aria-hidden
            />
          ) : null}
          <span className="font-gill text-sm font-light leading-110 text-neutral500">{part}</span>
        </span>
      ))}
    </div>
  );
};

type CartGiftBadgeProps = {
  variant?: "cart" | "drawer";
  className?: string;
};

export const CartGiftBadge = ({ variant = "cart", className }: CartGiftBadgeProps) => (
  <span
    className={cn(
      "inline-flex shrink-0 items-center justify-center w-[42px] h-[22px] font-gill leading-110",
      variant === "cart"
        ? "text-sm text-darkblack"
        : "text-xs font-light tracking-[0.01em] text-white",
      className,
    )}
    style={{
      backgroundColor:
        variant === "cart"
          ? cartFlowSpec.colors.giftBadgeCart
          : cartFlowSpec.colors.giftBadgeDrawer,
    }}
  >
    Gift
  </span>
);

type CartGiftCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

export const CartGiftCheckbox = ({ checked, onChange, className }: CartGiftCheckboxProps) => (
  <span
    className={cn(
      "relative inline-flex shrink-0 items-center justify-center",
      checked ? "size-5" : "size-4",
      className,
    )}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="absolute inset-0 z-10 cursor-pointer opacity-0"
      aria-label="Mark this as a gift"
    />
    <span
      className={cn(
        "flex items-center justify-center transition-colors",
        checked
          ? "size-5 bg-linkGold"
          : "size-4 border-[0.8px] border-darkblack bg-white",
      )}
      aria-hidden
    >
      <Check
        className={cn(
          "transition-opacity",
          checked ? "size-3 text-white opacity-100" : "size-3 text-darkblack opacity-0",
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
};

export const CartTextLink = ({ children, href, onClick, className }: CartTextLinkProps) => (
  <DetailTextLink href={href} onClick={onClick} className={className}>
    {children}
  </DetailTextLink>
);

const cartButtonBase =
  "inline-flex w-full items-center justify-center font-gill text-sm uppercase leading-110";

export const CartPrimaryButton = ({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    className={cn(
      cartButtonBase,
      "btn-dark-slide border border-black text-white",
      className,
    )}
    style={{
      height: cartFlowSpec.button.height,
      padding: `${cartFlowSpec.button.paddingY}px ${cartFlowSpec.button.paddingX}px`,
    }}
    {...props}
  >
    <span className="relative z-10">{children}</span>
  </button>
);

export const CartOutlineButton = ({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    className={cn(
      cartButtonBase,
      "btn-border-slide border border-neutral300 text-darkblack",
      className,
    )}
    style={{
      height: cartFlowSpec.button.height,
      padding: `${cartFlowSpec.button.paddingY}px ${cartFlowSpec.button.paddingX}px`,
    }}
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
      "btn-dark-slide border border-black text-white",
      className,
    )}
    style={{
      height: cartFlowSpec.button.height,
      padding: `${cartFlowSpec.button.paddingY}px ${cartFlowSpec.button.paddingX}px`,
    }}
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
      "btn-border-slide border border-neutral300 text-darkblack",
      className,
    )}
    style={{
      height: cartFlowSpec.button.height,
      padding: `${cartFlowSpec.button.paddingY}px ${cartFlowSpec.button.paddingX}px`,
    }}
  >
    <span className="relative z-10">{children}</span>
  </Link>
);

export const CartSuccessCheck = () => (
  <span
    className="flex shrink-0 items-center justify-center"
    style={{ width: 40, height: 40, color: cartFlowSpec.colors.successGreen }}
    aria-hidden
  >
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.9414 20.9414L18.9414 24.9414L26.9414 16.9414M40.9414 20.9414C40.9414 31.9871 31.9871 40.9414 20.9414 40.9414C9.89571 40.9414 0.941406 31.9871 0.941406 20.9414C0.941406 9.89571 9.89571 0.941406 20.9414 0.941406C31.9871 0.941406 40.9414 9.89571 40.9414 20.9414Z" stroke="currentColor" strokeWidth="1.88235" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

type CartQuantityStepperProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export const CartQuantityStepper = ({
  quantity,
  onDecrease,
  onIncrease,
}: CartQuantityStepperProps) => (
  <div className="flex items-center" style={{ gap: cartFlowSpec.card.footerGap }}>
    <button
      type="button"
      onClick={onDecrease}
      aria-label="Decrease quantity"
      className="flex items-center justify-center bg-white font-gill text-xs leading-none text-darkblack"
      style={{
        width: cartFlowSpec.quantity.boxSize,
        height: cartFlowSpec.quantity.boxSize,
        border: `${cartFlowSpec.quantity.borderWeight}px solid ${cartFlowSpec.colors.headingText}`,
      }}
    >
      −
    </button>
    <span className="min-w-4 text-center font-gill text-base leading-110 text-darkblack">
      {quantity}
    </span>
    <button
      type="button"
      onClick={onIncrease}
      aria-label="Increase quantity"
      className="flex items-center justify-center bg-white font-gill text-xs leading-none text-darkblack"
      style={{
        width: cartFlowSpec.quantity.boxSize,
        height: cartFlowSpec.quantity.boxSize,
        border: `${cartFlowSpec.quantity.borderWeight}px solid ${cartFlowSpec.colors.headingText}`,
      }}
    >
      +
    </button>
  </div>
);

type CartMoreItemsNoteProps = {
  count: number;
};

export const CartMoreItemsNote = ({ count }: CartMoreItemsNoteProps) => (
  <div className="flex items-center" style={{ gap: cartFlowSpec.card.metaGap }}>
    <ShoppingBagIcon className="size-6 shrink-0 text-darkblack" />
    <p className="font-gill text-base font-light leading-110 text-darkblack">
      Your bag contains {count} more {count === 1 ? "item" : "items"}
    </p>
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
