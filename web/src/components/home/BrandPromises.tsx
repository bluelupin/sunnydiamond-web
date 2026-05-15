 "use client";

import Link from "next/link";
import { homeContent } from "@/data/content";
import { useFadeIn } from "@/hooks/use-fade-in";
import { getImageSrc } from "@/lib/utils/image";
import promiseHero from "@/assets/promise-hero.jpg";

/**
 * Background video assets live in /public/videos/.
 * Drop optimised files at the paths below — webm preferred, mp4 fallback.
 * The poster image keeps LCP fast while the video lazy-loads.
 */
const PROMISE_VIDEO_WEBM = "/videos/promise-bg.webm";
const PROMISE_VIDEO_MP4 = "/videos/promise-bg.mp4";

const BrandPromises = ({ id }: { id?: string }) => {
  const sectionRef = useFadeIn(0);
  const contentRef = useFadeIn(200);
  const { promise } = homeContent;

  return (
    <section
      id={id}
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative w-full overflow-hidden bg-black h-[650px] md:h-[800px]"
    >
      {/* Background video — autoplay, muted, looped, no controls */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={getImageSrc(promiseHero)}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={PROMISE_VIDEO_WEBM} type="video/webm" />
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
        className="relative z-10 h-full flex flex-col items-center justify-end text-center px-6 pb-12 md:px-10 md:pb-20 lg:pb-24"
      >
        <h2 className="text-h2 text-white mb-5 md:mb-6">
          {promise.title}
        </h2>
        <p className="text-white/80 font-light text-sm md:text-base max-w-md md:max-w-2xl leading-relaxed mb-8 md:mb-10">
          {promise.description}
        </p>
        <Link
          href={promise.cta.to}
          className="mt-10 group relative overflow-hidden inline-flex items-center justify-center border-[0.8px] border-white text-white md:text-base text-sm px-8 md:h-50 h-12 tracking-[1.8%] uppercase font-gill transition-colors duration-500"
        >
          <span className="absolute inset-0 bg-white origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"></span>
          <span className="relative z-10 group-hover:text-black transition-colors duration-500">
            {promise.cta.label}
          </span>
        </Link>
      </div>
    </section>
  );
};

export default BrandPromises;
