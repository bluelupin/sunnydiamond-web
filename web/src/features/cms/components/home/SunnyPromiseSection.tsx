"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { resolveImageSrcString } from "@/shared/utils/image";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import { isSectionActive } from "@/shared/utils/cmsSection";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import Reveal from "@/shared/Animation/Reveal";
import { useMutedVideoPlayback } from "@/shared/hooks/useMutedVideoPlayback";

interface SunnyPromiseSectionProps {
  id?: string;
}

const getVideoMimeType = (url: string) => {
  if (url.endsWith(".webm")) return "video/webm";
  if (url.endsWith(".mp4")) return "video/mp4";
  return undefined;
};

const SunnyPromiseSection = ({ id }: SunnyPromiseSectionProps) => {
  const { data: editorialData, isLoading: isEditorialLoading } = useHomepageEditorialBlocks();
  const sunnyPromiseData = editorialData?.sunnyPromiseSection ?? null;
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  const sectionTitle = sunnyPromiseData?.sectionTitle?.trim();
  const description = sunnyPromiseData?.description?.trim();
  const ctaUrl = sunnyPromiseData?.cta?.url || sunnyPromiseData?.cta?.to;
  const ctaLabel = sunnyPromiseData?.cta?.label?.trim();
  const videoUrl = sunnyPromiseData?.videoUrl;
  const posterUrl = resolveCmsMediaUrl(sunnyPromiseData?.posterImage);
  const videoRef = useMutedVideoPlayback(Boolean(videoUrl && shouldLoadVideo));

  useEffect(() => {
    if (!videoUrl) return;

    const start = () => setShouldLoadVideo(true);

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(start, 1500);
    return () => window.clearTimeout(timeoutId);
  }, [videoUrl]);

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

  const isSectionVisible =
    sunnyPromiseData != null &&
    sunnyPromiseData.showField !== false &&
    isSectionActive(sunnyPromiseData.isActive);

  if (isEditorialLoading || !isSectionVisible) {
    return null;
  }

  const videoMimeType = videoUrl ? getVideoMimeType(videoUrl) : undefined;

  return (
    <section
      id={id}
      aria-label={sectionTitle ?? "The Sunny Promise"}
      className="min-h-[480px] flex flex-col items-center gap-8 bg-white px-4 lg:gap-10 lg:px-10 lg:py-100 md:py-20 py-16"
    >
      {sectionTitle ? (
        <Reveal as="h2" direction="up" className="text-center font-larken font-light leading-110 text-darkblack lg:text-5xl md:text-4xl text-32 lg:whitespace-nowrap">
          {sectionTitle}
        </Reveal>
      ) : null}

      {videoUrl ? (
        <Reveal direction="up" className="relative w-full max-w-[1360px] shrink-0 overflow-hidden lg:h-[600px] md:h-[500px] h-[400px]">
          <video
            ref={videoRef}
            className="absolute inset-0 size-full object-cover object-center"
            autoPlay
            loop
            muted
            playsInline
            preload={shouldLoadVideo ? "metadata" : "none"}
            poster={posterUrl ? resolveImageSrcString(posterUrl) : undefined}
            aria-hidden
            tabIndex={-1}
          >
            {shouldLoadVideo ? (
              <source src={videoUrl} type={videoMimeType} />
            ) : null}
          </video>
        </Reveal>
      ) : null}

      {(description || (ctaUrl && ctaLabel)) ? (
        <div className="flex w-full flex-col items-center gap-6 lg:gap-6">
          {description ? (
            <Reveal direction="up" className="max-w-[384px] text-center font-gill text-base font-light leading-110 text-neutral500 md:text-xl">
              {description}
            </Reveal>
          ) : null}
          {ctaUrl && ctaLabel ? (
            <Reveal direction="up">
              <Link
                href={ctaUrl}
                className="text-tertiary-cta-underline shrink-0 cursor-pointer pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack sm:pb-1"
              >
                {ctaLabel}
              </Link>
            </Reveal>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default SunnyPromiseSection;
