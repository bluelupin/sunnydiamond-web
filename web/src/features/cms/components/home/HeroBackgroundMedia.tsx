"use client";

import { useEffect, useState } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { useMutedVideoPlayback } from "@/shared/hooks/useMutedVideoPlayback";
import { PLP_HERO_IMAGE_QUALITY } from "@/features/jewellery-product/utils/jewelleryPlpImage";
import { getImageSrc } from "@/shared/utils/image";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type HeroBackgroundMediaProps = {
  desktopImageUrl: string;
  mobileImageUrl?: string;
  desktopAlt: string;
  mobileAlt: string;
  cmsVideoUrl?: string;
  priority?: boolean;
  quality?: number;
};

function getVideoMimeType(url: string): string | undefined {
  if (url.endsWith(".webm")) return "video/webm";
  if (url.endsWith(".mp4")) return "video/mp4";
  return undefined;
}

const HeroBackgroundMedia = ({
  desktopImageUrl,
  mobileImageUrl,
  desktopAlt,
  mobileAlt,
  cmsVideoUrl,
  priority = true,
  quality = PLP_HERO_IMAGE_QUALITY,
}: HeroBackgroundMediaProps) => {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoSrc = cmsVideoUrl?.trim() ?? "";
  const hasVideo = Boolean(videoSrc);
  const videoRef = useMutedVideoPlayback(shouldLoadVideo && !prefersReducedMotion && hasVideo);

  const posterSrc = getImageSrc(mobileImageUrl || desktopImageUrl);
  const hasHeroImage = Boolean(posterSrc);
  const videoMimeType = hasVideo ? getVideoMimeType(videoSrc) : undefined;

  useEffect(() => {
    const motionMedia = window.matchMedia(REDUCED_MOTION_QUERY);

    const updateMotion = () => setPrefersReducedMotion(motionMedia.matches);

    updateMotion();

    motionMedia.addEventListener("change", updateMotion);

    return () => {
      motionMedia.removeEventListener("change", updateMotion);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !hasVideo) return;

    const start = () => setShouldLoadVideo(true);

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(start, 1500);
    return () => window.clearTimeout(timeoutId);
  }, [hasVideo, prefersReducedMotion]);

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

  if (!hasHeroImage && !hasVideo) {
    return <div className="absolute inset-0 bg-gray200" aria-hidden />;
  }

  return (
    <>
      {hasHeroImage ? (
        <ResponsiveImage
          desktopSrc={desktopImageUrl || mobileImageUrl || posterSrc || ""}
          mobileSrc={mobileImageUrl}
          alt={desktopAlt}
          desktopAlt={desktopAlt}
          mobileAlt={mobileAlt}
          priority={priority}
          width={1920}
          height={1080}
          sizes="100vw"
          quality={quality}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray200" aria-hidden />
      )}

      {shouldLoadVideo && !prefersReducedMotion && hasVideo ? (
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
          {videoMimeType ? <source src={videoSrc} type={videoMimeType} /> : null}
        </video>
      ) : null}
    </>
  );
};

export default HeroBackgroundMedia;
