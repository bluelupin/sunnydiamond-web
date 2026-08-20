"use client";

import Image from "next/image";
import { PLP_HERO_IMAGE_QUALITY } from "@/features/jewellery-product/utils/jewelleryPlpImage";
import type { NormalizedContactHero } from "@/services/contact/contact-page.types";

type ContactHeroSectionProps = {
  hero: NormalizedContactHero;
};

const ContactHeroSection = ({ hero }: ContactHeroSectionProps) => {
  return (
    <section
      aria-labelledby="contact-hero-title"
      className="relative left-1/2 grid h-[240px] w-screen max-w-none -translate-x-1/2 overflow-hidden md:h-320"
    >
      <div className="relative col-start-1 row-start-1 size-full overflow-hidden">
        {hero.image.mobileUrl ? (
          <Image
            src={hero.image.mobileUrl}
            alt={hero.image.mobileAlt}
            fill
            priority
            quality={PLP_HERO_IMAGE_QUALITY}
            sizes="100vw"
            className="object-cover object-[70%_50%] md:hidden"
          />
        ) : null}
        {hero.image.desktopUrl ? (
          <Image
            src={hero.image.desktopUrl}
            alt={hero.image.desktopAlt}
            fill
            priority
            quality={PLP_HERO_IMAGE_QUALITY}
            sizes="100vw"
            className="hidden object-cover object-[50%_62%] md:block"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/40" aria-hidden />
      </div>
      <h1
        id="contact-hero-title"
        className="absolute left-1/2 md:bottom-16 bottom-10 z-10 -translate-x-1/2 whitespace-nowrap text-center font-larken text-32 font-light leading-110 text-white lg:text-5xl md:text-4xl"
      >
        {hero.title}
      </h1>
    </section>
  );
};

export default ContactHeroSection;
