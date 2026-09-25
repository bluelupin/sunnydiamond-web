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
    .filter((badge) => badge?.showField === true)
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

function TrustBadgeMarqueeItem({
  item,
  itemClassName,
  showSeparator,
}: {
  item: TrustMarqueeItem;
  itemClassName: string;
  showSeparator: boolean;
}) {
  return (
    <div className="flex items-center font-normal text-sm tracking-[0%] leading-110 uppercase font-gill">
      <span className={cn("text-neutral500", itemClassName)}>{item.label}</span>
      {showSeparator ? (
        <span className="px-60 text-gray600" aria-hidden>
          •
        </span>
      ) : null}
    </div>
  );
}

function TrustBadgeMarquee({
  id,
  itemClassName = "text-gray500",
  items,
  isLoading,
}: TrustBadgeMarqueeProps) {
  const pathName = usePathname();

  const isSingleItem = items.length === 1;
  const marqueeItems = useMemo(
    () => (isSingleItem ? items : [...items, ...items]),
    [items, isSingleItem],
  );
  const showSkeleton = isLoading && items.length === 0;

  if (!showSkeleton && items.length === 0) {
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
      <div
        className={cn(
          "relative flex h-[64px] overflow-hidden",
          isSingleItem && "justify-center",
        )}
      >
        {isSingleItem && !showSkeleton ? (
          <div className="flex items-center whitespace-nowrap">
            <TrustBadgeMarqueeItem
              item={items[0]}
              itemClassName={itemClassName}
              showSeparator={false}
            />
          </div>
        ) : (
          <>
            <div className="flex shrink-0 animate-marquee items-center whitespace-nowrap">
              {showSkeleton ? (
                <div className="flex items-center gap-12 pr-12 whitespace-nowrap">
                  <div className="h-3 w-40 bg-gray500/20 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-gray500/20 rounded animate-pulse" />
                  <div className="h-3 w-44 bg-gray500/20 rounded animate-pulse" />
                </div>
              ) : (
                marqueeItems.map((item, idx) => (
                  <TrustBadgeMarqueeItem
                    key={`marquee-a-${item.id ?? item.label}-${idx}`}
                    item={item}
                    itemClassName={itemClassName}
                    showSeparator
                  />
                ))
              )}
            </div>
            {!showSkeleton ? (
              <div
                aria-hidden
                className="flex shrink-0 animate-marquee items-center whitespace-nowrap"
              >
                {marqueeItems.map((item, idx) => (
                  <TrustBadgeMarqueeItem
                    key={`marquee-b-${item.id ?? item.label}-${idx}`}
                    item={item}
                    itemClassName={itemClassName}
                    showSeparator
                  />
                ))}
              </div>
            ) : null}
          </>
        )}
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
