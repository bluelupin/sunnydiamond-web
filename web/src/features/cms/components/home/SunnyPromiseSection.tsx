"use client";

import Link from "next/link";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { getImageSrc } from "@/shared/utils/image";
import { getCmsAssetUrl } from "@/shared/utils/cmsAssets";
import fallBackImage from "@/assets/fallBackImage.png";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";

interface SunnyPromiseSectionProps {
  id?: string;
}

const PROMISE_VIDEO_MP4 = "/videos/promise-bg.mp4";

const SunnyPromiseSection = ({ id }: SunnyPromiseSectionProps) => {
  const sectionRef = useFadeIn(0);
  const contentRef = useFadeIn(200);

  const { data: editorialData, isLoading: isEditorialLoading } = useHomepageEditorialBlocks();
  const sunnyPromiseData = editorialData?.sunnyPromiseSection ?? null;
  const sectionTitle = sunnyPromiseData?.sectionTitle?.trim();
  const description = sunnyPromiseData?.description?.trim();
  const ctaUrl = sunnyPromiseData?.cta?.url ?? "";
  const ctaLabel = sunnyPromiseData?.cta?.label ?? "";
  const posterUrl = getCmsAssetUrl(sunnyPromiseData?.posterImage?.data?.attributes?.url);
  const isActive = sunnyPromiseData?.isActive === true;

  if (isEditorialLoading) {
    return (
      <section
        id={id}
        ref={sectionRef as React.RefObject<HTMLElement>}
        className="relative w-full overflow-hidden bg-black h-650 md:h-804 lg:py-14 md:py-12 py-10"
        aria-busy="true"
      >
        <div aria-hidden className="absolute inset-0 bg-black/60" />
        <div
          ref={contentRef as React.RefObject<HTMLDivElement>}
          className="relative z-10 h-full flex flex-col items-center justify-end text-center px-6 md:px-10"
        >
          <div className="h-10 w-80 bg-white/15 rounded" aria-hidden />
          <div className="md:mt-5 mt-3 h-5 w-[min(520px,90%)] bg-white/15 rounded" aria-hidden />
          <div className="md:mt-10 mt-6 h-12 w-44 bg-white/15 rounded" aria-hidden />
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative w-full overflow-hidden bg-black h-650 md:h-804 lg:py-14 md:py-12 py-10"
    >
      {/* Background video — autoplay, muted, looped, no controls */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        // poster={getImageSrc(posterUrl)}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={PROMISE_VIDEO_MP4} type="video/mp4" />
      </video>

      {/* Dark gradient overlay for text legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80 md:from-black/20 md:via-black/30 md:to-black/70"
      />

      {/* Content — vertically aligned to the bottom with responsive padding */}
      <div
        ref={contentRef as React.RefObject<HTMLDivElement>}
        className="relative z-10 h-full flex flex-col items-center justify-end text-center px-6 md:px-10"
      >
        <h2 className="lg:text-5xl md:text-4xl text-32 text-gray200 font-normal font-larken tracking-[0%] leading-[100%] text-center">
          {sectionTitle}
        </h2>
        <p className="md:mt-5 mt-3 text-base md:text-lg lg:text-xl text-gray200 tracking-[1%] leading-[100%] font-light font-gill">
          {description}
        </p>
        <Link
          href={ctaUrl}
          className="md:mt-10 mt-6 group relative overflow-hidden inline-flex items-center justify-center border-[0.8px] border-white text-white md:text-base text-sm px-8 md:h-50 h-12 md:tracking-[1.8%] tracking-[4%] uppercase font-gill transition-colors duration-500"
        >
          <span className="absolute inset-0 bg-white origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"></span>
          <span className="relative z-10 group-hover:text-black transition-colors duration-500">
            {ctaLabel}
          </span>
        </Link>
      </div>
    </section>
  );
};

export default SunnyPromiseSection;
