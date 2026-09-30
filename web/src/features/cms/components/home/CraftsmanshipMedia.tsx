"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { useMutedVideoPlayback } from "@/shared/hooks/useMutedVideoPlayback";

const mobileQuery = "(max-width: 767px)";
const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const queries = [window.matchMedia(mobileQuery), window.matchMedia(motionQuery)];
  queries.forEach((query) => query.addEventListener("change", callback));
  return () => queries.forEach((query) => query.removeEventListener("change", callback));
}

export function useCraftsmanshipMobile() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(mobileQuery).matches, () => false);
}

export default function CraftsmanshipMedia({ src, mobileSrc, alt, mobileAlt, isVideo, mobileIsVideo, background = false }: {
  src: string;
  mobileSrc: string;
  alt: string;
  mobileAlt: string;
  isVideo: boolean;
  mobileIsVideo: boolean;
  background?: boolean;
}) {
  const mobile = useCraftsmanshipMobile();
  const reducedMotion = useSyncExternalStore(subscribe, () => window.matchMedia(motionQuery).matches, () => true);
  const url = mobile ? mobileSrc : src;
  const video = mobile ? mobileIsVideo : isVideo;
  const label = mobile ? mobileAlt : alt;
  const videoRef = useMutedVideoPlayback(video && !reducedMotion);

  return video ? (
    <video
      key={url}
      ref={videoRef}
      src={url}
      aria-label={label || "Diamond 4Cs video"}
      className={background ? "absolute inset-0 h-full w-full origin-right scale-110 object-cover object-right lg:scale-100 lg:object-center" : "h-full w-full object-contain"}
      autoPlay={!reducedMotion}
      muted
      loop
      playsInline
      controls={!background}
      preload="metadata"
    />
  ) : (
    <Image src={url} alt={label} width={550} height={400} sizes="(min-width: 1024px) 550px, 72vw" className="h-full w-full object-cover" />
  );
}
