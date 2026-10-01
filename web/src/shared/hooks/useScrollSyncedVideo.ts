"use client";

import { useEffect, type RefObject } from "react";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Maps vertical scroll progress (0–1) to `video.currentTime` for scroll-scrubbed playback.
 */
export function useScrollSyncedVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  progress: number,
  enabled: boolean,
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled) {
      return;
    }

    const syncTime = () => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) {
        return;
      }

      video.pause();
      const targetTime = clamp01(progress) * Math.max(duration - 0.04, 0);
      if (Math.abs(video.currentTime - targetTime) > 0.03) {
        video.currentTime = targetTime;
      }
    };

    syncTime();
    video.addEventListener("loadedmetadata", syncTime);
    video.addEventListener("durationchange", syncTime);

    return () => {
      video.removeEventListener("loadedmetadata", syncTime);
      video.removeEventListener("durationchange", syncTime);
    };
  }, [enabled, progress, videoRef]);
}
