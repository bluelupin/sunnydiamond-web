"use client";

import { useEffect, useRef } from "react";
import { bindMutedVideoPlayback } from "@/shared/utils/mutedVideo";

/** Ref + lifecycle hook that keeps a video element muted at all times. */
export function useMutedVideoPlayback(active = true) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !active) return;

    return bindMutedVideoPlayback(video);
  }, [active]);

  return videoRef;
}
