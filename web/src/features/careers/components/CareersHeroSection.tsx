"use client";

import HeroBackgroundMedia from "@/features/cms/components/home/HeroBackgroundMedia";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import { cn } from "@/shared/utils/cn";
import type { NormalizedCareerHero } from "@/services/careers/careers.types";

const ctaFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0";

type CareersHeroSectionProps = {
  hero: NormalizedCareerHero;
};

const CareersHeroSection = ({ hero }: CareersHeroSectionProps) => {
  const { flowStep, goToListings } = useCareersJobs();
  const showCta = flowStep === "landing";
  const imageAlt = hero.image?.alt?.trim() || hero.title;

  return (
    <section
      aria-labelledby="careers-hero-title"
      className="relative grid h-[240px] w-full overflow-hidden bg-white md:h-320"
    >
      <div className="relative col-start-1 row-start-1 size-full [&_img]:object-[62%_38%] md:[&_img]:object-[58%_42%] [&_video]:object-[62%_38%] md:[&_video]:object-[58%_42%]">
        <HeroBackgroundMedia
          desktopImageUrl={hero.image?.desktopUrl ?? ""}
          mobileImageUrl={hero.image?.mobileUrl}
          desktopAlt={imageAlt}
          mobileAlt={imageAlt}
        />
        <MediaContentOverlay gradient="bottom-strong" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-6 md:pb-10 lg:pb-16">
        <div className="flex w-full flex-col items-center gap-6">
          <h1
            id="careers-hero-title"
            className="w-full text-center font-larken font-light leading-none text-white lg:text-5xl md:text-4xl text-32"
          >
            {hero.title}
          </h1>

          {showCta ? (
            <DetailTextLink
              light
              onClick={goToListings}
              className={cn(ctaFocusClass, "pointer-events-auto")}
            >
              {hero.ctaLabel}
            </DetailTextLink>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default CareersHeroSection;
