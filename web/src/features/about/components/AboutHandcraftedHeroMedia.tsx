"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { aboutHandcraftedFigmaSpec } from "../data/content";

const { hero } = aboutHandcraftedFigmaSpec;

type AboutHandcraftedHeroMediaProps = {
  videoUrl?: string;
  posterUrl?: string;
};

const getVideoMimeType = (url: string) => {
  if (url.endsWith(".webm")) return "video/webm";
  if (url.endsWith(".mp4")) return "video/mp4";
  return undefined;
};

const AboutHandcraftedHeroMedia = ({
  videoUrl,
  posterUrl,
}: AboutHandcraftedHeroMediaProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [useFallback, setUseFallback] = useState(!videoUrl);

  const showImageFallback = useCallback(() => {
    setUseFallback(true);
  }, []);

  useEffect(() => {
    if (!videoUrl || useFallback) return;

    const start = () => setShouldLoadVideo(true);

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(start, 1500);
    return () => window.clearTimeout(timeoutId);
  }, [useFallback, videoUrl]);

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

  const videoMimeType = videoUrl ? getVideoMimeType(videoUrl) : undefined;

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

      {shouldLoadVideo && videoUrl ? (
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
          <source src={videoUrl} type={videoMimeType} />
        </video>
      ) : null}
    </>
  );
};

export default AboutHandcraftedHeroMedia;
