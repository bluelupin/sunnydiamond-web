"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import { cn } from "@/shared/utils/cn";
import {
  educationHeroContent,
  educationHeroFigmaSpec,
  educationPageImages,
} from "../data/content";
import { useEducationHeroLoadAnimation } from "../hooks/useEducationHeroLoadAnimation";

const { section, image, title, overlay, animation } = educationHeroFigmaSpec;
const collapsedWidthPercent = `${animation.collapsedWidthRatio * 100}%`;

const EducationHeroSection = () => {
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
          <ResponsiveImage
            desktopSrc={educationPageImages.heroDesktop}
            mobileSrc={educationPageImages.heroMobile}
            alt={image.alt}
            priority
            width={image.width}
            height={image.height}
            quality={90}
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover object-center"
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
            {educationHeroContent.title}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default EducationHeroSection;
