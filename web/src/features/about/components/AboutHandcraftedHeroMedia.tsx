"use client";

import { useCallback, useState } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { aboutHandcraftedFigmaSpec } from "../data/content";

const { hero } = aboutHandcraftedFigmaSpec;

type AboutHandcraftedHeroMediaProps = {
  videoUrl?: string;
  posterUrl?: string;
};

const AboutHandcraftedHeroMedia = ({
  videoUrl,
  posterUrl,
}: AboutHandcraftedHeroMediaProps) => {
  const [useFallback, setUseFallback] = useState(!videoUrl);

  const showImageFallback = useCallback(() => {
    setUseFallback(true);
  }, []);

  if (useFallback || !videoUrl) {
    if (!posterUrl) return null;

    return (
      <ResponsiveImage
        desktopSrc={posterUrl}
        alt=""
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
      poster={posterUrl}
      aria-hidden
      tabIndex={-1}
      onError={showImageFallback}
    >
      <source src={videoUrl} type="video/webm" />
    </video>
  );
};

export default AboutHandcraftedHeroMedia;
