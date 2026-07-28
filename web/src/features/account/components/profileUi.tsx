"use client";

import { useState } from "react";
import { ChevronDown, Info, Plus } from "lucide-react";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { cn } from "@/shared/utils/cn";
import type { OrderFilterKey } from "../types/profileUi.types";

export function ProfileSectionHeader({
  title,
  actionLabel,
  onAction,
  className,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">{title}</h2>
      {actionLabel && onAction ? (
        <DetailTextLink onClick={onAction} className="shrink-0 text-sm uppercase">
          {actionLabel}
        </DetailTextLink>
      ) : null}
    </div>
  );
}

export function ProfileCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("bg-gray300 p-6", className)}>{children}</div>;
}

export function ProfileAddAddressCard({
  label,
  onClick,
  disabled,
  className,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-6 bg-gray300 p-6 text-darkblack transition-colors",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-white">
        <Plus className="size-10 shrink-0" strokeWidth={1.5} aria-hidden />
      </span>
      <span className="font-gill text-base font-light leading-110">{label}</span>
    </button>
  );
}

const STATUS_BADGE_VARIANTS: Record<
  OrderFilterKey,
  { background: string; dot: string; labelWeight: string }
> = {
  in_progress: {
    background: "bg-yellow100",
    dot: "bg-yellow600",
    labelWeight: "font-normal",
  },
  delivered: {
    background: "bg-gray300",
    dot: "bg-gray600",
    labelWeight: "font-light",
  },
  cancelled: {
    background: "bg-gray300",
    dot: "bg-gray600",
    labelWeight: "font-light",
  },
  returned: {
    background: "bg-gray300",
    dot: "bg-gray600",
    labelWeight: "font-light",
  },
};

export function ProfileStatusBadge({
  label,
  category = "in_progress",
}: {
  label: string;
  category?: OrderFilterKey;
}) {
  const variant = STATUS_BADGE_VARIANTS[category];

  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-2 self-start px-4 py-2 font-gill text-base leading-110 whitespace-nowrap text-darkblack",
        variant.background,
        variant.labelWeight,
      )}
    >
      <span className={cn("size-2 shrink-0 rounded-full", variant.dot)} aria-hidden />
      {label}
    </span>
  );
}

export function ProfileInlineActions({
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  disabled,
}: {
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <DetailTextLink
        onClick={disabled ? undefined : onSecondary}
        className={cn(
          "text-sm uppercase",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        {secondaryLabel}
      </DetailTextLink>
      <span className="h-4 w-px bg-neutral300" aria-hidden />
      <DetailTextLink
        onClick={disabled ? undefined : onPrimary}
        className={cn(
          "text-sm uppercase",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        {primaryLabel}
      </DetailTextLink>
    </div>
  );
}

export function ProfileMetaDivider({ className }: { className?: string }) {
  return <span className={cn("h-3.5 w-px shrink-0 bg-neutral300", className)} aria-hidden />;
}

export function ProfileFilterChips<T extends string>({
  options,
  activeKey,
  onChange,
  scrollOnMobile = false,
  className,
}: {
  options: { key: T; label: string; mobileLabel?: string }[];
  activeKey: T;
  onChange: (key: T) => void;
  scrollOnMobile?: boolean;
  className?: string;
}) {
  const wrapperClass = scrollOnMobile
    ? cn(
        "-mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-nowrap lg:justify-end lg:overflow-visible lg:px-0",
        className,
      )
    : cn("flex flex-wrap gap-2", className);

  return (
    <div className={wrapperClass}>
      {options.map((option) => {
        const isActive = activeKey === option.key;
        const chipLabel = option.mobileLabel ?? option.label;

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={cn(
              "shrink-0 bg-gray300 px-4 py-2 font-gill text-base leading-110 text-darkblack transition-colors",
              isActive ? "font-normal" : "font-light",
            )}
          >
            {chipLabel}
          </button>
        );
      })}
    </div>
  );
}

export function ProfileInnerPanel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-gray300 p-6", className)}>
      <h4 className="mb-4 font-larken text-xl font-light leading-110 text-darkblack">
        {title}
      </h4>
      {children}
    </div>
  );
}

export function ProfileInfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 font-gill text-base font-light leading-110 text-darkblack">
      <Info className="size-6 shrink-0" strokeWidth={1.5} aria-hidden />
      <p>{children}</p>
    </div>
  );
}

export function ProfileEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 py-6">
      <h3 className="font-larken text-32 font-light leading-110 text-darkblack">{title}</h3>
      {description ? (
        <div className="max-w-lg font-gill text-base font-light leading-110 text-neutral500">
          {description}
        </div>
      ) : null}
      {action}
    </div>
  );
}

type ProfileAccordionItem = {
  id: string;
  question: string;
  answer: string;
};

export function ProfileAccordion({
  items,
}: {
  items: readonly ProfileAccordionItem[];
}) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="flex w-full flex-col gap-4">
      {items.map((item, index) => {
        const isOpen = openId === item.id;

        return (
          <div key={item.id} className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-2 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-gill text-xl font-normal leading-110 text-darkblack">
                {item.question}
              </span>
              {isOpen ? (
                <ChevronDown className="size-6 shrink-0 text-darkblack" aria-hidden />
              ) : (
                <Plus className="size-6 shrink-0 text-darkblack" aria-hidden />
              )}
            </button>
            {isOpen ? (
              <p className="font-gill text-xl font-light leading-110 text-neutral500">
                {item.answer}
              </p>
            ) : null}
            {index < items.length - 1 ? (
              <div className="h-px w-full bg-neutral300" aria-hidden />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
