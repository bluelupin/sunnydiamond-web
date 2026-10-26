"use client";

import { useEffect, useRef, type RefObject } from "react";
import { iosSeekScrollVideo, primeIosScrollVideo } from "@/shared/utils/iosScrollVideo";
import { isIosWebKit } from "@/shared/utils/isIosWebKit";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** @deprecated Use primeIosScrollVideo from iosScrollVideo — kept for CraftsmanshipProcess touch handler. */
export function primeIosScrollVideoFrame(video: HTMLVideoElement) {
  primeIosScrollVideo(video);
}

/**
 * Maps vertical scroll progress (0–1) to `video.currentTime` for scroll-scrubbed playback.
 */
export function useScrollSyncedVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  progress: number,
  enabled: boolean,
) {
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled) {
      return;
    }

    let decodePrimed = false;

    const applyScrubTime = (targetTime: number) => {
      if (isIosWebKit()) {
        iosSeekScrollVideo(video, targetTime);
        return;
      }

      if ("fastSeek" in video && typeof video.fastSeek === "function") {
        try {
          video.fastSeek(targetTime);
          return;
        } catch {
          /* fall through */
        }
      }
      video.currentTime = targetTime;
    };

    const syncTime = () => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) {
        return;
      }

      const targetTime = clamp01(progressRef.current) * Math.max(duration - 0.04, 0);

      if (isIosWebKit()) {
        applyScrubTime(targetTime);
        return;
      }

      video.pause();
      if (Math.abs(video.currentTime - targetTime) > 0.03) {
        applyScrubTime(targetTime);
      }
    };

    const primeDecodeForScrub = () => {
      if (decodePrimed) {
        syncTime();
        return;
      }
      decodePrimed = true;
      video.muted = true;
      if (isIosWebKit()) {
        syncTime();
        return;
      }
      const playAttempt = video.play();
      if (playAttempt === undefined) {
        syncTime();
        return;
      }
      playAttempt
        .then(() => {
          video.pause();
          syncTime();
        })
        .catch(() => {
          syncTime();
        });
    };

    syncTime();
    video.addEventListener("loadedmetadata", syncTime);
    video.addEventListener("durationchange", syncTime);
    video.addEventListener("loadeddata", primeDecodeForScrub);
    video.addEventListener("canplay", primeDecodeForScrub);
    const onSeeked = () => {
      if (isIosWebKit()) {
        primeIosScrollVideo(video);
      }
    };
    video.addEventListener("seeked", onSeeked);

    return () => {
      video.removeEventListener("loadedmetadata", syncTime);
      video.removeEventListener("durationchange", syncTime);
      video.removeEventListener("loadeddata", primeDecodeForScrub);
      video.removeEventListener("canplay", primeDecodeForScrub);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [enabled, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled) {
      return;
    }

    const applyProgress = () => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) {
        return;
      }

      const targetTime = clamp01(progress) * Math.max(duration - 0.04, 0);

      if (isIosWebKit()) {
        iosSeekScrollVideo(video, targetTime);
        return;
      }

      video.pause();
      if (Math.abs(video.currentTime - targetTime) <= 0.03) {
        return;
      }

      if ("fastSeek" in video && typeof video.fastSeek === "function") {
        try {
          video.fastSeek(targetTime);
          return;
        } catch {
          /* fall through */
        }
      }
      video.currentTime = targetTime;
    };

    applyProgress();
    video.addEventListener("loadedmetadata", applyProgress);

    return () => {
      video.removeEventListener("loadedmetadata", applyProgress);
    };
  }, [enabled, progress, videoRef]);
}
