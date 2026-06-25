"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { educationLearnTabs } from "../data/content";

const EducationLearnMoreSection = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(1);

  const activeTab = educationLearnTabs[activeTabIndex];
  const slides = activeTab.slides;

  const goToPrevSlide = () => {
    setActiveSlideIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
  };

  const goToNextSlide = () => {
    setActiveSlideIndex((current) => (current === slides.length - 1 ? 0 : current + 1));
  };

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    setActiveSlideIndex(1);
  };

  return (
    <section
      aria-labelledby="education-learn-more-title"
      className="bg-white px-4 py-16 max-lg:min-h-[681px] lg:px-10 lg:py-[104px]"
    >
      <div className="mx-auto flex max-w-[1360px] flex-col items-center gap-6 lg:gap-16">
        <div className="flex w-full flex-col items-center gap-6 lg:gap-10">
          <h2
            id="education-learn-more-title"
            className="text-center font-larken text-[32px] font-light leading-110 text-darkblack lg:text-[48px]"
          >
            Learn more about Diamonds
          </h2>

          <div className="w-full overflow-x-auto border-y border-black/30 lg:max-w-[1200px]">
            <div className="flex min-w-max items-center gap-10 px-0 py-6 lg:w-full lg:justify-center lg:gap-0 lg:py-6">
              {educationLearnTabs.map((tab, index) => {
                const isActive = index === activeTabIndex;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(index)}
                    className={cn(
                      "shrink-0 px-0 py-2 font-gill text-base leading-110 lg:flex-1 lg:py-2 lg:text-[20px]",
                      isActive
                        ? "border-b border-[#ab863b] text-[#ab863b]"
                        : "text-darkblack",
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-[700px] text-center font-gill text-base font-light leading-110 text-neutral500 lg:text-[20px]">
            {activeTab.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-6 lg:gap-3">
          <div className="relative flex w-full items-center justify-center lg:gap-[250px]">
            <div className="relative hidden h-[328px] w-[350px] mix-blend-darken lg:block">
              <Image
                src={slides[(activeSlideIndex + slides.length - 1) % slides.length].src}
                alt=""
                fill
                className="object-cover"
                sizes="350px"
              />
            </div>

            <div className="relative flex w-full max-w-[311px] flex-col items-center gap-6 lg:max-w-[526px] lg:gap-3">
              <div className="relative flex w-full items-center justify-between lg:justify-center lg:gap-16">
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={goToPrevSlide}
                  className="flex size-6 items-center justify-center text-darkblack"
                >
                  <ChevronLeft size={24} strokeWidth={1.25} />
                </button>

                <div className="relative h-[172px] w-[196px] mix-blend-darken lg:h-[330px] lg:w-[350px]">
                  <Image
                    src={slides[activeSlideIndex].src}
                    alt={slides[activeSlideIndex].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 196px, 350px"
                  />
                </div>

                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={goToNextSlide}
                  className="flex size-6 items-center justify-center text-darkblack"
                >
                  <ChevronRight size={24} strokeWidth={1.25} />
                </button>
              </div>

              <Link
                href={activeTab.ctaHref}
                className="btn-slide-up inline-flex h-14 items-center justify-center border border-neutral300 px-7 font-gill text-sm uppercase leading-110 text-darkblack"
              >
                {activeTab.ctaLabel}
              </Link>
            </div>

            <div className="relative hidden h-[314px] w-[350px] mix-blend-darken lg:block">
              <Image
                src={slides[(activeSlideIndex + 1) % slides.length].src}
                alt=""
                fill
                className="object-cover"
                sizes="350px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationLearnMoreSection;
