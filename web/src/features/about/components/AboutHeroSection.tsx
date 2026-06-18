"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { aboutHeroContent, aboutPageImages } from "../data/content";

const AboutHeroSection = () => {
  return (
    <section
      id="about-hero"
      aria-labelledby="about-hero-title"
      className="relative h-[640px] flex flex-col overflow-hidden bg-gray200"
    >
      <div className="relative flex-1 overflow-hidden">
        <ResponsiveImage
          desktopSrc={aboutPageImages.hero}
          alt="Sunny Diamonds craftsmanship"
          priority
          width={1802}
          height={1802}
          quality={90}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-x-0 bottom-0 flex justify-center px-5 pb-12 md:pb-20 lg:pb-[75px]">
          <h1
            id="about-hero-title"
            className="font-larken font-light text-[32px] sm:text-[40px] lg:text-[48px] leading-[110%] text-white text-center w-full max-w-[886px]"
          >
            {aboutHeroContent.title}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
