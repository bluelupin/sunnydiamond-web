"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [useFallback, setUseFallback] = useState(!videoUrl);

  const showImageFallback = useCallback(() => {
    setUseFallback(true);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isDesktop || !videoUrl || useFallback) return;

    const start = () => setShouldLoadVideo(true);

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(start, 1500);
    return () => window.clearTimeout(timeoutId);
  }, [isDesktop, useFallback, videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    video.load();
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        showImageFallback();
      });
    }
  }, [shouldLoadVideo, showImageFallback]);

  if ((useFallback || !videoUrl) && posterUrl) {
    return (
      <ResponsiveImage
        desktopSrc={posterUrl}
        alt=""
        width={hero.width}
        height={hero.height}
        quality={80}
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    );
  }

  if (!posterUrl && (useFallback || !videoUrl)) {
    return null;
  }

  return (
    <>
      {posterUrl ? (
        <ResponsiveImage
          desktopSrc={posterUrl}
          alt=""
          width={hero.width}
          height={hero.height}
          quality={80}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : null}

      {isDesktop && shouldLoadVideo && videoUrl ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={posterUrl}
          aria-hidden
          tabIndex={-1}
          onError={showImageFallback}
        >
          <source src={videoUrl} type="video/webm" />
        </video>
      ) : null}
    </>
  );
};

export default AboutHandcraftedHeroMedia;
