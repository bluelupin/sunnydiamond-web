"use client";

import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import { cn } from "@/shared/utils/cn";
import type { NormalizedEducationHero } from "@/services/education/learn-about-diamonds-page.types";
import { educationHeroFigmaSpec } from "../data/content";
import EducationHeroMedia from "./EducationHeroMedia";
import { useEducationHeroLoadAnimation } from "../hooks/useEducationHeroLoadAnimation";

const { section, title, overlay, animation } = educationHeroFigmaSpec;
const collapsedWidthPercent = `${animation.collapsedWidthRatio * 100}%`;

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
      className="relative flex flex-col overflow-hidden bg-white"
      style={{ height: section.height }}
    >
      <div className="relative flex-1 overflow-hidden">
        <div
          className={cn(
            "absolute left-1/2 h-full -translate-x-1/2 overflow-hidden",
            heroTransition,
            expanded ? "top-0 w-full" : "top-[-100px]",
          )}
          style={{ width: expanded ? undefined : collapsedWidthPercent }}
        >
          <EducationHeroMedia
            videoUrl={hero.videoUrl}
            posterDesktopUrl={hero.posterDesktopUrl}
            posterMobileUrl={hero.posterMobileUrl}
            posterAlt={hero.posterAlt}
          />

          <MediaContentOverlay gradient={overlay.gradient} />
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center"
          style={{ paddingBottom: title.bottom }}
        >
          <h1
            id="education-hero-title"
            className="text-center font-larken text-[32px] font-light leading-none text-white lg:text-[60px]"
          >
            {hero.title}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default EducationHeroSection;
