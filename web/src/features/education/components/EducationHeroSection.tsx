"use client";

import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import { cn } from "@/shared/utils/cn";
import type { NormalizedEducationHero } from "@/services/education/learn-about-diamonds-page.types";
import { educationHeroFigmaSpec } from "../data/content";
import EducationHeroMedia from "./EducationHeroMedia";
import { useEducationHeroLoadAnimation } from "../hooks/useEducationHeroLoadAnimation";

const { section, overlay, animation } = educationHeroFigmaSpec;
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
      className="relative flex flex-col justify-end overflow-hidden bg-white pb-16"
      style={{ height: section.height }}
    >
      <div className="absolute inset-0 overflow-hidden">
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
      </div>

      <h1
        id="education-hero-title"
        className={cn("relative z-10 text-center font-larken text-[32px] font-light leading-none text-white lg:text-[60px] transition-all duration-500",
          expanded ? "" : "top-[-100px]",)}
      >
        {hero.title}
      </h1>
    </section>
  );
};

export default EducationHeroSection;
