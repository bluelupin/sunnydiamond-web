"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { careersPageContent } from "../data/content";

const CareersHeroSection = () => {
  const { hero } = careersPageContent;

  return (
    <section
      aria-labelledby="careers-hero-title"
      className="relative h-240 w-full overflow-hidden md:h-320"
    >
      <ResponsiveImage
        desktopSrc={hero.image.desktopUrl}
        mobileSrc={hero.image.mobileUrl}
        alt={hero.image.alt}
        width={1440}
        height={640}
        priority
        sizes="100vw"
        className="absolute inset-0 size-full object-cover object-center"
      />

      <div aria-hidden className="absolute inset-0 bg-[#00000066]" />

      <div className="absolute inset-x-0 bottom-11 flex flex-col items-center gap-3 px-4 text-center md:bottom-16">
        <Reveal
          as="h1"
          id="careers-hero-title"
          direction="up"
          className="font-larken text-32 font-light leading-110 text-white md:text-4xl lg:text-5xl"
        >
          {hero.title}
        </Reveal>
        <Reveal
          as="p"
          direction="up"
          className="max-w-[560px] font-gill text-base font-light leading-110 text-white/90 md:text-lg lg:text-xl"
        >
          {hero.description}
        </Reveal>
      </div>
    </section>
  );
};

export default CareersHeroSection;
