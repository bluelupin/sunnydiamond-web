"use client";

import HeroBackgroundMedia from "@/features/cms/components/home/HeroBackgroundMedia";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import {
  getHeroScrollCollapseFrameStyle,
  getHeroScrollCollapseTitleStyle,
  heroScrollCollapseFrameBaseClass,
  heroScrollCollapseTitleBaseClass,
} from "@/shared/ui/heroScrollCollapseStyles";
import { cn } from "@/shared/utils/cn";
import type { NormalizedEducationHero } from "@/services/education/learn-about-diamonds-page.types";
import { educationHeroFigmaSpec } from "../data/content";
import { useEducationHeroLoadAnimation } from "../hooks/useEducationHeroLoadAnimation";

type EducationHeroSectionProps = NormalizedEducationHero;

const EducationHeroSection = ({ title, image, videoUrl }: EducationHeroSectionProps) => {
  const { progress, reducedMotion } = useEducationHeroLoadAnimation();
  const hasMedia = Boolean(
    image?.desktopUrl?.trim() || image?.mobileUrl?.trim() || videoUrl?.trim(),
  );

  const frameStyle = reducedMotion
    ? { top: 0, right: 0, bottom: 0, left: 0 }
    : getHeroScrollCollapseFrameStyle(progress);
  const titleStyle = reducedMotion ? { bottom: 0 } : getHeroScrollCollapseTitleStyle(progress);

  return (
    <section
      id="education-hero"
      aria-labelledby="education-hero-title"
      className="relative flex flex-col overflow-hidden bg-white h-640 2xl:h-[85vh]"
    >
      <div className="relative flex-1 overflow-hidden p-0">
        <div
          className={heroScrollCollapseFrameBaseClass}
          style={frameStyle}
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
          />
          <div
            className={cn(heroScrollCollapseTitleBaseClass, "pb-16")}
            // style={titleStyle}
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
