"use client";

import { useMemo } from "react";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import { cn } from "@/shared/utils/cn";
import { usePathname } from "next/navigation";

interface TrustBadgeSectionProps {
  id?: string;
  itemClassName?: string;
}

const TrustBadgeSection = ({
  id,
  itemClassName = "text-gray500",
}: TrustBadgeSectionProps) => {
  const pathName = usePathname();
  const { data: shellData, isLoading: isShellLoading } = useHomepageShell();

  const normalizedTrust = useMemo(() => {
    const trustSource = shellData?.global?.footerTickerItems ?? [];
    return [...trustSource]
      .filter((t) => t?.isActive !== false && t?.showField !== false)
      .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));
  }, [shellData]);

  const marqueeItems = useMemo(
    () =>
      [
        ...normalizedTrust.map((t) => t?.label?.trim() ?? ""),
        ...normalizedTrust.map((t) => t?.label?.trim() ?? ""),
      ].filter(Boolean),
    [normalizedTrust],
  );

  const showSkeleton = isShellLoading && marqueeItems.length === 0;

  return (
    <section
      id={id}
      className={cn(
        pathName === "/cart" || "//checkout" ? "bg-gray200" : "bg-gray300",
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
                key={idx}
                className="flex items-center font-light text-xs md:text-sm tracking-[1.8%] uppercase font-gill"
              >
                <span className={cn("text-gray500", itemClassName)}>{item}</span>
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
                  key={`dup-${idx}`}
                  className="flex items-center font-light text-xs md:text-sm tracking-[1.8%] uppercase font-gill"
                >
                  <span className={cn("text-gray500", itemClassName)}>{item}</span>

                  <span className="px-60 text-gray600" aria-hidden>
                    •
                  </span>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadgeSection;
