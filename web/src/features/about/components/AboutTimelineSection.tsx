"use client";

import { useState } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import DiamondIcon from "@/assets/Icons/Diamond";
import {
  aboutPageImages,
  aboutTimelineContent,
  aboutTimelineYears,
} from "../data/content";

type TimelineYear = (typeof aboutTimelineYears)[number];

const AboutTimelineSection = () => {
  const [activeYear, setActiveYear] = useState<TimelineYear>(
    aboutTimelineContent.defaultYear as TimelineYear,
  );
  const milestone =
    aboutTimelineContent.milestones[
      activeYear as keyof typeof aboutTimelineContent.milestones
    ];

  return (
    <section
      aria-labelledby="about-timeline-title"
      className="relative h-[520px] sm:h-[620px] lg:h-[700px] overflow-hidden"
    >
      <ResponsiveImage
        desktopSrc={aboutPageImages.store}
        alt="Sunny Diamonds store in Chalakkudy"
        width={1440}
        height={810}
        quality={90}
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden />

      <div className="absolute inset-0 container flex flex-col lg:flex-row lg:items-center lg:justify-between py-10 md:py-14 lg:py-[148px]">
        <nav aria-label="Company timeline" className="flex flex-col gap-6 lg:gap-8">
          {aboutTimelineYears.map((year) => {
            const isActive = year === activeYear;
            return (
              <button
                key={year}
                type="button"
                onClick={() => setActiveYear(year)}
                className="group flex items-center justify-end gap-2 text-left"
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={`h-px w-12 lg:w-16 transition-colors ${
                    isActive ? "bg-white" : "bg-gray200"
                  }`}
                  aria-hidden
                />
                <span
                  className={`font-gill text-base md:text-lg lg:text-xl leading-[110%] transition-colors ${
                    isActive
                      ? "text-white font-normal"
                      : "text-gray200 font-light group-hover:text-white/80"
                  }`}
                >
                  {year}
                </span>
              </button>
            );
          })}
        </nav>

        {milestone ? (
          <article className="mt-10 lg:mt-0 max-w-[445px] bg-white/95 lg:bg-white p-6 md:p-8 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <DiamondIcon className="w-[18px] h-[18px] text-darkblack" />
              <p className="font-gill text-base text-gray500 leading-[110%]">{activeYear}</p>
            </div>
            <h2
              id="about-timeline-title"
              className="font-larken font-light text-[28px] md:text-[32px] leading-[110%] text-gray500"
            >
              {milestone.title}
            </h2>
            <p className="font-gill font-light text-base md:text-lg lg:text-xl leading-[110%] text-gray500">
              {milestone.description}
            </p>
          </article>
        ) : null}
      </div>
    </section>
  );
};

export default AboutTimelineSection;
