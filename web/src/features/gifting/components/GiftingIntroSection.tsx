"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { giftingPageContent } from "../data/content";

const GiftingIntroSection = () => {
  const { intro } = giftingPageContent;

  return (
    <section
      aria-labelledby="gifting-intro-title"
      className="relative h-240 w-full overflow-hidden md:h-320"
    >
      <ResponsiveImage
        desktopSrc={intro.image.desktopUrl}
        mobileSrc={intro.image.mobileUrl}
        alt={intro.image.alt}
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
          id="gifting-intro-title"
          direction="up"
          className="font-larken text-32 font-light leading-110 text-white md:text-4xl lg:text-5xl"
        >
          {intro.title}
        </Reveal>
        <Reveal
          as="p"
          direction="up"
          className="max-w-[520px] font-gill text-base font-light leading-110 text-white/90 md:text-lg lg:text-xl"
        >
          {intro.description}
        </Reveal>
      </div>
    </section>
  );
};

export default GiftingIntroSection;
