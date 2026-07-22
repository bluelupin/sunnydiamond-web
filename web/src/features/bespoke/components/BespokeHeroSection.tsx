"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { bespokePageFigmaSpec } from "@/features/bespoke/data/content";
import type { NormalizedBespokeHero } from "@/services/bespoke/contact-bespoke-page.types";

type BespokeHeroSectionProps = {
  hero: NormalizedBespokeHero;
};

const BespokeHeroSection = ({ hero }: BespokeHeroSectionProps) => {
  return (
    <section
      aria-labelledby="bespoke-hero-title"
      className="relative h-240 w-full overflow-hidden md:h-320"
    >
      <ResponsiveImage
        desktopSrc={hero.image.desktopUrl}
        mobileSrc={hero.image.mobileUrl}
        alt={hero.image.alt}
        width={1440}
        height={bespokePageFigmaSpec.heroDesktopHeight}
        priority
        sizes="100vw"
        className="absolute inset-0 size-full object-cover object-center"
      />

      <div aria-hidden className="absolute inset-0 bg-[#00000066]" />

      <Reveal
        as="h1"
        id="bespoke-hero-title"
        direction="up"
        className="absolute md:bottom-16 bottom-11 left-0 w-full text-center whitespace-nowrap text-center font-larken lg:text-5xl md:text-4xl text-32 font-light leading-110 text-white"
      >
        {hero.title}
      </Reveal>
    </section>
  );
};

export default BespokeHeroSection;
