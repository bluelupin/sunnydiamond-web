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
  const { activeYear, reducedMotion, scrollToYear } = useAboutTimelineScroll(sectionRef);

  const milestone =
    aboutTimelineContent.milestones[
    activeYear as keyof typeof aboutTimelineContent.milestones
    ];

  return (
    <section ref={sectionRef} aria-label="Company timeline" className="relative">
      <div className="sticky md:top-20 top-16 z-10 md:h-[calc(100vh-80px)] h-[calc(100vh-64px)] overflow-hidden">
        <div className="absolute inset-0">
          <ResponsiveImage
            desktopSrc={aboutPageImages.store}
            alt="Sunny Diamonds store in Chalakkudy"
            width={1440}
            height={810}
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-black/40" aria-hidden />

        <PageContainer className="relative flex h-full flex-col lg:block lg:px-0 lg:max-w-full px-4">
          <div className="flex h-full flex-col lg:flex-row lg:justify-between">
            <AboutTimelineNav activeYear={activeYear} onYearSelect={scrollToYear} />

            {milestone ? (
              <div
                aria-live="polite"
                aria-atomic="true"
                className="mt-auto lg:mb-104 mb-16 lg:mt-auto lg:self-end"
              >
                <AboutTimelineContent
                  activeYear={activeYear}
                  milestone={milestone}
                  reducedMotion={reducedMotion}
                />
              </div>
            ) : null}
          </div>
        </PageContainer>
      </div>

      {!reducedMotion
        ? aboutTimelineYears.map((year) => (
          <div
            key={year}
            data-timeline-step={year}
            className="h-screen"
            aria-hidden
          />
        ))
        : null}
    </section>
  );
};

export default AboutTimelineSection;
