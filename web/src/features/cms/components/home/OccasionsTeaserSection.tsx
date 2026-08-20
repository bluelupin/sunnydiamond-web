"use client";

import { useCallback, useRef } from "react";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import OccasionLedCard from "@/shared/ui/OccasionLedCard";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import { isSectionActive } from "@/shared/utils/cmsSection";
import { buildOccasionCardHref } from "@/features/jewellery-product/utils/occasionListing";
import type { OccasionCard } from "@/types/homepage/occasionSection";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";

interface OccasionsTeaserSectionProps {
  id?: string;
}

function OccasionCardItem({
  card,
  index,
  sectionTitle,
}: {
  card: OccasionCard;
  index: number;
  sectionTitle: string;
}) {
  const { desktopUrl, mobileUrl, alt, desktopAlt, mobileAlt } = resolveResponsiveCmsImage(card.image);
  const href = buildOccasionCardHref({
    title: card.title,
    slug: card.slug,
    filterSlug: card.filterSlug,
    ctaUrl: card?.cta?.url || card?.cta?.to,
  });
  const ctaLabel = card?.cta?.label?.trim() || undefined;
  const description = card?.description?.trim() || card?.subtitle?.trim();

  if (!card.title?.trim()) {
    return null;
  }

  if (!desktopUrl && !mobileUrl) {
    return null;
  }

  if (!href?.trim()) {
    return null;
  }

  return (
    <OccasionLedCard
      title={card.title?.trim() || ""}
      description={description}
      href={href}
      ctaLabel={ctaLabel}
      desktopImageUrl={desktopUrl}
      mobileImageUrl={mobileUrl}
      imageAlt={alt || card?.title?.trim()}
      desktopImageAlt={desktopAlt}
      mobileImageAlt={mobileAlt}
      index={index}
      sectionTitle={sectionTitle}
    />
  );
}

const OccasionsTeaserSection = ({ id }: OccasionsTeaserSectionProps) => {
  const { data: editorialData, isLoading: isEditorialLoading } = useHomepageEditorialBlocks();
  const occasionSection = editorialData?.occasionSection ?? null;
  const sectionTitle = occasionSection?.sectionTitle?.trim() || undefined;

  const occasions = (occasionSection?.occasions ?? []).filter(
    (card) => card?.isActive !== false,
  );

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
        className="flex w-full flex-col items-center gap-8 bg-white px-4 py-16 md:gap-10 md:px-0 md:py-100"
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

  if (!occasions.length) {
    return null;
  }

  const visibleOccasions = occasions.filter((card) => {
    const title = card.title?.trim();
    const { desktopUrl, mobileUrl } = resolveResponsiveCmsImage(card.image);
    const href = buildOccasionCardHref({
      title: card.title,
      slug: card.slug,
      filterSlug: card.filterSlug,
      ctaUrl: card?.cta?.url || card?.cta?.to,
    });

    return Boolean(title && (desktopUrl || mobileUrl) && href?.trim());
  });

  if (!visibleOccasions.length) {
    return null;
  }

  return (
    <section
      id={id}
      aria-label={sectionTitle || "Occasions"}
      className="flex w-full flex-col items-center gap-8 bg-white pt-16 md:gap-10 px-0 md:pt-100"
    >
      {sectionTitle ? (
        <ScrollReveal as="h2" delayMs={0} className="max-w-sm text-center font-larken font-light leading-110 text-darkblack md:max-w-none lg:text-5xl md:text-4xl text-32 lg:whitespace-nowrap">
          {sectionTitle}
        </ScrollReveal>
      ) : null}

      <div
        ref={carouselRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={sectionTitle || "Occasions"}
        tabIndex={-1}
        onKeyDownCapture={handleCarouselKeyDown}
        className="scrollbar-none relative left-1/2 flex w-screen max-w-none -translate-x-1/2 snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 scroll-pr-4 pb-2 md:grid md:grid-cols-2 md:gap-1 md:overflow-visible md:px-0 pl-4 md:pb-0 md:snap-none md:outline-none"
      >
        {visibleOccasions.map((card, index) => (
          <ScrollReveal
            key={String(card.id ?? card.slug ?? card.title ?? index)}
            delayMs={80 + index * 80}
            className="contents"
          >
            <OccasionCardItem
              card={card}
              index={index}
              sectionTitle={sectionTitle || "Occasions"}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default OccasionsTeaserSection;
