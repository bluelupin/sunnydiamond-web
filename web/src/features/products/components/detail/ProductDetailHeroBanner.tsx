"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type ProductDetailHeroBannerProps = {
  imageSrc: string;
  videoSrc?: string;
  alt?: string;
};

const ProductDetailHeroBanner = ({
  imageSrc,
  videoSrc,
  alt = "Sunny Diamonds lifestyle",
}: ProductDetailHeroBannerProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [usePosterOnly, setUsePosterOnly] = useState(!videoSrc);

  const showPosterOnly = useCallback(() => {
    setUsePosterOnly(true);
  }, []);

  useEffect(() => {
    if (!videoSrc || usePosterOnly) return;

    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [usePosterOnly, videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    video.load();
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(showPosterOnly);
    }
  }, [shouldLoadVideo, showPosterOnly]);

  const showVideo = Boolean(videoSrc && shouldLoadVideo && !usePosterOnly);
  const videoWebmSrc = videoSrc?.endsWith(".mp4")
    ? videoSrc.replace(/\.mp4$/, ".webm")
    : undefined;

  return (
    <section
      ref={sectionRef}
      aria-label="Lifestyle showcase"
      className="grid h-361 w-full overflow-hidden lg:h-804 [&>*]:col-start-1 [&>*]:row-start-1"
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
          ref={videoRef}
          className="h-full w-full object-cover object-top"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={imageSrc}
          aria-hidden
          tabIndex={-1}
          onError={showPosterOnly}
        >
          {videoWebmSrc ? <source src={videoWebmSrc} type="video/webm" /> : null}
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : null}
    </section>
  );
};

export default ProductDetailHeroBanner;
