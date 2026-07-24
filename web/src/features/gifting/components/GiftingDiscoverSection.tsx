"use client";

import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import Reveal from "@/shared/Animation/Reveal";
import { giftingPageContent } from "../data/content";

const ctaFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2";

const GiftingDiscoverSection = () => {
  const { discover } = giftingPageContent;

  return (
    <section
      id="discover-ideal-gift"
      aria-labelledby="gifting-discover-title"
      className="relative w-full overflow-hidden bg-[#F3E6E2]"
    >
      <div className="flex flex-col items-center gap-10 px-4 py-16 md:flex-row md:items-center md:justify-between md:gap-12 md:px-10 md:py-100 lg:gap-16">
        <div className="order-2 flex w-full max-w-[520px] flex-col gap-6 md:order-1 md:gap-8">
          <div className="space-y-3 md:space-y-4">
            <Reveal
              as="h2"
              id="gifting-discover-title"
              direction="up"
              className="text-center font-larken text-32 font-light leading-110 text-darkblack md:text-left md:text-4xl lg:text-5xl"
            >
              {discover.title}
            </Reveal>
            <Reveal
              as="p"
              direction="up"
              className="text-center font-gill text-base font-light leading-110 text-neutral500 md:text-left md:text-lg lg:text-xl"
            >
              {discover.description}
            </Reveal>
          </div>

          <Reveal
            direction="up"
            className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-start md:gap-8"
          >
            <Link
              href={discover.primaryCta.href}
              className={`inline-flex h-14 items-center justify-center bg-white px-8 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-opacity hover:opacity-90 ${ctaFocusClass}`}
            >
              {discover.primaryCta.label}
            </Link>
            <Link
              href={discover.secondaryCta.href}
              className={`relative cursor-pointer border-b-[1.5px] border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-darkMagenta after:transition-all after:duration-300 hover:border-darkMagenta hover:text-darkMagenta hover:after:w-full ${ctaFocusClass}`}
            >
              {discover.secondaryCta.label}
            </Link>
          </Reveal>
        </div>

        <Reveal direction="up" className="order-1 m-auto w-full max-w-[420px] md:order-2 md:max-w-[520px]">
          <OptimizedImage
            src={discover.image.desktopUrl}
            alt={discover.image.alt}
            width={520}
            height={360}
            className="size-full object-contain"
          />
        </Reveal>
      </div>
    </section>
  );
};

export default GiftingDiscoverSection;
