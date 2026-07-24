"use client";

import { useEffect, useRef, useState } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { getImageSrc } from "@/shared/utils/image";
import { TABLET_UP_MEDIA_QUERY } from "@/shared/lib/breakpoints";

const HERO_VIDEO_WEBM_SRC = "/videos/hero-banner-video.webm";
const HERO_VIDEO_MP4_SRC = "/videos/hero-banner-video.mp4";

type HeroBackgroundMediaProps = {
  desktopImageUrl: string;
  mobileImageUrl?: string;
  alt: string;
  isLoading: boolean;
  cmsVideoUrl?: string;
};

const HeroBackgroundMedia = ({
  desktopImageUrl,
  mobileImageUrl,
  alt,
  isLoading,
  cmsVideoUrl,
}: HeroBackgroundMediaProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isTabletUp, setIsTabletUp] = useState(false);

  const posterSrc = getImageSrc(desktopImageUrl || mobileImageUrl);
  const hasHeroImage = Boolean(posterSrc);
  const videoWebmSrc = cmsVideoUrl?.endsWith(".webm") ? cmsVideoUrl : HERO_VIDEO_WEBM_SRC;
  const videoMp4Src =
    cmsVideoUrl && !cmsVideoUrl.endsWith(".webm") ? cmsVideoUrl : HERO_VIDEO_MP4_SRC;

  useEffect(() => {
    const media = window.matchMedia(TABLET_UP_MEDIA_QUERY);
    const update = () => setIsTabletUp(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isTabletUp) return;

    const start = () => setShouldLoadVideo(true);

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(start, 1500);
    return () => window.clearTimeout(timeoutId);
  }, [isTabletUp]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    video.load();
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        /* autoplay blocked — poster remains visible */
      });
    }
  }, [shouldLoadVideo]);

  if (isLoading && !hasHeroImage) {
    return <div className="absolute inset-0 animate-pulse bg-gray200" aria-hidden />;
  }

  if (!hasHeroImage) {
    return <div className="absolute inset-0 bg-gray200" aria-hidden />;
  }

  return (
    <>
      <ResponsiveImage
        desktopSrc={desktopImageUrl || mobileImageUrl || posterSrc || ""}
        mobileSrc={mobileImageUrl}
        alt={alt}
        priority
        width={1920}
        height={1080}
        sizes="100vw"
        quality={80}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {isTabletUp && shouldLoadVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={posterSrc ?? undefined}
          aria-hidden
          tabIndex={-1}
        >
          <source src={videoWebmSrc} type="video/webm" />
          <source src={videoMp4Src} type="video/mp4" />
        </video>
      ) : null}
    </>
  );
};

export default HeroBackgroundMedia;
