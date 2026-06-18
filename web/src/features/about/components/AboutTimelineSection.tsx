"use client";

import { useRef } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import {
  aboutPageImages,
  aboutTimelineContent,
  aboutTimelineYears,
} from "../data/content";
import { useAboutTimelineScroll } from "../hooks/useAboutTimelineScroll";
import AboutTimelineContent from "./AboutTimelineContent";
import AboutTimelineNav from "./AboutTimelineNav";

const AboutTimelineSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { activeYear, progress, reducedMotion, scrollToYear } =
    useAboutTimelineScroll(sectionRef);

  const milestone =
    aboutTimelineContent.milestones[
      activeYear as keyof typeof aboutTimelineContent.milestones
    ];

  return (
    <section ref={sectionRef} aria-label="Company timeline" className="relative">
      <div className="sticky top-0 z-10 h-[520px] overflow-hidden sm:h-[620px] lg:h-[700px]">
        <div className="absolute inset-0">
          <ResponsiveImage
            desktopSrc={aboutPageImages.store}
            alt="Sunny Diamonds store in Chalakkudy"
            width={1440}
            height={810}
            quality={90}
            sizes="100vw"
            className="h-[116%] -translate-y-[86px] object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-black/40" aria-hidden />

        <PageContainer className="relative flex h-full flex-col justify-between py-10 md:py-14 lg:flex-row lg:items-end lg:justify-between lg:pb-[51px] lg:pt-0">
          <AboutTimelineNav
            activeYear={activeYear}
            progress={progress}
            onYearSelect={scrollToYear}
          />

          {milestone ? (
            <div aria-live="polite" aria-atomic="true" className="lg:pb-0">
              <AboutTimelineContent
                activeYear={activeYear}
                milestone={milestone}
                reducedMotion={reducedMotion}
              />
            </div>
          ) : null}
        </PageContainer>
      </div>

      {!reducedMotion
        ? aboutTimelineYears.map((year) => (
            <div
              key={year}
              data-timeline-step={year}
              className="h-[80svh] lg:h-[700px]"
              aria-hidden
            />
          ))
        : null}
    </section>
  );
};

export default AboutTimelineSection;
