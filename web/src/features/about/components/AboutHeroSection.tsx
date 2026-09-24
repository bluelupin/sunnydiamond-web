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
import { aboutHeroFigmaSpec } from "../data/content";
import { useAboutHeroLoadAnimation } from "../hooks/useAboutHeroLoadAnimation";
import type { NormalizedAboutHero } from "@/services/about/about-page.types";

type AboutHeroSectionProps = NormalizedAboutHero;

const AboutHeroSection = ({ title, image, videoUrl }: AboutHeroSectionProps) => {
  const { progress, reducedMotion } = useAboutHeroLoadAnimation();
  const hasMedia = Boolean(
    image?.desktopUrl?.trim() || image?.mobileUrl?.trim() || videoUrl?.trim(),
  );

  const frameStyle = reducedMotion
    ? { top: 0, right: 0, bottom: 0, left: 0 }
    : getHeroScrollCollapseFrameStyle(progress);
  const titleStyle = reducedMotion ? { bottom: 0 } : getHeroScrollCollapseTitleStyle(progress);

  return (
    <section
      id="about-hero"
      aria-labelledby="about-hero-title"
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
            gradient={hasMedia ? aboutHeroFigmaSpec.overlay.gradient : "bottom-strong"}
          />
          <div
            className={cn(heroScrollCollapseTitleBaseClass, "pb-16 lg:pb-75")}
            // style={titleStyle}
          >
            <h1
              id="about-hero-title"
              className="w-full max-w-886 text-center font-larken text-32 font-light leading-110 text-white lg:text-6xl md:text-5xl text-4xl"
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
