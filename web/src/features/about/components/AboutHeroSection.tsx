"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import {
  aboutHeroContent,
  aboutHeroFigmaSpec,
  aboutPageImages,
} from "../data/content";

const AboutHeroSection = () => {
  return (
    <section
      id="about-hero"
      aria-labelledby="about-hero-title"
      className="relative flex flex-col overflow-hidden bg-gray200 h-640"
    >
      <div className="relative flex-1 overflow-hidden">
        <ResponsiveImage
          desktopSrc={aboutPageImages.heroDesktop}
          mobileSrc={aboutPageImages.heroMobile}
          alt="Sunny Diamonds craftsmanship"
          priority
          width={1802}
          height={1802}
          quality={90}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <MediaContentOverlay gradient={aboutHeroFigmaSpec.overlay.gradient} />

        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-16 lg:pb-75">
          <h1
            id="about-hero-title"
            className="w-full max-w-886 text-center font-larken text-36 font-light leading-110 text-white sm:text-40 lg:text-48"
          >
            {aboutHeroContent.title}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
