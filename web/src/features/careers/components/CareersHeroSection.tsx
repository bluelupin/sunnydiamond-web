"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import type { NormalizedCareerHero } from "@/services/careers/careers.types";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";

const ctaFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0";

type CareersHeroSectionProps = {
  hero: NormalizedCareerHero;
};

const CareersHeroSection = ({ hero }: CareersHeroSectionProps) => {
  const { flowStep, goToListings } = useCareersJobs();
  const showCta = flowStep === "landing";

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

      <div className="absolute inset-0 bg-black/40" aria-hidden />

      <div className="absolute left-1/2 bottom-6 z-10 flex w-fit -translate-x-1/2 flex-col items-center gap-6 md:top-[200px]">
        <Reveal
          as="h1"
          id="careers-hero-title"
          direction="up"
          className="w-full shrink-0 text-center font-larken text-32 font-light leading-110 text-white md:text-5xl"
        >
          {hero.title}
        </Reveal>

        {showCta ? (
          <Reveal direction="up">
            <DetailTextLink light onClick={goToListings} className={ctaFocusClass}>
              {hero.ctaLabel}
            </DetailTextLink>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
};

export default CareersHeroSection;
