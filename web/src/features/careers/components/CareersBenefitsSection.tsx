"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";
import type { NormalizedCareerBenefitsSection } from "@/services/careers/careers.types";

type CareersBenefitsSectionProps = {
  benefits: NormalizedCareerBenefitsSection;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const CareersBenefitsSection = ({ benefits }: CareersBenefitsSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [stickyTop, setStickyTop] = useState<number>();
  const items = benefits.items;
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [reducedMotion, setReducedMotion] = useState(false);

  const activeItem = useMemo(
    () => items.find((item) => item.id === activeId) ?? items[0],
    [activeId, items],
  );
  const activeImage = activeItem?.image ?? null;

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const headerOffset = window.innerWidth >= 768 ? 104 : 64;
        setStickyTop(Math.min(headerOffset, window.innerHeight - panel.offsetHeight));
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || items.length <= 1) {
      return;
    }

    const syncFromScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const panelHeight = panelRef.current?.offsetHeight ?? viewportHeight;
      const top = stickyTop ?? (window.innerWidth >= 768 ? 104 : 64);
      const scrollTrack = section.offsetHeight - panelHeight;
      const progress =
        scrollTrack <= 0
          ? rect.top <= viewportHeight * 0.5
            ? 1
            : 0
          : clamp((top - rect.top) / scrollTrack);
      const nextIndex = Math.min(
        items.length - 1,
        Math.max(0, Math.floor(progress * items.length)),
      );
      const nextId = items[nextIndex]?.id;
      if (nextId) {
        setActiveId((current) => (current === nextId ? current : nextId));
      }
    };

    syncFromScroll();
    window.addEventListener("scroll", syncFromScroll, { passive: true });
    window.addEventListener("resize", syncFromScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", syncFromScroll);
      window.removeEventListener("resize", syncFromScroll);
    };
  }, [items, reducedMotion, stickyTop]);

  const scrollTrackStyle =
    !reducedMotion && items.length > 1
      ? { height: `${items.length * 100}vh` }
      : undefined;

  return (
    <section
      ref={sectionRef}
      id="employee-benefits"
      aria-labelledby="careers-benefits-title"
      className="bg-white md:mb-0 mb-16"
      style={scrollTrackStyle}
    >
      <div
        ref={panelRef}
        style={{ top: stickyTop }}
        className={cn(
          "flex w-full flex-col gap-8 bg-white md:gap-10 md:py-16 md:py-104",
          !reducedMotion &&
            items.length > 1 &&
            "sticky top-16 min-h-[calc(100vh-4rem)] md:top-[104px] md:min-h-[calc(100vh-104px)] md:justify-center",
        )}
      >
        <h2
          id="careers-benefits-title"
          className="2xl:px-[60px] lg:px-10 md:px-8 px-4 w-full font-larken text-32 font-light leading-110 text-darkblack md:text-5xl"
        >
          <span className="whitespace-normal md:whitespace-pre-line">
            {benefits.title.replace(/\s+(Your Best Work)\s*$/i, "\n$1")}
          </span>
        </h2>
        <div className="flex w-full flex-col md:min-h-[346px] md:flex-row lg:gap-6 md:gap-4 gap-4 md:px-0 px-4">
          <div className="flex w-full flex-col xl:w-[593px] lg:w-[493px] md:w-[393px] md:shrink-0 md:self-stretch md:border-r md:border-r-[0.5px] md:border-neutral300">
            {items.map((item) => {
              const isActive = item.id === activeId;

              return (
                <div key={item.id} className="w-full">
                  <div
                    className={cn(
                      "flex w-full text-left transition-colors",
                      isActive
                        ? "flex-col gap-4 bg-gray300 px-4 py-6 md:px-8 lg:px-10 md:py-8"
                        : "flex-row items-center px-4 md:py-6 py-4 md:pl-8 lg:pl-10 md:pr-6 md:py-8",
                    )}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className="font-larken text-xl font-light leading-110 text-darkblack md:text-2xl">
                      {item.label}
                    </span>
                    {isActive ? (
                      <>
                        <span className="h-px w-full bg-neutral300" aria-hidden />
                        <span className="w-full font-gill text-sm font-light leading-110 text-neutral500 md:max-w-[513px] md:text-xl md:text-darkblack">
                          {item.description}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
          {activeImage ? (
            <div
              className="relative aspect-[1025/737] w-full overflow-hidden md:aspect-auto md:min-w-0 md:flex-1 md:self-stretch"
            >
              <ResponsiveImage
                key={activeImage.desktopUrl}
                desktopSrc={activeImage.desktopUrl}
                mobileSrc={activeImage.mobileUrl}
                alt={activeImage.alt}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover object-center md:object-top"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default CareersBenefitsSection;
