"use client";

import HeroBackgroundMedia from "@/features/cms/components/home/HeroBackgroundMedia";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import type { NormalizedGiftingHero } from "@/services/gifting/gifting-page.types";

type GiftingHeroSectionProps = {
  hero: NormalizedGiftingHero;
};

const GiftingHeroSection = ({ hero }: GiftingHeroSectionProps) => {
  const imageAlt = hero.image.alt?.trim() || hero.title;

  return (
    <section
      aria-labelledby="gifting-hero-title"
      className="relative grid h-[240px] w-full overflow-hidden bg-white md:h-320"
    >
      <div className="relative col-start-1 row-start-1 size-full [&_img]:object-[62%_38%] md:[&_img]:object-[58%_42%] [&_video]:object-[62%_38%] md:[&_video]:object-[58%_42%]">
        <HeroBackgroundMedia
          desktopImageUrl={hero.image.desktopUrl}
          mobileImageUrl={hero.image.mobileUrl}
          desktopAlt={imageAlt}
          mobileAlt={imageAlt}
        />
        <MediaContentOverlay gradient="bottom-strong" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-10 lg:pb-16">
        <h1
          id="gifting-hero-title"
          className="w-full text-center font-larken font-light leading-none text-white lg:text-5xl md:text-4xl text-32"
        >
          {hero.title}
        </h1>
      </div>
    </section>
  );
};

export default GiftingHeroSection;
