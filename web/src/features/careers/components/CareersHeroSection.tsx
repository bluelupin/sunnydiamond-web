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
  const { flowStep, goToListings, jobs } = useCareersJobs();
  const hasOpenings = jobs.length > 0;
  const showCta = flowStep === "landing" && hasOpenings && Boolean(hero.ctaLabel?.trim());
  const imageAlt = hero.image?.alt?.trim() || hero.title;

  return (
    <section
      aria-labelledby="careers-hero-title"
      className="relative grid h-[240px] w-full overflow-hidden bg-white md:h-320"
    >
      <div className="relative col-start-1 row-start-1 size-full [&_img]:object-center [&_video]:object-center">
        <HeroBackgroundMedia
          desktopImageUrl={hero.image?.desktopUrl ?? ""}
          mobileImageUrl={hero.image?.mobileUrl}
          desktopAlt={imageAlt}
          mobileAlt={imageAlt}
        />
        <MediaContentOverlay solidOpacity={0.2} />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center px-5 md:pb-16 pb-10">
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
