"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type ProductDetailHeroBannerProps = {
  imageSrc: string;
  videoSrc?: string;
  alt?: string;
};

function resolveVideoMimeType(videoSrc: string): string {
  const normalized = videoSrc.split("?")[0]?.toLowerCase() ?? "";

  if (normalized.endsWith(".webm")) {
    return "video/webm";
  }

  if (normalized.endsWith(".mov")) {
    return "video/quicktime";
  }

  return "video/mp4";
}

function resolveCompanionWebmSrc(videoSrc: string): string | undefined {
  if (!videoSrc.startsWith("/") || !videoSrc.endsWith(".mp4")) {
    return undefined;
  }

  return videoSrc.replace(/\.mp4$/, ".webm");
}

const ProductDetailHeroBanner = ({
  imageSrc,
  videoSrc,
  alt = "Sunny Diamonds lifestyle",
}: ProductDetailHeroBannerProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const handleVideoError = useCallback(() => {
    setVideoFailed(true);
  }, []);

  useEffect(() => {
    setVideoFailed(false);
    setShouldLoadVideo(false);

    if (!videoSrc) {
      return;
    }

    const node = sectionRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [videoSrc]);

  const handleVideoCanPlay = useCallback((event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    video.muted = true;
    void video.play().catch(() => {
      // Autoplay can be blocked transiently; keep the loaded video in place.
    });
  }, []);

  const showVideo = Boolean(videoSrc && shouldLoadVideo && !videoFailed);
  const videoWebmSrc = videoSrc ? resolveCompanionWebmSrc(videoSrc) : undefined;
  const videoMimeType = videoSrc ? resolveVideoMimeType(videoSrc) : "video/mp4";

  return (
    <section
      ref={sectionRef}
      aria-label="Lifestyle showcase"
      className="grid h-361 w-full overflow-hidden md:h-600 lg:h-804 [&>*]:col-start-1 [&>*]:row-start-1"
    >
        <Image
          src={imageSrc}
          alt={alt}
          width={1440}
          height={800}
          priority={false}
          className="h-full w-full object-cover object-top"
          sizes="100vw"
        />

        {showVideo ? (
          <video
            key={videoSrc}
            className="h-full w-full object-cover object-top"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={imageSrc}
            aria-hidden
            tabIndex={-1}
            onCanPlay={handleVideoCanPlay}
            onError={handleVideoError}
          >
            {videoWebmSrc ? <source src={videoWebmSrc} type="video/webm" /> : null}
            <source src={videoSrc} type={videoMimeType} />
          </video>
        ) : null}
    </section>
  );
};

export default ProductDetailHeroBanner;
