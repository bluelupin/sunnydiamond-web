"use client";

import { useState } from "react";
import Image from "next/image";
import BookStoreVisitPanel from "./BookStoreVisitPanel";
import { DetailTextLink } from "./shared";
import Reveal from "@/shared/Animation/Reveal";
import type { NormalizedVisitUsSection } from "@/services/product-display/product-display-page.service";
import { VISIT_US_FALLBACK } from "@/services/product-display/product-display-page.service";

type ProductDetailVisitUsSectionProps = {
  visitUs?: NormalizedVisitUsSection | null;
};

const ProductDetailVisitUsSection = ({
  visitUs = VISIT_US_FALLBACK,
}: ProductDetailVisitUsSectionProps) => {
  const [isBookVisitOpen, setIsBookVisitOpen] = useState(false);
  const content = visitUs ?? VISIT_US_FALLBACK;

  return (
    <>
      <section
        aria-labelledby="visit-us-heading"
        className="grid h-804 w-full overflow-hidden [&>*]:col-start-1 [&>*]:row-start-1"
      >
        <Image
          src={content.imageSrc}
          alt={content.imageAlt ?? ""}
          width={1440}
          height={804}
          priority={false}
          className="h-full w-full object-cover object-center"
          sizes="100vw"
          aria-hidden={!content.imageAlt}
        />

        <div
          aria-hidden
          className="pointer-events-none h-400 w-full self-end bg-gradient-to-t from-black/80 to-transparent"
        />

        <div className="z-10 flex self-end justify-center px-4 pb-16 md:px-8 lg:px-10">
          <Reveal direction="up" className="flex w-full max-w-311 flex-col items-center gap-6 lg:max-w-1360 lg:gap-10">
            <div className="flex flex-col items-center gap-3 text-center text-white lg:gap-4">
              <h2 id="visit-us-heading" className="font-larken text-32 font-light leading-110 lg:text-5xl">
                {content.title}
              </h2>
              <p className="font-gill text-base font-light leading-110 lg:text-xl">
                {content.description}
              </p>
            </div>
            <DetailTextLink
              href={content.ctaUrl}
              onClick={content.ctaUrl ? undefined : () => setIsBookVisitOpen(true)}
              className="uppercase tracking-caption"
              light
            >
              {content.ctaLabel}
            </DetailTextLink>
          </Reveal>
        </div>
      </section>

      <BookStoreVisitPanel open={isBookVisitOpen} onClose={() => setIsBookVisitOpen(false)} />
    </>
  );
};

export default ProductDetailVisitUsSection;
