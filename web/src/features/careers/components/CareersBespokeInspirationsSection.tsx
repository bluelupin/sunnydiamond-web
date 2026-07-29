"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { careersPageContent } from "@/features/careers/data/content";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";

const ctaFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2";

const CareersBespokeInspirationsSection = () => {
  const { bespokeInspirations } = careersPageContent;
  const { goToListings } = useCareersJobs();

  return (
    <section
      id="bespoke-inspirations"
      aria-labelledby="careers-bespoke-title"
      className="relative w-full overflow-hidden"
    >
      <ResponsiveImage
        desktopSrc={bespokeInspirations.image.desktopUrl}
        mobileSrc={bespokeInspirations.image.mobileUrl}
        alt={bespokeInspirations.image.alt}
        width={1440}
        height={439}
        sizes="100vw"
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_34%_61%,rgba(244,243,238,0)_0%,rgba(251,250,246,1)_100%)]"
      />

      <div className="relative flex flex-col items-center justify-center px-4 py-16 md:py-104">
        <div className="flex w-full max-w-[568px] flex-col items-center gap-4 text-center">
          <Reveal
            as="h2"
            id="careers-bespoke-title"
            direction="up"
            className="font-larken text-32 font-light leading-110 text-darkblack md:text-5xl"
          >
            {bespokeInspirations.title}
          </Reveal>
          <Reveal direction="up">
            <button
              type="button"
              onClick={goToListings}
              className={`inline-flex h-14 items-center justify-center border border-darkblack bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90 ${ctaFocusClass}`}
            >
              {bespokeInspirations.ctaLabel}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default CareersBespokeInspirationsSection;
