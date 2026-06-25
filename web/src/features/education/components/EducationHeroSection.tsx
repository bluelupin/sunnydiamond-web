"use client";

import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import { cn } from "@/shared/utils/cn";
import { educationHeroContent, educationPageImages } from "../data/content";
import { useEducationHeroLoadAnimation } from "../hooks/useEducationHeroLoadAnimation";

const EducationHeroSection = () => {
  const { expanded, titleVisible, reducedMotion } = useEducationHeroLoadAnimation();

  const heroTransition = reducedMotion
    ? ""
    : "transition-[width,top] duration-500 ease-in-out";

  const titleTransition = reducedMotion
    ? ""
    : "transition-[opacity,transform] duration-500 ease-out";

  return (
    <section
      id="education-hero"
      aria-labelledby="education-hero-title"
      className="relative flex h-[640px] flex-col overflow-hidden bg-white"
    >
      <div className="relative flex-1 overflow-hidden">
        <div
          className={cn(
            "absolute left-1/2 h-full -translate-x-1/2 overflow-hidden",
            heroTransition,
            expanded ? "top-0 w-full" : "top-[-20px] w-[92%]",
          )}
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={educationPageImages.heroPoster}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={educationHeroContent.videoSrc} type="video/mp4" />
          </video>

          <MediaContentOverlay gradient="bottom-strong" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-[128px]">
          <h1
            id="education-hero-title"
            className={cn(
              "text-center font-larken text-[32px] font-light leading-none text-white lg:text-[60px]",
              titleTransition,
              titleVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            {educationHeroContent.title}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default EducationHeroSection;
