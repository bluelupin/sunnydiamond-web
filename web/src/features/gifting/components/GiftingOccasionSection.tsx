"use client";

import { useCallback, useRef } from "react";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import OccasionLedCard from "@/shared/ui/OccasionLedCard";
import { giftingPageContent } from "../data/content";

const GiftingOccasionSection = () => {
  const { cards, viewCollectionLabel } = giftingPageContent.occasions;
  const sectionTitle = "Timeless Pieces for Every Occasion";

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

  return (
    <section
      id="occasion-led-gifts"
      aria-label={sectionTitle}
      className="flex w-full flex-col items-center gap-8 bg-white px-0 pt-16 md:gap-10 md:pt-100"
    >
      <ScrollReveal
        as="h2"
        delayMs={0}
        className="max-w-sm text-center font-larken text-32 font-light leading-110 text-darkblack md:max-w-none md:text-4xl lg:text-5xl lg:whitespace-nowrap"
      >
        {sectionTitle}
      </ScrollReveal>

      <div
        ref={carouselRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={sectionTitle}
        tabIndex={-1}
        onKeyDownCapture={handleCarouselKeyDown}
        className="scrollbar-none relative left-1/2 flex w-screen max-w-none -translate-x-1/2 snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 scroll-pr-4 pb-2 pl-4 md:grid md:grid-cols-2 md:gap-1 md:overflow-visible md:px-0 md:pb-0 md:snap-none md:outline-none"
      >
        {cards.map((card, index) => (
          <ScrollReveal
            key={card.id}
            delayMs={80 + index * 80}
            className="contents"
          >
            <OccasionLedCard
              title={card.title}
              description={card.description}
              href={card.href}
              ctaLabel={viewCollectionLabel}
              desktopImageUrl={card.image.desktopUrl}
              mobileImageUrl={card.image.mobileUrl}
              imageAlt={card.image.alt}
              index={index}
              sectionTitle={sectionTitle}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default GiftingOccasionSection;
