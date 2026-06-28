"use client";

import { useMemo, useRef } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { NormalizedAboutTimeline } from "@/services/about/about-page.types";
import { aboutTimelineFigmaSpec } from "../data/content";
import { useAboutTimelineScroll } from "../hooks/useAboutTimelineScroll";
import AboutTimelineContent from "./AboutTimelineContent";
import AboutTimelineNav from "./AboutTimelineNav";
import Reveal from "@/shared/Animation/Reveal";

type AboutTimelineSectionProps = NormalizedAboutTimeline;

const AboutTimelineSection = ({
  backgroundImage,
  milestones,
  years,
  defaultYear,
}: AboutTimelineSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { activeYear, reducedMotion, scrollToYear } = useAboutTimelineScroll(
    sectionRef,
    years,
    defaultYear,
  );

  const milestoneByYear = useMemo(
    () => new Map(milestones.map((milestone) => [milestone.year, milestone])),
    [milestones],
  );

  const activeMilestone = milestoneByYear.get(activeYear);

  return (
    <section ref={sectionRef} aria-label="Company timeline" className="relative">
      <div className="sticky top-0 z-10 h-screen overflow-hidden">
        <div className="absolute inset-0">
          <ResponsiveImage
            desktopSrc={backgroundImage.desktopUrl}
            mobileSrc={backgroundImage.mobileUrl}
            alt={backgroundImage.alt}
            width={backgroundImage.width ?? 1440}
            height={backgroundImage.height ?? 810}
            quality={80}
            sizes="(max-width: 1024px) 100vw, 1440px"
            className="object-cover object-center"
          />
        </div>
        <MediaContentOverlay
          solidOpacity={aboutTimelineFigmaSpec.overlayOpacity}
        />

        <PageContainer className="relative z-10 flex h-full flex-col px-4 lg:block lg:max-w-full lg:px-0 2xl:px-0">
          <div className="flex h-full flex-col md:flex-row lg:justify-between">
            <AboutTimelineNav
              years={years}
              activeYear={activeYear}
              onYearSelect={scrollToYear}
            />

            {activeMilestone ? (
              <div
                aria-live="polite"
                aria-atomic="true"
                className="mb-16 mt-auto lg:mb-100 lg:mt-auto lg:self-end"
              >
                <AboutTimelineContent
                  activeYear={activeYear}
                  milestone={activeMilestone}
                  reducedMotion={reducedMotion}
                />
              </div>
            ) : null}
          </div>
        </PageContainer>
      </div>
      {!reducedMotion
        ? years.map((year) => (
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
