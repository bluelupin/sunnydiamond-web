"use client";

import HeroBackgroundMedia from "@/features/cms/components/home/HeroBackgroundMedia";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import { cn } from "@/shared/utils/cn";
import type { NormalizedEducationHero } from "@/services/education/learn-about-diamonds-page.types";
import { educationHeroFigmaSpec } from "../data/content";
import { useEducationHeroLoadAnimation } from "../hooks/useEducationHeroLoadAnimation";

type EducationHeroSectionProps = NormalizedEducationHero;

const EducationHeroSection = ({ title, image, videoUrl }: EducationHeroSectionProps) => {
  const { expanded, reducedMotion } = useEducationHeroLoadAnimation();
  const hasMedia = Boolean(
    image?.desktopUrl?.trim() || image?.mobileUrl?.trim() || videoUrl?.trim(),
  );

  const heroTransition = reducedMotion
    ? ""
    : "transition-[width,top] duration-500 ease-in-out";

  return (
    <section
      id="education-hero"
      aria-labelledby="education-hero-title"
      className="relative flex flex-col overflow-hidden bg-white h-640 2xl:h-[85vh]"
    >
      <div className="relative flex-1 overflow-hidden p-0">
        <div
          className={cn(
            "absolute left-1/2 h-full -translate-x-1/2 overflow-hidden",
            heroTransition,
            expanded ? "-top-5 w-full md:top-0 md:w-full w-[92%]" : "w-full",
          )}
        >
          <HeroBackgroundMedia
            desktopImageUrl={image?.desktopUrl ?? ""}
            mobileImageUrl={image?.mobileUrl}
            desktopAlt={image?.alt ?? title}
            mobileAlt={image?.alt ?? title}
            cmsVideoUrl={videoUrl}
          />
          <MediaContentOverlay
            gradient={
              hasMedia ? educationHeroFigmaSpec.overlay.gradient : "bottom-strong"
            }
            className={cn(expanded ? "max-md:h-[632px] md:translate-y-0 -translate-y-3" : "")}
          />
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-16 lg:pb-75",
              expanded && "max-md:bottom-5",
            )}
          >
            <h1
              id="education-hero-title"
              className="w-full text-center font-larken font-light leading-none text-white lg:text-6xl md:text-5xl sm:text-4xl text-32"
            >
              {title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationHeroSection;
