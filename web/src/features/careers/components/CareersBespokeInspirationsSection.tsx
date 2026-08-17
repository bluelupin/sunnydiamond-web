"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { careersDarkCtaClassName } from "@/features/careers/constants/careersCtaStyles";
import type { NormalizedCareerDiscoverSection } from "@/services/careers/careers.types";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";

const ctaFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2";

type CareersBespokeInspirationsSectionProps = {
  discover: NormalizedCareerDiscoverSection;
};

const CareersBespokeInspirationsSection = ({
  discover,
}: CareersBespokeInspirationsSectionProps) => {
  const { goToListings } = useCareersJobs();

  return (
    <section
      id="bespoke-inspirations"
      aria-labelledby="careers-bespoke-title"
      className="relative w-full overflow-hidden"
    >
      <ResponsiveImage
        desktopSrc={discover.image.desktopUrl}
        mobileSrc={discover.image.mobileUrl}
        alt={discover.image.alt}
        width={1440}
        height={439}
        sizes="100vw"
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div
        aria-hidden
        className="section-radial absolute inset-0" 
      />

      <div className="relative flex flex-col items-center justify-center px-4 py-16 md:py-104">
        <div className="flex w-full max-w-[568px] flex-col items-center gap-6 text-center">
          <Reveal
            as="h2"
            id="careers-bespoke-title"
            direction="up"
            className="w-full font-larken text-32 font-light leading-110 text-darkblack md:text-5xl"
          >
            {discover.title}
          </Reveal>
          <Reveal direction="up">
            <button
              type="button"
              onClick={goToListings}
              className={`${careersDarkCtaClassName} shrink-0 ${ctaFocusClass}`}
            >
              <span className="relative z-10">{discover.ctaLabel}</span>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default CareersBespokeInspirationsSection;
