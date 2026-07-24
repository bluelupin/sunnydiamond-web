"use client";

import Link from "next/link";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { resolveImageSrcString } from "@/shared/utils/image";
import { getCmsAssetUrl } from "@/shared/utils/cmsAssets";
import { homeContent } from "@/features/cms/data/content";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import { isSectionActive } from "@/shared/utils/cmsSection";
import Reveal from "@/shared/Animation/Reveal";

interface SunnyPromiseSectionProps {
  id?: string;
}

const PROMISE_VIDEO_MP4 = "/videos/handcrafted-bg.mp4";
const PROMISE_POSTER = "/images/about/handcrafted-bg.webp";

const SunnyPromiseSection = ({ id }: SunnyPromiseSectionProps) => {
  const { data: editorialData, isLoading: isEditorialLoading } = useHomepageEditorialBlocks();
  const sunnyPromiseData = editorialData?.sunnyPromiseSection ?? null;
  const fallback = homeContent.promise;

  const sectionTitle = sunnyPromiseData?.sectionTitle?.trim() || "The Sunny Promise";
  const description =
    sunnyPromiseData?.description?.trim() || fallback.description;
  const ctaUrl = sunnyPromiseData?.cta?.url || sunnyPromiseData?.cta?.to || fallback.cta.to;
  const ctaLabel = sunnyPromiseData?.cta?.label?.trim() || fallback.cta.label;
  const posterUrl = getCmsAssetUrl(sunnyPromiseData?.posterImage?.data?.attributes?.url);

  if (!isSectionActive(sunnyPromiseData?.isActive)) return null;

  if (isEditorialLoading) {
    return (
      <section
        id={id}
        className="flex flex-col items-center gap-8 bg-white px-4 py-16 md:gap-10 lg:gap-10 lg:px-10 lg:py-100"
        aria-busy="true"
        aria-label="The Sunny Promise"
      >
        <div className="h-10 w-[min(320px,80%)] rounded bg-gray200" aria-hidden />
        <div className="h-[670px] w-full max-w-[1360px] bg-gray200 md:h-[700px]" aria-hidden />
        <div className="flex flex-col items-center gap-6">
          <div className="h-5 w-[min(384px,90%)] rounded bg-gray200" aria-hidden />
          <div className="h-5 w-36 rounded bg-gray200" aria-hidden />
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      aria-label={sectionTitle}
      className="flex flex-col items-center gap-8 bg-white px-4 py-16 lg:gap-10 lg:px-10 lg:py-100"
    >
      <Reveal as="h2" direction="up" className="text-center font-larken text-32 font-light leading-110 text-darkblack lg:text-5xl lg:whitespace-nowrap">
        {sectionTitle}
      </Reveal>
      <Reveal direction="up" className="relative h-[670px] w-full max-w-[1360px] shrink-0 overflow-hidden md:h-[700px]">
        <video
          className="absolute inset-0 size-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={resolveImageSrcString(posterUrl || PROMISE_POSTER)}
          aria-hidden
          tabIndex={-1}
        >
          <source src={PROMISE_VIDEO_MP4} type="video/mp4" />
        </video>
      </Reveal>

      <div className="flex w-full flex-col items-center gap-6 lg:gap-6">
        <Reveal direction="up" className="max-w-[384px] text-center font-gill text-base font-light leading-110 text-neutral500 md:text-xl">
          {description}
        </Reveal>
        {ctaUrl &&
          <Reveal direction="up">
            <Link href={ctaUrl} className="relative after:bg-darkMagenta after:absolute after:h-0.5 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer border-b-[1.5px] border-darkblack hover:border-darkMagenta sm:pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack hover:text-darkMagenta">
              {ctaLabel}
            </Link>
          </Reveal>
        }
      </div>
    </section>
  );
};

export default SunnyPromiseSection;
