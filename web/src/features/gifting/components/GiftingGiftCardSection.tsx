"use client";

import Link from "next/link";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { giftingPageContent } from "../data/content";

const GiftingGiftCardSection = () => {
  const { giftCard } = giftingPageContent;

  return (
    <section
      id="gift-card"
      aria-labelledby="gifting-gift-card-title"
      className="bg-white px-4 py-16 md:px-10 md:py-100"
    >
      <div className="mx-auto grid w-full max-w-1360 items-center gap-10 md:grid-cols-2 md:gap-16">
        <Reveal direction="up" className="relative h-[280px] w-full overflow-hidden md:h-[420px]">
          <ResponsiveImage
            desktopSrc={giftCard.image.desktopUrl}
            mobileSrc={giftCard.image.mobileUrl}
            alt={giftCard.image.alt}
            width={680}
            height={420}
            className="size-full object-cover"
          />
        </Reveal>

        <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
          <Reveal
            as="h2"
            id="gifting-gift-card-title"
            direction="up"
            className="font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl"
          >
            {giftCard.title}
          </Reveal>
          <Reveal
            as="p"
            direction="up"
            className="max-w-[480px] font-gill text-base font-light leading-110 text-neutral500 md:text-lg lg:text-xl"
          >
            {giftCard.description}
          </Reveal>
          <Reveal direction="up">
            <Link
              href={giftCard.cta.href}
              className="inline-flex h-14 items-center justify-center bg-darkblack px-8 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2"
            >
              {giftCard.cta.label}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default GiftingGiftCardSection;
