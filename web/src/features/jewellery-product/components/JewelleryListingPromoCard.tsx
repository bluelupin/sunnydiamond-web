"use client";

import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";
import type { NormalizedProductListingCard } from "@/services/product-landing/product-landing-page.types";

type JewelleryListingPromoCardProps = {
  card: NormalizedProductListingCard;
  className?: string;
};

function shouldOpenInNewTab(card: NormalizedProductListingCard): boolean {
  if (card.cta.openInNewTab) return true;
  const targetType = card.cta.targetType?.trim().toLowerCase();
  return targetType === "external" || targetType === "_blank";
}

/** Figma 6695:49576 / 6695:49605 — PLP editorial listing card in the product grid. */
export default function JewelleryListingPromoCard({
  card,
  className,
}: JewelleryListingPromoCardProps) {
  const openInNewTab = shouldOpenInNewTab(card);
  const imageAlt = card.image.alt?.trim() || card.description;

  return (
    <Link
      href={card.cta.url}
      className={cn(
        "group relative isolate flex min-w-0 w-full flex-col overflow-hidden bg-gray200",
        "h-[227px] lg:h-[496px] md:h-[450px]",
        className,
      )}
      {...(openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <ResponsiveImage
        desktopSrc={card.image.desktopUrl}
        mobileSrc={card.image.mobileUrl}
        alt={imageAlt}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 from-[14%] to-black/0 to-[50%]"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-end md:px-6 px-4 md:gap-4 gap-2 lg:pb-[72px] md:pb-12 pb-6">
        <p className="text-center font-gill leading-110 text-white lg:text-xl md:text-lg sm:text-base text-sm">
          {card.description}
        </p>
        <span className="text-tertiary-cta-underline inline-flex w-fit items-center justify-center pb-1 font-gill text-sm font-normal uppercase leading-110 tracking-[0.28px] text-white">
          {card.cta.label}
        </span>
      </div>
    </Link>
  );
}
