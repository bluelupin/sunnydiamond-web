"use client";

import { useCallback, useState } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import {
  aboutHandcraftedAssets,
  aboutHandcraftedFigmaSpec,
  aboutPageImages,
} from "../data/content";

const { hero } = aboutHandcraftedFigmaSpec;

const AboutHandcraftedHeroMedia = () => {
  const [useFallback, setUseFallback] = useState(false);

  const showImageFallback = useCallback(() => {
    setUseFallback(true);
  }, []);

  if (useFallback) {
    return (
      <ResponsiveImage
        desktopSrc={aboutPageImages.handcraftedBg}
        alt="Handcrafted diamond jewellery"
        width={hero.width}
        height={hero.height}
        quality={90}
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    );
  }

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover object-center"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster={aboutPageImages.handcraftedBg}
      aria-hidden
      tabIndex={-1}
      onError={showImageFallback}
    >
      <source src={aboutHandcraftedAssets.heroVideo} type="video/mp4" />
    </video>
  );
};

export default AboutHandcraftedHeroMedia;
