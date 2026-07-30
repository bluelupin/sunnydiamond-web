"use client";

import Image from "next/image";
import { PLP_HERO_IMAGE_QUALITY } from "@/features/jewellery-product/utils/jewelleryPlpImage";
import { giftingPageContent } from "../data/content";

const GiftingIntroSection = () => {
  const { intro } = giftingPageContent;

  return (
    <section
      aria-labelledby="gifting-intro-title"
      className="relative left-1/2 grid h-240 w-screen max-w-none -translate-x-1/2 overflow-hidden md:h-320"
    >
      <div className="relative col-start-1 row-start-1 size-full overflow-hidden">
        <Image
          src={intro.image.mobileUrl}
          alt={intro.image.alt}
          fill
          priority
          quality={PLP_HERO_IMAGE_QUALITY}
          sizes="100vw"
          className="object-cover object-center md:hidden"
        />
        <Image
          src={intro.image.desktopUrl}
          alt={intro.image.alt}
          fill
          priority
          quality={PLP_HERO_IMAGE_QUALITY}
          sizes="100vw"
          className="hidden object-cover object-center md:block"
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden />
      </div>
      <h1
        id="gifting-intro-title"
        className="absolute left-1/2 top-[calc(50%+42px)] z-10 -translate-x-1/2 whitespace-nowrap text-center font-larken text-32 font-light leading-110 text-white md:static md:col-start-1 md:row-start-1 md:translate-x-0 md:self-start md:justify-self-center md:pt-[203px] md:text-5xl"
      >
        {intro.title}
      </h1>
    </section>
  );
};

export default GiftingIntroSection;
