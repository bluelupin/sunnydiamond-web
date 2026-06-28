"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import ScrollReveal from "@/shared/ui/ScrollReveal";
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
      className="group relative block h-[400px] w-[min(328px,85vw)] shrink-0 snap-start overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2 md:h-[700px] md:w-full md:min-w-0 md:shrink"
    >
      <ResponsiveImage
        desktopSrc={desktopUrl || fallBackImage}
        mobileSrc={mobileUrl || desktopUrl || fallBackImage}
        alt={imageAlt}
        width={desktopUrl ? 718 : 328}
        height={desktopUrl ? 700 : 400}
        quality={80}
        className="size-full object-cover"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] from-0% to-[rgba(0,0,0,0)] to-[53.563%]"
      />

      {/* Mobile — title, description, and CTA always visible */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-60 md:hidden">
        <div className="flex max-w-[296px] flex-col gap-4">
          <div className="flex flex-col gap-2 text-white">
            <h3 className="font-larken text-2xl font-light leading-110">
              {card.title}
            </h3>
            {description ? (
              <p className="font-gill text-base font-light leading-110">
                {description}
              </p>
            ) : null}
          </div>

          <span className="text-link-underline inline-flex w-fit items-center justify-center border-b-[1.5px] border-white pb-1.5 font-gill text-sm font-normal uppercase tracking-[0.28px] text-white">
            {ctaLabel}
          </span>
        </div>
      </div>

      {/* Desktop — same hover reveal as CollectionHeroPanel */}
      <div className="absolute bottom-40 left-40 z-10 hidden max-w-[418px] flex-col-reverse items-start text-white md:flex">
        <span className="inline-flex max-h-0 w-fit flex-col items-start overflow-hidden pb-0 pt-0 opacity-0 motion-safe:transition-[max-height,padding,opacity] motion-safe:duration-500 motion-safe:ease-out group-hover:max-h-[72px] group-hover:pt-40 group-hover:opacity-100 group-focus-visible:max-h-[72px] group-focus-visible:pt-40 group-focus-visible:opacity-100">
          <span className="text-link-underline inline-flex w-fit items-center border-b-[1.5px] border-white pb-1 font-gill text-sm font-normal uppercase leading-110 text-white">
            {ctaLabel}
          </span>
        </span>

        <div className="flex w-full max-w-[418px] flex-col items-start gap-3 md:gap-4 lg:gap-5">
          <h3 className="font-larken text-32 font-light leading-none md:text-4xl lg:text-5xl">
            {card.title}
          </h3>
          {description ? (
            <p className="font-gill text-base font-light leading-[120%] tracking-[1%] md:text-lg lg:text-xl">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

const OccasionsTeaserSection = ({ id }: OccasionsTeaserSectionProps) => {
  const { data: editorialData, isLoading: isEditorialLoading } = useHomepageEditorialBlocks();
  const occasionSection = editorialData?.occasionSection ?? null;
  const sectionTitle =
    occasionSection?.sectionTitle?.trim() || "Timeless Pieces for Every Occasion";

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
        className="flex w-full flex-col items-center gap-8 bg-white px-4 py-16 md:gap-40 md:px-0 md:py-100"
        aria-busy="true"
        aria-label="Occasions"
      >
        <div className="h-10 w-80 rounded bg-gray200 px-4" aria-hidden />
        <div className="relative left-1/2 grid w-screen max-w-none -translate-x-1/2 grid-cols-2 gap-1 overflow-hidden md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[328/400] bg-gray200 md:aspect-auto md:h-[700px]" aria-hidden />
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
      aria-label={sectionTitle}
      className="flex w-full flex-col items-center gap-8 bg-white px-4 py-16 md:gap-40 md:px-0 md:py-100"
    >
      <ScrollReveal as="h2" delayMs={0} className="max-w-sm text-center font-larken text-32 font-light leading-110 text-darkblack md:max-w-none md:text-5xl lg:whitespace-nowrap">
        {sectionTitle}
      </ScrollReveal>

      <div
        ref={carouselRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={sectionTitle}
        tabIndex={-1}
        onKeyDownCapture={handleCarouselKeyDown}
        className="scrollbar-none relative left-1/2 flex w-screen max-w-none -translate-x-1/2 snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 scroll-pr-4 px-4 pb-2 md:grid md:grid-cols-2 md:gap-1 md:overflow-visible md:px-0 md:pb-0 md:snap-none md:outline-none"
      >
        {occasions.map((card, index) => (
          <ScrollReveal
            key={String(card.id ?? card.slug ?? card.title ?? index)}
            delayMs={80 + index * 80}
            className="contents"
          >
            <OccasionCardItem
              card={card}
              index={index}
              sectionTitle={sectionTitle}
            />
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delayMs={160} className="px-4 font-gill text-sm font-light text-neutral500 md:hidden">
        Swipe to explore more occasions
      </ScrollReveal>
    </section>
  );
};

export default OccasionsTeaserSection;
