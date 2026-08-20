"use client";

import { useMemo } from "react";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import { cn } from "@/shared/utils/cn";
import { usePathname } from "next/navigation";
import type { HomepageShoppingBlocksData } from "@/types/homepage/categoryNavigation";
import type { NormalizedHomepageShell } from "@/services/homepage/homepageShell.service";

interface TrustBadgeMarqueeProps {
  id?: string;
  itemClassName?: string;
  items: TrustMarqueeItem[];
  isLoading: boolean;
}

type TrustMarqueeItem = {
  id?: number | string;
  label?: string;
};

function resolveHomepageTrustMarqueeItems(
  shoppingData?: HomepageShoppingBlocksData | null,
): TrustMarqueeItem[] {
  const cmsTrustBadges =
    shoppingData?.homepage?.trustBadges ?? shoppingData?.trustBadges ?? [];

  return cmsTrustBadges
    .filter((badge) => badge?.isActive !== false)
    .map((badge) => ({
      id: badge.id,
      label: badge.label?.trim() ?? "",
    }))
    .filter((badge) => badge.label);
}

function resolveFooterTrustMarqueeItems(
  shellData?: NormalizedHomepageShell | null,
): TrustMarqueeItem[] {
  return (shellData?.global?.footerTickerItems ?? [])
    .filter((item) => item?.isActive !== false && item?.showField !== false)
    .map((item) => ({
      id: item.id,
      label: item.label?.trim() ?? "",
    }))
    .filter((item) => item.label);
}

function TrustBadgeMarquee({
  id,
  itemClassName = "text-gray500",
  items,
  isLoading,
}: TrustBadgeMarqueeProps) {
  const pathName = usePathname();

  const marqueeItems = useMemo(() => [...items, ...items], [items]);
  const showSkeleton = isLoading && marqueeItems.length === 0;

  if (!showSkeleton && marqueeItems.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className={cn(
        pathName === "/cart" || pathName === "/checkout" ? "bg-gray200" : "bg-gray300",
        "shrink-0 overflow-hidden border-t border-ivory/10 text-ivory",
      )}
    >
      <div className="relative flex h-[64px] overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center whitespace-nowrap">
          {showSkeleton ? (
            <div className="flex items-center gap-12 pr-12 whitespace-nowrap">
              <div className="h-3 w-40 bg-gray500/20 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gray500/20 rounded animate-pulse" />
              <div className="h-3 w-44 bg-gray500/20 rounded animate-pulse" />
            </div>
          ) : (
            marqueeItems.map((item, idx) => (
              <div
                key={`marquee-a-${item.id ?? item.label}-${idx}`}
                className="flex items-center font-normal text-xs md:text-sm tracking-[1.8%] uppercase font-gill"
              >
                <span className={cn("text-neutral500", itemClassName)}>{item.label}</span>
                <span className="px-60 text-gray600" aria-hidden>
                  •
                </span>
              </div>
            ))
          )}
        </div>
        <div
          aria-hidden
          className="flex shrink-0 animate-marquee items-center whitespace-nowrap"
        >
          {showSkeleton
            ? null
            : marqueeItems.map((item, idx) => (
                <div
                  key={`marquee-b-${item.id ?? item.label}-${idx}`}
                  className="flex items-center font-normal text-xs md:text-sm tracking-[1.8%] uppercase font-gill"
                >
                  <span className={cn("text-neutral500", itemClassName)}>{item.label}</span>
                  <span className="px-60 text-gray600" aria-hidden>
                    •
                  </span>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

/** Homepage hero — `trustBadges` from shopping-blocks API (CMS array order). */
export function HomepageTrustBadgeSection({
  id,
  itemClassName,
}: {
  id?: string;
  itemClassName?: string;
}) {
  const { data: shoppingData, isLoading } = useHomepageShoppingBlocks();

  const items = useMemo(
    () => resolveHomepageTrustMarqueeItems(shoppingData),
    [shoppingData],
  );

  return (
    <TrustBadgeMarquee
      id={id}
      itemClassName={itemClassName}
      items={items}
      isLoading={isLoading}
    />
  );
}

/** Site footer — `footerTickerItems` from homepage shell / global API (CMS array order). */
export function FooterTrustBadgeSection({
  id,
  itemClassName,
}: {
  id?: string;
  itemClassName?: string;
}) {
  const { data: shellData, isLoading } = useHomepageShell();

  const items = useMemo(
    () => resolveFooterTrustMarqueeItems(shellData),
    [shellData],
  );

  return (
    <TrustBadgeMarquee
      id={id}
      itemClassName={itemClassName}
      items={items}
      isLoading={isLoading}
    />
  );
}

/** @deprecated Use `FooterTrustBadgeSection` or `HomepageTrustBadgeSection`. */
const TrustBadgeSection = FooterTrustBadgeSection;

export default TrustBadgeSection;
