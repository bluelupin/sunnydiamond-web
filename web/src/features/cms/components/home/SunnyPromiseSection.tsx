"use client";

import Link from "next/link";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { getImageSrc } from "@/shared/utils/image";
import { getCmsAssetUrl } from "@/shared/utils/cmsAssets";
import { homeContent } from "@/features/cms/data/content";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import { isSectionActive } from "@/shared/utils/cmsSection";

interface SunnyPromiseSectionProps {
  id?: string;
}

const PROMISE_VIDEO_MP4 = "/videos/handcrafted-bg.mp4";
const PROMISE_POSTER = "/images/about/handcrafted-bg.png";

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
        className="flex flex-col items-center gap-8 bg-white px-4 py-16 md:gap-10 lg:gap-40 lg:px-40 lg:py-100"
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
      className="flex flex-col items-center gap-8 bg-white px-4 py-16 md:gap-10 lg:gap-40 lg:px-40 lg:py-100"
    >
      <ScrollReveal as="h2" delayMs={0} className="text-center font-larken text-[32px] font-light leading-110 text-darkblack lg:text-[48px] lg:whitespace-nowrap">
        {sectionTitle}
      </ScrollReveal>

      <ScrollReveal delayMs={100} className="relative h-[670px] w-full max-w-[1360px] shrink-0 overflow-hidden md:h-[700px]">
        <video
          className="absolute inset-0 size-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={getImageSrc(posterUrl || PROMISE_POSTER)}
          aria-hidden
          tabIndex={-1}
        >
          <source src={PROMISE_VIDEO_MP4} type="video/mp4" />
        </video>
      </ScrollReveal>

      <div className="flex w-full flex-col items-center gap-6 lg:gap-6">
        <ScrollReveal delayMs={180} className="max-w-[384px] text-center font-gill text-base font-light leading-110 text-[#4D4D4D] md:text-xl">
          {description}
        </ScrollReveal>

        {ctaUrl ? (
          <ScrollReveal delayMs={260}>
            <Link
              href={ctaUrl}
              className="inline-flex items-center justify-center border-b-[1.5px] border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
            >
              {ctaLabel}
            </Link>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
};

export default SunnyPromiseSection;
