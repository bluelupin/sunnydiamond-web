"use client";

import { useEffect, useRef, useState } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import {
  accordionCollapseInnerClassName,
  accordionCollapsePanelClassName,
  accordionCollapseEasingClassName,
} from "@/shared/ui/accordionCollapse";
import { cn } from "@/shared/utils/cn";
import type { NormalizedCareerBenefitsSection } from "@/services/careers/careers.types";

type CareersBenefitsSectionProps = {
  benefits: NormalizedCareerBenefitsSection;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const benefitsMotionClassName = cn(
  "transition-[background-color] duration-500",
  accordionCollapseEasingClassName,
  "motion-reduce:transition-none",
);

const benefitsImageMotionClassName = cn(
  "transition-opacity duration-700",
  accordionCollapseEasingClassName,
  "motion-reduce:transition-none",
);

/** One scroll segment per benefit — aligned with `items.length * 100vh` section height. */
function resolveBenefitIndex(progress: number, itemCount: number): number {
  if (itemCount <= 1) {
    return 0;
  }

  const clampedProgress = clamp(progress);
  return Math.min(itemCount - 1, Math.floor(clampedProgress * itemCount));
}

const CareersBenefitsSection = ({ benefits }: CareersBenefitsSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [stickyTop, setStickyTop] = useState<number>();
  const items = benefits.items;
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeIndexRef = useRef(0);
  const scrollRafRef = useRef<number | null>(null);

  useEffect(() => {
    activeIndexRef.current = Math.max(
      0,
      items.findIndex((item) => item.id === activeId),
    );
  }, [activeId, items]);

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
      scrollRafRef.current = null;

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

      const targetIndex = resolveBenefitIndex(progress, items.length);

      if (activeIndexRef.current !== targetIndex) {
        activeIndexRef.current = targetIndex;
        const nextId = items[targetIndex]?.id;
        if (nextId) {
          setActiveId(nextId);
        }
      }
    };

    const handleScroll = () => {
      if (scrollRafRef.current !== null) {
        return;
      }
      scrollRafRef.current = window.requestAnimationFrame(syncFromScroll);
    };

    syncFromScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, [items, reducedMotion, stickyTop]);

  const scrollTrackStyle =
    !reducedMotion && items.length > 1
      ? { height: `${items.length * 100}vh` }
      : undefined;

  const itemsWithImages = items.filter((item) => item.image);

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
          "flex w-full flex-col gap-8 bg-white md:gap-10 md:py-104",
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
                      "flex w-full text-left",
                      benefitsMotionClassName,
                      isActive
                        ? "flex-col gap-4 bg-gray300 px-4 py-6 md:px-8 lg:px-10 md:py-8"
                        : "flex-col px-4 py-6 md:pl-8 lg:pl-10 md:pr-6 md:py-8",
                    )}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className="font-larken text-xl font-light leading-110 text-darkblack md:text-2xl md:whitespace-nowrap">
                      {item.label}
                    </span>
                    <div
                      className={cn(
                        "w-full",
                        reducedMotion
                          ? isActive
                            ? "flex flex-col gap-4"
                            : "hidden"
                          : accordionCollapsePanelClassName(isActive),
                      )}
                      aria-hidden={!isActive}
                    >
                      <div
                        className={cn(
                          reducedMotion ? undefined : accordionCollapseInnerClassName,
                          "flex flex-col gap-4",
                        )}
                      >
                        <span className="h-px w-full bg-neutral300" aria-hidden />
                        <span className="w-full font-gill text-sm font-light leading-110 text-neutral500 md:max-w-[513px] md:text-xl md:text-darkblack">
                          {item.description}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {itemsWithImages.length > 0 ? (
            <div className="relative aspect-[1025/737] w-full overflow-hidden md:aspect-auto md:min-w-0 md:flex-1 md:self-stretch">
              {itemsWithImages.map((item) => {
                const image = item.image;
                if (!image) {
                  return null;
                }

                const isActive = item.id === activeId;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "absolute inset-0",
                      benefitsImageMotionClassName,
                      isActive ? "z-10 opacity-100" : "z-0 opacity-0",
                    )}
                    aria-hidden={!isActive}
                  >
                    <ResponsiveImage
                      desktopSrc={image.desktopUrl}
                      mobileSrc={image.mobileUrl}
                      alt={isActive ? image.alt : ""}
                      fill
                      sizes="(min-width: 768px) 60vw, 100vw"
                      className="object-cover object-center md:object-top"
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default CareersBenefitsSection;
