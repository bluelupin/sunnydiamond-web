"use client";

import Image from "next/image";
import { PLP_HERO_IMAGE_QUALITY } from "@/features/jewellery-product/utils/jewelleryPlpImage";
import type { NormalizedGiftingHero } from "@/services/gifting/gifting-page.types";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";

type GiftingIntroSectionProps = {
  hero: NormalizedGiftingHero;
};

const GiftingIntroSection = ({ hero }: GiftingIntroSectionProps) => {
  return (
    <section
      aria-labelledby="gifting-intro-title"
      className="relative left-1/2 grid h-240 w-screen max-w-none -translate-x-1/2 overflow-hidden md:h-320"
    >
      <div className="relative col-start-1 row-start-1 size-full overflow-hidden">
        <ResponsiveImage
          desktopSrc={hero.image.desktopUrl}
          mobileSrc={hero.image.mobileUrl}
          alt={hero.image.alt}
          width={hero.image.desktopUrl ? 320 : 240}
          height={hero.image.desktopUrl ? 320 : 240}
          quality={PLP_HERO_IMAGE_QUALITY}
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden />
      </div>
      <h1
        id="gifting-intro-title"
        className="absolute left-1/2 md:bottom-16 bottom-11 z-10 -translate-x-1/2 whitespace-nowrap text-center font-larken font-light leading-110 text-white lg:text-5xl md:text-4xl text-32"
      >
        {hero.title}
      </h1>
    </section>
  );
};

export default GiftingIntroSection;
