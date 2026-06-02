"use client";

import { useMemo } from "react";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import { cn } from "@/shared/utils/cn";
interface TrustBadgeSectionProps {
    id?: string;
    itemClassName?: string;
}

const TrustBadgeSection = ({ id, itemClassName = "text-gray500", }: TrustBadgeSectionProps) => {
    const { data: shoppingData, isLoading: isShoppingLoading } = useHomepageShoppingBlocks();
    const normalizedTrust = useMemo(() => {
        const trustSource = shoppingData?.trustBadges || shoppingData?.homepage?.trustBadges || [];
        return [...trustSource]
            .filter((t) => t?.isActive !== false)
            .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));
    }, [shoppingData]);

    const marqueeItems = useMemo(
        () => [
            ...normalizedTrust.map((t) => t?.label ?? ""),
            ...normalizedTrust.map((t) => t?.label ?? ""),
        ].filter(Boolean),
        [normalizedTrust]
    );

    return (
        <section className="bg-gray300 text-ivory border-t border-ivory/10 overflow-hidden shrink-0">
            <div className="relative flex overflow-hidden md:h-16 h-12">
                <div className="flex shrink-0 animate-marquee items-center gap-12 pr-12 whitespace-nowrap">
                    {isShoppingLoading ? (
                        <div className="flex items-center gap-12 pr-12 whitespace-nowrap">
                            <div className="h-3 w-40 bg-gray500/20 rounded animate-pulse" />
                            <div className="h-3 w-32 bg-gray500/20 rounded animate-pulse" />
                            <div className="h-3 w-44 bg-gray500/20 rounded animate-pulse" />
                        </div>
                    ) : (
                        marqueeItems.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-12 font-light text-xs md:text-sm tracking-[1.8%] uppercase font-gill"
                            >
                                <span className={cn("text-gray500", itemClassName)}>{item}</span>
                                <span className="text-gray600" aria-hidden>
                                    •
                                </span>
                            </div>
                        ))
                    )}
                </div>
                <div
                    aria-hidden
                    className="flex shrink-0 animate-marquee items-center gap-12 pr-12 whitespace-nowrap"
                >
                    {isShoppingLoading
                        ? null
                        : marqueeItems.map((item, idx) => (
                            <div
                                key={`dup-${idx}`}
                                className="flex items-center gap-12 font-light text-xs md:text-sm tracking-[1.8%] uppercase font-gill"
                            >
                                <span className={cn("text-gray500", itemClassName)}>{item}</span>

                                <span className="text-gray600" aria-hidden>
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
