"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMutedVideoPlayback } from "@/shared/hooks/useMutedVideoPlayback";
import { useScrollSyncedVideo } from "@/shared/hooks/useScrollSyncedVideo";
import { DESKTOP_MEDIA_QUERY } from "@/shared/lib/breakpoints";
import { primeIosScrollVideo } from "@/shared/utils/iosScrollVideo";
import { isIosWebKit } from "@/shared/utils/isIosWebKit";
import { resolveCraftsmanshipPlaybackUrl } from "@/shared/utils/resolveCraftsmanshipVideoUrl";
import { cn } from "@/shared/utils/cn";

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
  scrollProgress?: number;
};

function CraftsmanshipMediaLayer({
  url,
  desktopVideoFallbackUrl,
  label,
  isVideoMedia,
  background,
  scrollProgress,
  variant,
}: {
  url: string;
  desktopVideoFallbackUrl?: string;
  label: string;
  isVideoMedia: boolean;
  background: boolean;
  scrollProgress?: number;
  variant: CraftsmanshipMediaVariant;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const isScrollScrubbed = isVideoMedia && scrollProgress !== undefined;
  const shouldAutoplayVideo = isVideoMedia && !reducedMotion && !isScrollScrubbed;
  const frameRef = useRef<HTMLDivElement>(null);
  const [errorFallbackUrl, setErrorFallbackUrl] = useState<string | null>(null);

  const resolvedUrl = resolveCraftsmanshipPlaybackUrl(url, desktopVideoFallbackUrl);
  const playbackUrl = errorFallbackUrl ?? resolvedUrl;

  const videoRef = useMutedVideoPlayback(isVideoMedia);

  useScrollSyncedVideo(videoRef, scrollProgress ?? 0, isScrollScrubbed);

  useEffect(() => {
    setErrorFallbackUrl(null);
  }, [resolvedUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideoMedia) {
      return;
    }

    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.playsInline = true;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.load();
  }, [isVideoMedia, playbackUrl, videoRef]);

  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video || !isVideoMedia || !background) {
      return;
    }

    const syncVideoSurfaceSize = () => {
      const width = Math.round(frame.clientWidth);
      const height = Math.round(frame.clientHeight);
      if (width > 0 && height > 0) {
        video.style.width = `${width}px`;
        video.style.height = `${height}px`;
      }
    };

    syncVideoSurfaceSize();
    const ro = new ResizeObserver(syncVideoSurfaceSize);
    ro.observe(frame);

    return () => ro.disconnect();
  }, [background, isVideoMedia, playbackUrl, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    const frame = frameRef.current;
    if (!video || !isVideoMedia || !background || !isScrollScrubbed) {
      return;
    }

    const root = frame ?? video;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }
        video.load();
        primeIosScrollVideo(video);
      },
      { root: null, threshold: 0.05 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [background, isScrollScrubbed, isVideoMedia, playbackUrl, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldAutoplayVideo) {
      return;
    }

    const tryPlay = () => {
      void video.play().catch(() => {});
    };

    video.addEventListener("canplay", tryPlay);
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      tryPlay();
    }

    return () => {
      video.removeEventListener("canplay", tryPlay);
    };
  }, [shouldAutoplayVideo, playbackUrl, videoRef]);

  const handleVideoError = () => {
    if (
      desktopVideoFallbackUrl &&
      playbackUrl !== desktopVideoFallbackUrl &&
      !errorFallbackUrl
    ) {
      setErrorFallbackUrl(resolveCraftsmanshipPlaybackUrl(desktopVideoFallbackUrl));
    }
  };

  if (isVideoMedia) {
    const videoNode = (
      <video
        key={playbackUrl}
        ref={videoRef}
        src={playbackUrl}
        aria-label={label || "Craftsmanship process video"}
        className={cn(background ? cnVideoBackgroundElement() : cnVideoInline(),"w-full")}
        autoPlay={shouldAutoplayVideo}
        muted
        loop={!isScrollScrubbed}
        playsInline
        preload={isScrollScrubbed ? "auto" : "metadata"}
        disablePictureInPicture
        controls={false}
        onError={isIosWebKit() ? handleVideoError : undefined}
        {...(background ? { "data-craftsmanship-bg-video": "" } : {})}
      />
    );

    if (background) {
      return (
        <div ref={frameRef} className={cnVideoBackgroundFrame(variant)}>
          {videoNode}
        </div>
      );
    }

    return videoNode;
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

function cnVideoBackgroundFrame(variant: CraftsmanshipMediaVariant) {
  if (variant === "mobile") {
    return "absolute inset-0 origin-center max-lg:scale-100";
  }
  return "absolute inset-0 origin-right scale-110 lg:scale-100";
}

function cnVideoBackgroundElement() {
  return "absolute inset-0 max-h-full max-w-full object-cover object-right lg:object-center";
}

function cnVideoInline() {
  return "h-full w-full object-contain";
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
      desktopVideoFallbackUrl={variant === "mobile" && isVideo ? src : undefined}
      label={label}
      isVideoMedia={isVideoMedia}
      background={background}
      scrollProgress={scrollProgress}
      variant={variant}
    />
  );
}
