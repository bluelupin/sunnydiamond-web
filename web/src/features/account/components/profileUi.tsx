"use client";

import { Fragment, useState } from "react";
import { Info, Plus } from "lucide-react";
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

export function ProfileTabEmptyStateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-[min(520px,55vh)] items-center justify-center">
      <div className="flex w-full max-w-[464px] flex-col items-center gap-6 text-center">
        {children}
      </div>
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
    <ProfileTabEmptyStateLayout>
      <h3 className="w-full font-larken text-32 font-light leading-110 text-darkblack">{title}</h3>
      {description ? (
        <div className="w-full font-gill text-base font-light leading-110 text-neutral500">
          {description}
        </div>
      ) : null}
      {action ? <div className="flex flex-col items-center gap-6">{action}</div> : null}
    </ProfileTabEmptyStateLayout>
  );
}

type ProfileAccordionItem = {
  id: string;
  question: string;
  answer: string;
};

const profileAccordionTransitionClassName =
  "transition-[grid-template-rows,opacity] duration-500 ease-in-out";

const profileAccordionIconTransitionClassName = "transition-opacity duration-500 ease-in-out";

const ProfileFaqPlusIcon = () => (
  <span className="relative size-6 shrink-0 overflow-hidden" aria-hidden>
    <span className="absolute inset-1/4">
      <svg viewBox="0 0 12 12" fill="none" className="size-full" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 6.5H0V5.5H5.5V0H6.5V5.5H12V6.5H6.5V12H5.5V6.5Z" fill="#0A0A0A" />
      </svg>
    </span>
  </span>
);

const ProfileFaqMinusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="size-6 shrink-0"
    aria-hidden
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17 12H5V11H17V12Z" fill="#0A0A0A" />
  </svg>
);

const ProfileFaqToggleIcon = ({ isOpen }: { isOpen: boolean }) => (
  <span className="relative flex size-6 shrink-0 items-center justify-center" aria-hidden>
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        profileAccordionIconTransitionClassName,
        isOpen ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <ProfileFaqPlusIcon />
    </span>
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        profileAccordionIconTransitionClassName,
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ProfileFaqMinusIcon />
    </span>
  </span>
);

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
          <Fragment key={item.id}>
            <div className="flex flex-col overflow-hidden rounded">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-start gap-2 py-6 text-left lg:min-h-14 lg:items-center lg:py-0"
                aria-expanded={isOpen}
              >
                <span className="min-w-0 flex-1 font-gill text-base font-normal leading-110 text-darkblack lg:text-xl">
                  {item.question}
                </span>
                <ProfileFaqToggleIcon isOpen={isOpen} />
              </button>

              <div
                className={cn(
                  "grid min-h-0",
                  profileAccordionTransitionClassName,
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
                aria-hidden={!isOpen}
              >
                <div className="overflow-hidden">
                  <p className="pt-4 font-gill text-base font-light leading-110 text-neutral500 lg:text-xl">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>

            {index < items.length - 1 ? (
              <div className="h-[0.5px] bg-neutral300" aria-hidden />
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
