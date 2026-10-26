"use client";

import Image from "next/image";
import { useEffect, useSyncExternalStore } from "react";
import { useMutedVideoPlayback } from "@/shared/hooks/useMutedVideoPlayback";
import { useScrollSyncedVideo } from "@/shared/hooks/useScrollSyncedVideo";
import { DESKTOP_MEDIA_QUERY } from "@/shared/lib/breakpoints";

const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(motionQuery).matches,
    () => true,
  );
}

type CraftsmanshipMediaVariant = "desktop" | "mobile";

function subscribeViewport(callback: () => void) {
  const query = window.matchMedia(DESKTOP_MEDIA_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getViewportVariant(): CraftsmanshipMediaVariant {
  // Match this section's existing lg:hidden / hidden lg:block wrappers.
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches ? "desktop" : "mobile";
}

function getServerViewportVariant(): CraftsmanshipMediaVariant | null {
  // Do not emit either video source before the browser knows its viewport.
  return null;
}

type CraftsmanshipMediaProps = {
  src: string;
  mobileSrc: string;
  alt: string;
  mobileAlt: string;
  isVideo: boolean;
  mobileIsVideo: boolean;
  background?: boolean;
  variant: CraftsmanshipMediaVariant;
  /** When set, video scrubs with section scroll instead of autoplay looping. */
  scrollProgress?: number;
};

function CraftsmanshipMediaLayer({
  url,
  label,
  isVideoMedia,
  background,
  scrollProgress,
}: {
  url: string;
  label: string;
  isVideoMedia: boolean;
  background: boolean;
  scrollProgress?: number;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const isScrollScrubbed = isVideoMedia && scrollProgress !== undefined;
  const shouldPlayVideo = isVideoMedia && !reducedMotion;
  const videoRef = useMutedVideoPlayback(shouldPlayVideo);

  useScrollSyncedVideo(videoRef, scrollProgress ?? 0, isScrollScrubbed);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlayVideo || isScrollScrubbed) {
      return;
    }

    const tryPlay = () => {
      void video.play().catch(() => {
        /* Autoplay can be blocked until visible — poster/background remains. */
      });
    };

    video.addEventListener("canplay", tryPlay);
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      tryPlay();
    }

    return () => {
      video.removeEventListener("canplay", tryPlay);
    };
  }, [isScrollScrubbed, shouldPlayVideo, url, videoRef]);

  if (isVideoMedia) {
    return (
      <video
        key={url}
        ref={videoRef}
        src={url}
        aria-label={label || "Craftsmanship process video"}
        className={
          background
            ? "absolute inset-0 h-full w-full origin-right scale-110 object-cover object-right lg:scale-100 lg:object-center"
            : "h-full w-full object-contain"
        }
        autoPlay={!reducedMotion && !isScrollScrubbed}
        muted
        loop={!isScrollScrubbed}
        playsInline
        preload={isScrollScrubbed ? "auto" : "metadata"}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={label}
      width={550}
      height={400}
      sizes="(min-width: 1024px) 550px, 72vw"
      className="h-full w-full object-cover"
    />
  );
}

export default function CraftsmanshipMedia({
  src,
  mobileSrc,
  alt,
  mobileAlt,
  isVideo,
  mobileIsVideo,
  background = false,
  variant,
  scrollProgress,
}: CraftsmanshipMediaProps) {
  const viewportVariant = useSyncExternalStore(
    subscribeViewport,
    getViewportVariant,
    getServerViewportVariant,
  );
  const url = variant === "mobile" ? mobileSrc : src;
  const label = variant === "mobile" ? mobileAlt : alt;
  const isVideoMedia = variant === "mobile" ? mobileIsVideo : isVideo;

  if (!url || (isVideoMedia && viewportVariant !== variant)) {
    return null;
  }

  return (
    <CraftsmanshipMediaLayer
      url={url}
      label={label}
      isVideoMedia={isVideoMedia}
      background={background}
      scrollProgress={scrollProgress}
    />
  );
}
