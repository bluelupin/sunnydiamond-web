"use client";

import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import { cn } from "@/shared/utils/cn";
import type { NormalizedEducationHero } from "@/services/education/learn-about-diamonds-page.types";
import { educationHeroFigmaSpec } from "../data/content";
import EducationHeroMedia from "./EducationHeroMedia";
import { useEducationHeroLoadAnimation } from "../hooks/useEducationHeroLoadAnimation";

const { overlay } = educationHeroFigmaSpec;

type EducationHeroSectionProps = {
  hero: NormalizedEducationHero;
};

const EducationHeroSection = ({ hero }: EducationHeroSectionProps) => {
  const { expanded, reducedMotion } = useEducationHeroLoadAnimation();

  const heroTransition = reducedMotion
    ? ""
    : "transition-[width,top] duration-500 ease-in-out";

  return (
    <section
      id="education-hero"
      aria-labelledby="education-hero-title"
      className="relative flex flex-col overflow-hidden bg-white h-580 sm:h-580 lg:h-640 2xl:h-[85vh]"
    >
      <div className="relative flex-1 overflow-hidden p-0">
        <div
          className={cn(
            "absolute left-1/2 h-full -translate-x-1/2 overflow-hidden",
            heroTransition,
            expanded ? "-top-5 w-full md:top-0 md:w-full w-[92%]" : "w-full",
          )}
        >
          <EducationHeroMedia
            videoUrl={hero.videoUrl}
            posterDesktopUrl={hero.posterDesktopUrl}
            posterMobileUrl={hero.posterMobileUrl}
            posterAlt={hero.posterAlt}
            expanded={expanded}
            reducedMotion={reducedMotion}
          />

          <MediaContentOverlay
            gradient={overlay.gradient}
            className={cn(expanded ? "md:translate-y-0 -translate-y-0" : "")}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-16 lg:pb-75">
            <h1
              id="education-hero-title"
              className="w-full text-center font-larken text-[32px] font-light leading-none text-white lg:text-[60px]"
            >
              {hero.title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationHeroSection;
