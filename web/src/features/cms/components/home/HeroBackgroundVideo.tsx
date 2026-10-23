"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const HeroVideoPlayer = dynamic(() => import("./HeroVideoPlayer"), {
  ssr: false,
  loading: () => null,
});

export default function HeroBackgroundVideo({ src }: { src: string }) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const motionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
    let timer = 0;
    const startAfterLoad = () => {
      if (motionMedia.matches) return;
      // Download the video player only after the hero image has had time to paint.
      timer = window.setTimeout(() => setShouldLoad(true), 3000);
    };

    if (document.readyState === "complete") {
      startAfterLoad();
    } else {
      window.addEventListener("load", startAfterLoad, { once: true });
    }

    const handleReducedMotion = (event: MediaQueryListEvent) => {
      if (event.matches) {
        window.clearTimeout(timer);
        setShouldLoad(false);
      } else if (document.readyState === "complete") {
        startAfterLoad();
      }
    };
    motionMedia.addEventListener("change", handleReducedMotion);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", startAfterLoad);
      motionMedia.removeEventListener("change", handleReducedMotion);
    };
  }, [src]);

  return shouldLoad ? <HeroVideoPlayer src={src} /> : null;
}
