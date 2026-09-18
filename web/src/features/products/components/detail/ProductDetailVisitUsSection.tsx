"use client";

import { useState } from "react";
import BookStoreVisitPanel from "./BookStoreVisitPanel";
import { DetailTextLink } from "./shared";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";
import type { NormalizedVisitUsSection } from "@/services/product-display/product-display-page.service";

type ProductDetailVisitUsSectionProps = {
  visitUs: NormalizedVisitUsSection;
  productName?: string;
  productId?: string;
  variant?: "pdp" | "contact";
};

const ProductDetailVisitUsSection = ({
  visitUs,
  productName,
  productId,
  variant = "pdp",
}: ProductDetailVisitUsSectionProps) => {
  const [isBookVisitOpen, setIsBookVisitOpen] = useState(false);
  const isContactVariant = variant === "contact";

  if (!visitUs.isActive) {
    return null;
  }

  const ctaLabel = visitUs.ctaLabel.trim();
  const bookVisitFormTag = productId
    ? "product-store-visit"
    : visitUs.bookVisitFormTag;
  const hasImage = visitUs.imageSrc.trim().length > 0;
  const welcomeNote = visitUs.welcomeNote?.trim() ?? "";
  const openBookVisit = () => setIsBookVisitOpen(true);

  const renderCta = () => {
    if (!ctaLabel) return null;

    if (isContactVariant) {
      return (
        <DetailTextLink
          onClick={openBookVisit}
          className="uppercase tracking-caption"
          light
        >
          {ctaLabel}
        </DetailTextLink>
      );
    }

    return (
      <DetailTextLink
        href={visitUs.ctaUrl}
        onClick={visitUs.ctaUrl ? undefined : openBookVisit}
        className="uppercase tracking-caption"
        light
      >
        {ctaLabel}
      </DetailTextLink>
    );
  };

  return (
    <>
      <section
        aria-labelledby="visit-us-heading"
        className={cn(
          isContactVariant
            ? "relative h-[320px] w-full overflow-hidden md:h-[387px]"
            : "relative h-[800px] w-full overflow-hidden md:h-804",
        )}
      >
        {/* Absolute media layer so non-banner showroom crops don't expand the section and clip copy */}
        <div className="absolute inset-0">
          {hasImage ? (
            <ResponsiveImage
              desktopSrc={visitUs.imageSrc}
              mobileSrc={visitUs.mobileImageSrc}
              alt={visitUs.imageAlt ?? ""}
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          ) : null}
        </div>

        {isContactVariant ? (
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/30" />
        ) : (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-400 bg-gradient-to-t from-black/60 from-[45%] to-transparent md:from-black/80 md:from-0%"
          />
        )}

        {isContactVariant ? (
          <div className="absolute inset-x-0 bottom-10 z-10 flex justify-center px-4 md:px-10">
            <div className="flex w-full max-w-[1360px] flex-col items-center md:gap-8 gap-6">
              <div className="flex flex-col items-center md:gap-4 gap-3 text-center text-white">
                <h2
                  id="visit-us-heading"
                  className="font-larken lg:text-5xl md:text-4xl text-32 font-light leading-110 text-white"
                >
                  {visitUs.title}
                </h2>
                {welcomeNote ? (
                  <p className="max-w-[606px] font-gill md:text-xl font-light leading-110 text-white">
                    {welcomeNote}
                  </p>
                ) : null}
              </div>
              {renderCta()}
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex h-full items-end justify-center px-4 pb-16 md:px-8 lg:px-10">
            <div className="flex w-full max-w-311 flex-col items-center gap-6 lg:max-w-1360 lg:gap-10">
              <div className="flex flex-col items-center gap-6 text-center text-white md:gap-3 lg:gap-4">
                <h2
                  id="visit-us-heading"
                  className="font-larken text-32 font-light leading-110 text-[#f8f1f6] lg:text-5xl"
                >
                  {visitUs.title}
                </h2>
                <p className="font-gill text-base font-light leading-110 lg:text-xl">
                  {visitUs.description}
                </p>
              </div>
              {renderCta()}
            </div>
          </div>
        )}
      </section>

      <BookStoreVisitPanel
        open={isBookVisitOpen}
        onClose={() => setIsBookVisitOpen(false)}
        submissionFormTag={bookVisitFormTag}
        productName={productName}
        productId={productId}
      />
    </>
  );
};

export default ProductDetailVisitUsSection;
