"use client";

import HeroBackgroundMedia from "@/features/cms/components/home/HeroBackgroundMedia";
import type { NormalizedProductLandingHero } from "@/services/product-landing/product-landing-page.types";

type JewelleryHeroSectionProps = NormalizedProductLandingHero;

const JewelleryHeroSection = ({ title, image, videoUrl }: JewelleryHeroSectionProps) => {
  const imageAlt = image?.alt?.trim() || title;

  return (
    <section
      aria-labelledby="jewellery-listing-hero-title"
      className="relative grid h-[240px] w-full overflow-hidden md:h-320"
    >
      <div className="relative col-start-1 row-start-1 size-full [&_img]:object-[62%_38%] md:[&_img]:object-[58%_42%] [&_video]:object-[62%_38%] md:[&_video]:object-[58%_42%]">
        <HeroBackgroundMedia
          desktopImageUrl={image?.desktopUrl ?? ""}
          mobileImageUrl={image?.mobileUrl}
          desktopAlt={imageAlt}
          mobileAlt={imageAlt}
          cmsVideoUrl={videoUrl}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-darkblack/85 via-darkblack/35 to-transparent"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-10 lg:pb-16">
        <h1
          id="jewellery-listing-hero-title"
          className="w-full text-center font-larken font-light leading-none text-white lg:text-6xl md:text-5xl sm:text-4xl text-32"
        >
          {title}
        </h1>
      </div>
    </section>
  );
};

export default JewelleryHeroSection;
