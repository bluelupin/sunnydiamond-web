"use client";

import { Fragment, useState } from "react";
import { Plus } from "lucide-react";
import InformationIcon from "@/assets/Icons/InformationIcon";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { cn } from "@/shared/utils/cn";
import { profileTabsContent } from "../data/profileContent";
import type { OrderFilterKey, ProfileOrderSubState } from "../types/profileUi.types";

export function ProfileEmailVerifiedBadge({ label }: { label: string }) {
  return (
    <span className="flex shrink-0 items-center gap-1 font-gill text-sm font-normal uppercase leading-110 text-green600">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M1 10.75L6.25 16L18.25 4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </span>
  );
}

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
  return <div className={cn("bg-gray300 md:p-6 p-4", className)}>{children}</div>;
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
        "flex w-full flex-col items-center justify-center gap-6 bg-gray300 p-4 text-darkblack transition-colors min-h-[246px] md:min-h-[262px] md:p-6",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white">
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
    background: "bg-[#FEDCDC]",
    dot: "bg-[#F91616]",
    labelWeight: "font-light",
  },
  returned: {
    background: "bg-gray300",
    dot: "bg-gray600",
    labelWeight: "font-light",
  },
};

/** Copy shown while Magento is still processing a cancellation/return. */
const SUB_STATE_LABELS: Record<ProfileOrderSubState, string> = {
  cancellation_in_progress: profileTabsContent.orders.statusCancellationInProgress,
  return_in_progress: profileTabsContent.orders.statusReturnInProgress,
};

export function ProfileStatusBadge({
  label,
  category = "in_progress",
  subState,
}: {
  label: string;
  category?: OrderFilterKey;
  subState?: ProfileOrderSubState;
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
      {subState ? SUB_STATE_LABELS[subState] : label}
    </span>
  );
}

/** Figma 1480:22300 — compact status pill for mobile order cards */
export function ProfileOrderMobileStatusBadge({
  label,
  category = "in_progress",
  subState,
}: {
  label: string;
  category?: OrderFilterKey;
  subState?: ProfileOrderSubState;
}) {
  const variant = STATUS_BADGE_VARIANTS[category];

  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-2 px-3 py-2 font-gill text-sm font-normal leading-110 text-darkblack",
        variant.background,
      )}
    >
      <span className={cn("size-2 shrink-0 rounded-full", variant.dot)} aria-hidden />
      {subState ? SUB_STATE_LABELS[subState] : label}
    </span>
  );
}

export function ProfileOrderCardDivider() {
  return <div className="lg:h-px h-[0.5px] w-full shrink-0 bg-neutral300" aria-hidden />;
}

/** Figma 1536:30206 — mauve pill for gift / bespoke order line items. */
export function ProfileOrderItemBadge({ label }: { label: string }) {
  return (
    <span
      className="absolute -left-px -top-px bg-mauve300 px-3 py-1 font-gill text-sm font-normal leading-110 text-darkblack"
    >
      {label}
    </span>
  );
}

export function ProfileDfeSectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-6 bg-gray300 md:p-6 p-4">
      <h2 className="font-gill text-xl font-normal leading-110 text-darkblack">{title}</h2>
      {children}
    </div>
  );
}

export function ProfileDfeReadOnlyField({
  label,
  value,
  mutedLabel = false,
  className,
}: {
  label: string;
  value: string;
  mutedLabel?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-[508px] flex-col gap-2", className)}>
      <p
        className={cn(
          "font-gill text-base font-normal leading-110",
          mutedLabel ? "text-[#2B2B2B]" : "text-darkblack",
        )}
      >
        {label}
      </p>
      <p className="font-gill text-base font-normal leading-110 text-darkblack">{value}</p>
    </div>
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
  activeKey: T | null;
  onChange: (key: T) => void;
  scrollOnMobile?: boolean;
  className?: string;
}) {
  const wrapperClass = scrollOnMobile
    ? cn(
      "-mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-nowrap lg:justify-end lg:overflow-visible lg:px-0 horizontalScrollbar",
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
              "shrink-0 px-4 py-2 font-gill text-base leading-110 text-darkblack transition-colors",
              isActive ? "font-normal bg-lightGold" : "font-light bg-gray300",
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
    <div className="flex w-full items-center gap-2 font-gill text-base font-light leading-110 text-darkblack">
      <InformationIcon className="size-6 shrink-0 text-darkblack" />
      <p className="min-w-0 flex-1 text-darkblack font-light">{children}</p>
    </div>
  );
}

export function ProfileTabEmptyStateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-[min(520px,100vh)] items-center justify-center">
      <div className="flex w-full max-w-[464px] flex-col items-center md:gap-6 gap-4 text-center">
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
                className="flex w-full items-start gap-2 text-left lg:min-h-14 lg:items-center"
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
                  <p className="md:pb-4 md:pt-0 pt-4 font-gill text-sm font-light leading-110 text-neutral500 lg:text-base lg:text-xl">
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
