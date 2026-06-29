"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { educationHeroFigmaSpec } from "../data/content";

const { image } = educationHeroFigmaSpec;

type EducationHeroMediaProps = {
  videoUrl?: string;
  posterDesktopUrl: string;
  posterMobileUrl: string;
  posterAlt: string;
};

const getVideoMimeType = (url: string) => {
  if (url.endsWith(".webm")) return "video/webm";
  if (url.endsWith(".mp4")) return "video/mp4";
  return undefined;
};

const EducationHeroMedia = ({
  videoUrl,
  posterDesktopUrl,
  posterMobileUrl,
  posterAlt,
}: EducationHeroMediaProps) => {
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

  const showVideo = shouldLoadVideo && videoUrl && !useFallback;
  const videoMimeType = videoUrl ? getVideoMimeType(videoUrl) : undefined;

  return (
    <>
      <ResponsiveImage
        desktopSrc={posterDesktopUrl}
        mobileSrc={posterMobileUrl}
        alt={posterAlt}
        priority
        width={image.width}
        height={image.height}
        quality={90}
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {showVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={posterDesktopUrl}
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

export default EducationHeroMedia;
