"use client";

import { useEffect, useState } from "react";
import { useMutedVideoPlayback } from "@/shared/hooks/useMutedVideoPlayback";

export default function HeroVideoPlayer({ src }: { src: string }) {
  const [frameReady, setFrameReady] = useState(false);
  const videoRef = useMutedVideoPlayback();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();
    void video.play().catch(() => {
      // The hero image remains visible if autoplay is blocked.
    });
  }, [videoRef]);

  const type = src.endsWith(".webm") ? "video/webm" : src.endsWith(".mp4") ? "video/mp4" : undefined;

  return (
    <video
      ref={videoRef}
      className={`absolute inset-0 h-full w-full object-cover ${frameReady ? "opacity-100" : "opacity-0"}`}
      onLoadedData={() => setFrameReady(true)}
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      aria-hidden
      tabIndex={-1}
    >
      <source src={src} type={type} />
    </video>
  );
}
