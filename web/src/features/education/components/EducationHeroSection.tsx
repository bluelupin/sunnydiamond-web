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

  const motionTransition = reducedMotion
    ? ""
    : "transition-[width,top,bottom,height] duration-500 ease-in-out";

  const overlayTransition = reducedMotion
    ? ""
    : "transition-[transform,height] duration-500 ease-in-out";

  const titleTransition = reducedMotion ? "" : "transition-[bottom] duration-500 ease-in-out";

  return (
    <section
      id="education-hero"
      aria-labelledby="education-hero-title"
      className="relative flex flex-col overflow-hidden bg-white h-640 2xl:h-[85vh]"
    >
      <div className="relative flex-1 overflow-hidden p-0">
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 overflow-hidden",
            motionTransition,
            expanded ? "-top-5 bottom-5 w-[92%]" : "top-0 bottom-0 h-full w-full",
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
            className={cn(
              overlayTransition,
              expanded ? "-translate-y-3 max-md:h-[632px] md:h-full" : "",
            )}
          />
          <div
            className={cn(
              titleTransition,
              "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-16 lg:pb-75",
              expanded && "bottom-5",
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
