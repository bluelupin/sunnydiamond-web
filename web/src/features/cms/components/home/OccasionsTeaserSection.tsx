"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import fallBackImage from "@/assets/fallBackImage.png";
import { isSectionActive } from "@/shared/utils/cmsSection";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";
import type { OccasionCard } from "@/types/homepage/occasionSection";

interface OccasionsTeaserSectionProps {
  id?: string;
}

const DEFAULT_CTA_LABEL = "View Collection";

function OccasionCardItem({
  card,
  index,
  sectionTitle,
}: {
  card: OccasionCard;
  index: number;
  sectionTitle: string;
}) {
  const { desktopUrl, mobileUrl, alt } = resolveResponsiveCmsImage(card.image);
  const href =
    card?.cta?.url ||
    card?.cta?.to ||
    (card?.slug ? `/products?occasion=${card.slug}` : "/products");
  const ctaLabel = card?.cta?.label?.trim() || DEFAULT_CTA_LABEL;
  const description = card?.description?.trim() || card?.subtitle?.trim();
  const imageAlt = alt || card?.title?.trim() || `${sectionTitle} — occasion ${index + 1}`;

  return (
    <Link
      href={href}
      className="group relative block h-[400px] w-[min(328px,85vw)] shrink-0 snap-start overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2 md:h-[700px] md:w-auto"
    >
      <ResponsiveImage
        desktopSrc={desktopUrl || fallBackImage}
        mobileSrc={mobileUrl || desktopUrl || fallBackImage}
        alt={imageAlt}
        priority={index === 0}
        width={desktopUrl ? 718 : 328}
        height={desktopUrl ? 700 : 400}
        quality={90}
        className="size-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.02]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[199px] bg-gradient-to-b from-transparent via-[rgba(0,0,0,0.69)] to-black backdrop-blur-[5px] md:h-[342px] md:from-transparent md:via-transparent md:to-black"
      />

      <div className="absolute bottom-8 left-4 flex w-[calc(100%-32px)] max-w-[296px] flex-col gap-4 md:bottom-16 md:left-10 md:w-[418px] md:max-w-none md:gap-6">
        <div className="flex flex-col gap-2 text-white md:gap-3">
          <h3 className="font-larken text-2xl font-light leading-[110%] md:text-[32px]">
            {card.title}
          </h3>
          {description ? (
            <p className="font-gill text-base font-light leading-[110%] md:text-[20px]">
              {description}
            </p>
          ) : null}
        </div>

        <span className="inline-flex w-fit items-center justify-center border-b-[1.5px] border-white pb-1.5 font-gill text-sm font-normal uppercase tracking-[0.28px] text-white">
          {ctaLabel}
        </span>
      </div>
    </Link>
  );
}

const OccasionsTeaserSection = ({ id }: OccasionsTeaserSectionProps) => {
  const { data: editorialData, isLoading: isEditorialLoading } = useHomepageEditorialBlocks();
  const occasionSection = editorialData?.occasionSection ?? null;
  const sectionTitle =
    occasionSection?.sectionTitle?.trim() || "Timeless Pieces for Every Occasion";

  const headingRef = useFadeIn(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = useCallback((direction: -1 | 1) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("a");
    const scrollAmount = card ? card.offsetWidth + 12 : 340;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: direction * scrollAmount,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, []);

  const handleCarouselKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollCarousel(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollCarousel(-1);
    }
  };

  if (!isSectionActive(occasionSection?.isActive)) {
    return null;
  }

  if (isEditorialLoading) {
    return (
      <section
        id={id}
        className="flex flex-col items-center gap-8 bg-white px-4 py-16 md:gap-10 md:px-0 md:py-[104px]"
        aria-busy="true"
        aria-label="Occasions"
      >
        <div className="h-10 w-80 rounded bg-gray200" aria-hidden />
        <div className="flex w-full gap-3 overflow-hidden md:grid md:max-w-[1440px] md:grid-cols-2 md:gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[400px] w-[min(328px,85vw)] shrink-0 bg-gray200 md:h-[700px] md:w-auto"
              aria-hidden
            />
          ))}
        </div>
      </section>
    );
  }

  const occasions = (occasionSection?.occasions ?? []).filter(
    (card) => card?.isActive !== false,
  );

  if (!occasions.length) {
    return null;
  }

  return (
    <section
      id={id}
      ref={headingRef as React.RefObject<HTMLElement>}
      aria-label={sectionTitle}
      className="flex flex-col items-center gap-8 bg-white px-4 py-16 md:gap-10 md:px-0 md:py-[104px]"
    >
      <h2 className="max-w-[332px] text-center font-larken text-[32px] font-light leading-[110%] text-[#0a0a0a] md:max-w-none md:text-[48px] lg:whitespace-nowrap">
        {sectionTitle}
      </h2>

      <div
        ref={carouselRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={sectionTitle}
        tabIndex={-1}
        onKeyDownCapture={handleCarouselKeyDown}
        className="scrollbar-none -mx-4 flex w-[calc(100%+32px)] snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 scroll-pr-4 px-4 pb-2 md:mx-0 md:grid md:w-full md:max-w-[1440px] md:grid-cols-2 md:gap-1 md:overflow-visible md:px-0 md:pb-0 md:snap-none md:outline-none"
      >
        {occasions.map((card, index) => (
          <OccasionCardItem
            key={String(card.id ?? card.slug ?? card.title ?? index)}
            card={card}
            index={index}
            sectionTitle={sectionTitle}
          />
        ))}
      </div>

      <p className="font-gill text-sm font-light text-[#4D4D4D] md:hidden">
        Swipe to explore more occasions
      </p>
    </section>
  );
};

export default OccasionsTeaserSection;
