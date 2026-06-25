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
        priority={index === 0}
        width={desktopUrl ? 718 : 328}
        height={desktopUrl ? 700 : 400}
        quality={90}
        className="size-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.02]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/2 bg-gradient-to-t from-black to-transparent"
      />

      <div className="absolute bottom-60 left-40 right-40 z-10 max-w-[418px] md:right-auto">
        <div className="flex flex-col gap-6 motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out md:group-hover:-translate-y-12 md:group-focus-visible:-translate-y-12">
          <div className="flex flex-col gap-3 text-white">
            <h3 className="font-larken text-2xl font-light leading-110 md:text-[32px]">
              {card.title}
            </h3>
            {description ? (
              <p className="font-gill text-base font-light leading-110 md:text-xl">
                {description}
              </p>
            ) : null}
          </div>

          <span className="inline-flex w-fit items-center justify-center border-b-[1.5px] border-white pb-1.5 font-gill text-sm font-normal uppercase tracking-[0.28px] text-white md:max-h-0 md:overflow-hidden md:opacity-0 md:transition-all md:duration-500 md:ease-out md:group-hover:max-h-12 md:group-hover:opacity-100 md:group-focus-visible:max-h-12 md:group-focus-visible:opacity-100">
            {ctaLabel}
          </span>
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
        className="flex w-full flex-col items-center gap-8 bg-white py-16 md:gap-10 md:py-100"
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
      className="flex w-full flex-col items-center gap-8 bg-white py-16 md:gap-10 md:py-100"
    >
      <ScrollReveal as="h2" delayMs={0} className="max-w-[332px] px-4 text-center font-larken text-[32px] font-light leading-110 text-darkblack md:max-w-none md:text-[48px] lg:whitespace-nowrap">
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

      <ScrollReveal delayMs={160} className="px-4 font-gill text-sm font-light text-[#4D4D4D] md:hidden">
        Swipe to explore more occasions
      </ScrollReveal>
    </section>
  );
};

export default OccasionsTeaserSection;
