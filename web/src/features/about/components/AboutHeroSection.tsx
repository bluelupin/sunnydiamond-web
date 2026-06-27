"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import { cn } from "@/shared/utils/cn";
import { aboutHeroFigmaSpec } from "../data/content";
import { useAboutHeroLoadAnimation } from "../hooks/useAboutHeroLoadAnimation";
import type { NormalizedAboutHero } from "@/services/about/about-page.types";
const { animation: heroAnimation } = aboutHeroFigmaSpec;
const collapsedWidthPercent = `100%`;
type AboutHeroSectionProps = NormalizedAboutHero;

const AboutHeroSection = ({ title, image }: AboutHeroSectionProps) => {
  const { expanded, titleVisible, reducedMotion } = useAboutHeroLoadAnimation();

  const heroTransition = reducedMotion
    ? ""
    : "transition-[width,top] duration-500 ease-in-out";

  const imageTransition = reducedMotion
    ? ""
    : "transition-transform duration-500 ease-in-out lg:transition-none";

  const titleTransition = reducedMotion
    ? ""
    : "transition-[opacity,transform] duration-500 ease-out";

  return (
    <section
      id="about-hero"
      aria-labelledby="about-hero-title"
      className="relative flex flex-col overflow-hidden bg-white h-580 sm:h-580 lg:h-640 2xl:h-[85vh]"
    >
      <div className="relative flex-1 overflow-hidden p-0">
        <div
          className={cn(
            "absolute left-1/2 h-full -translate-x-1/2 overflow-hidden",
            heroTransition,
            expanded ? "-top-5 w-full md:top-0 md:w-full w-[92%]" : "",
          )}
          style={{ width: !expanded ? collapsedWidthPercent : undefined }}
        >
          <ResponsiveImage
            desktopSrc={image.desktopUrl}
            mobileSrc={image.mobileUrl}
            alt={image.alt}
            priority
            width={image.width ?? 1802}
            height={image.height ?? 1802}
            quality={85}
            sizes="100vw"
            className={cn(
              "absolute inset-0 h-full w-full object-cover object-center",
              imageTransition,
              expanded ? "md:translate-y-0 -translate-y-1 md:h-full -h-[0px]" : "",
            )}
          />
          <MediaContentOverlay gradient={aboutHeroFigmaSpec.overlay.gradient} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-16 lg:pb-75">
            <h1
              className="w-full max-w-886 text-center font-larken text-32 font-light leading-110 text-white sm:text-36 lg:text-5xl 2xl:text-5xl">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
