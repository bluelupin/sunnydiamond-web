"use client";

import HeroBackgroundMedia from "@/features/cms/components/home/HeroBackgroundMedia";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import { cn } from "@/shared/utils/cn";
import { aboutHeroFigmaSpec } from "../data/content";
import { useAboutHeroLoadAnimation } from "../hooks/useAboutHeroLoadAnimation";
import type { NormalizedAboutHero } from "@/services/about/about-page.types";

type AboutHeroSectionProps = NormalizedAboutHero;

const AboutHeroSection = ({ title, image, videoUrl }: AboutHeroSectionProps) => {
  const { expanded, reducedMotion } = useAboutHeroLoadAnimation();
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
      id="about-hero"
      aria-labelledby="about-hero-title"
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
            gradient={hasMedia ? aboutHeroFigmaSpec.overlay.gradient : "bottom-strong"}
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
              id="about-hero-title"
              className="w-full max-w-886 text-center font-larken text-32 font-light leading-110 text-white sm:text-4xl lg:text-5xl 2xl:text-5xl"
            >
              {title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
