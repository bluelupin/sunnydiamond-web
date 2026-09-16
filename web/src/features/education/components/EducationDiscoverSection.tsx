"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";
import type { NormalizedEducationCtaBanner } from "@/services/education/learn-about-diamonds-page.types";
import Reveal from "@/shared/Animation/Reveal";
import EducationDiscoverJourneyCta from "./EducationDiscoverJourneyCta";
import EducationDiscoverStepsList from "./EducationDiscoverStepsList";

type DiscoverContentProps = Pick<
  NormalizedEducationCtaBanner,
  "heading" | "subheading" | "ctaLabel" | "steps"
>;

const DiscoverContent = ({
  heading,
  subheading,
  ctaLabel,
  steps,
}: DiscoverContentProps) => (
  <>
    <h2
      id="education-discover-title"
      className="lg:mb-4 mb-3 w-full font-larken font-light leading-110 text-darkblack lg:text-5xl md:text-4xl sm:text-3xl text-32"
    >
      {heading}
    </h2>
    <p className="lg:mb-10 mb-8 font-gill font-light leading-110 lg:text-xl md:text-lg text-base lg:text-neutral500 text-darkblack">
      {subheading}
    </p>
    {steps.length > 0 ? (
      <EducationDiscoverStepsList steps={steps} className="lg:mb-10 mb-8" />
    ) : null}
    {ctaLabel ? <EducationDiscoverJourneyCta label={ctaLabel} steps={steps} /> : null}
  </>
);

type EducationDiscoverSectionProps = {
  ctaBanner: NormalizedEducationCtaBanner;
};

const EducationDiscoverSection = ({ ctaBanner }: EducationDiscoverSectionProps) => {
  const hasImage = ctaBanner.hasCmsBackgroundImage && Boolean(ctaBanner.imageDesktopUrl);

  return (
    <section aria-labelledby="education-discover-title" className="bg-gray300">
      <div className="isolate flex w-full flex-col md:grid md:grid-cols-2 md:items-end lg:gap-20 md:gap-8">
        {hasImage ? (
          <Reveal
            direction="up"
            className="flex w-full md:order-1 order-2 lg:justify-start justify-end"
          >
            <ResponsiveImage
              desktopSrc={ctaBanner.imageDesktopUrl}
              mobileSrc={ctaBanner.imageMobileUrl}
              alt={ctaBanner.imageAlt}
              width={621}
              height={585}
              quality={85}
              className="h-full w-full object-cover object-center mix-blend-darken"
            />
          </Reveal>
        ) : null}
        <Reveal
          direction="up"
          className={cn(
            "relative z-10 md:order-2 order-1 w-full max-w-640 lg:justify-start justify-center lg:pt-100 lg:pb-100 pt-16 lg:px-0 px-4 md:mx-0 mx-auto py-10",
            !hasImage && "md:col-span-2",
          )}
        >
          <DiscoverContent
            heading={ctaBanner.heading}
            subheading={ctaBanner.subheading}
            ctaLabel={ctaBanner.ctaLabel}
            steps={ctaBanner.steps}
          />
        </Reveal>
      </div>
    </section>
  );
};

export default EducationDiscoverSection;
