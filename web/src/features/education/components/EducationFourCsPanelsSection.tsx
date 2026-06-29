"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import {
  educationPageImages,
  educationSliderSpecs,
  type EducationFourCsPanelContent,
} from "../data/content";
import type { NormalizedEducationFourCsPanel } from "@/services/education/learn-about-diamonds-page.types";
import EducationMetricSlider from "./EducationMetricSlider";
import EducationCaratHandVisual from "./EducationCaratHandVisual";

const PanelTexture = ({ panelId }: { panelId: string }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    <Image
      src={educationPageImages.panelTexture}
      alt=""
      fill
      className={cn(
        "object-cover opacity-90",
        panelId === "clarity" && "lg:scale-[1.14] lg:object-[center_49%]",
      )}
      sizes="50vw"
    />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,252,0)_0%,rgba(255,255,252,1)_100%)]" />
  </div>
);

const resolveActiveImage = (
  panel: EducationFourCsPanelContent,
  activeIndex: number,
): string | null => {
  const { slider } = panel;
  const optionImage = slider.options[activeIndex]?.image;
  if (optionImage) return optionImage;

  if (slider.dualImages) {
    const midpoint = Math.floor(slider.options.length / 2);
    return activeIndex >= midpoint ? slider.dualImages[1] : slider.dualImages[0];
  }

  return slider.image ?? null;
};

const PanelMedia = ({
  panel,
  delayMs = 0,
}: {
  panel: NormalizedEducationFourCsPanel;
  delayMs?: number;
}) => {
  const { slider } = panel;
  const [activeIndex, setActiveIndex] = useState(slider.defaultIndex);
  const sliderSpec = panel.sliderSpec ?? educationSliderSpecs[panel.id];

  const activeImage = useMemo(
    () => resolveActiveImage(panel, activeIndex),
    [panel, activeIndex],
  );

  const activeCarat = slider.options[activeIndex]?.caratWeight ?? 1.0;

  return (
    <ScrollReveal
      delayMs={delayMs}
      className={cn(
        "relative box-border flex w-full shrink-0 lg:mx-0",
        "max-md:mx-4 max-md:w-[calc(100%-32px)]",
        panel.id === "carat"
          ? "items-start justify-start max-md:h-[370px] md:h-500 lg:h-[610px]"
          : "items-center justify-center max-md:h-[370px] md:h-500 lg:h-[633px]",
      )}
    >
      <PanelTexture panelId={panel.id} />

      <div
        className={cn(
          "relative z-10 flex w-full min-w-0 flex-col",
          panel.id === "carat"
            ? "items-start lg:px-0"
            : "max-w-[323px] items-center lg:max-w-[528px] lg:px-4",
        )}
      >
          {panel.id === "carat" ? (
            <div className="flex w-full flex-col items-start gap-10 lg:gap-[40px]">
              <div className="w-full shrink-0 self-start overflow-hidden">
                <EducationCaratHandVisual activeCarat={activeCarat} />
              </div>
              {sliderSpec ? (
                <div className="flex w-full shrink-0 justify-center">
                  <EducationMetricSlider
                    className="relative z-20 shrink-0"
                    options={slider.options}
                    defaultIndex={slider.defaultIndex}
                    activeIndex={activeIndex}
                    onChange={setActiveIndex}
                    spec={sliderSpec}
                  />
                </div>
              ) : null}
            </div>
          ) : (
          <div
            className={cn(
              "flex w-full flex-col gap-10 lg:gap-[40px]",
              "items-center",
            )}
          >
            {panel.id === "cut" ? (
              <div className="flex items-center gap-6 lg:gap-[24px]">
                <div className="relative size-[120px] shrink-0 overflow-hidden md:size-[160px] lg:size-[200px]">
                  <Image
                    src={educationPageImages.cutDiamondGood}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <div className="relative size-[120px] shrink-0 overflow-hidden md:size-[160px] lg:size-[200px]">
                  <Image
                    src={educationPageImages.cutDiamondExcellent}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              </div>
            ) : activeImage ? (
              <div className="relative size-[120px] shrink-0 overflow-hidden transition-opacity duration-300 lg:size-[200px]">
                <Image
                  key={`${panel.id}-${activeIndex}-${activeImage}`}
                  src={activeImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
            ) : null}

            {sliderSpec ? (
              <div className="flex w-full justify-center">
                <EducationMetricSlider
                  className="relative z-20 shrink-0"
                  options={slider.options}
                  defaultIndex={slider.defaultIndex}
                  activeIndex={activeIndex}
                  onChange={setActiveIndex}
                  spec={sliderSpec}
                />
              </div>
            ) : null}
          </div>
          )}

          {panel.footnote ? (
            <div className="mt-10 flex w-full max-w-[481px] flex-col items-center gap-6 max-md:mt-10 max-md:max-w-[317px] max-md:gap-6 lg:mt-[64px] lg:gap-[24px]">
              <p className="text-center font-gill text-[14px] font-light leading-110 text-neutral500 lg:text-[16px] lg:text-[#4D4D4D]">
                {panel.footnote}
              </p>
              <Image
                src={educationPageImages.scrollArrow}
                alt=""
                width={24}
                height={23}
                className="h-4 w-4 lg:h-[23px] lg:w-6"
              />
            </div>
          ) : null}
      </div>
    </ScrollReveal>
  );
};

const PanelCopy = ({ panel, delayMs = 0 }: { panel: EducationFourCsPanelContent; delayMs?: number }) => {
  return (
    <ScrollReveal
      delayMs={delayMs}
      className={cn(
        "flex w-full shrink-0 flex-col items-center justify-center text-center",
        "max-md:h-[355px] max-md:gap-6 max-md:px-5 max-md:pt-10 max-md:pb-6",
        "lg:h-full lg:gap-[32px] lg:px-10 lg:py-0",
      )}
    >
      <p className="font-larken text-[60px] font-light leading-110 text-[#ab863b] opacity-50 lg:text-[110px]">
        {panel.code}
      </p>
      <div className="flex max-w-[303px] flex-col gap-3 lg:max-w-[441px] lg:gap-[16px]">
        <h3
          id={`education-panel-${panel.id}`}
          className="font-larken text-[20px] font-light leading-110 text-darkblack lg:text-[32px]"
        >
          {panel.title}
        </h3>
        <p className="font-gill text-[16px] font-light leading-110 text-darkblack lg:text-[20px]">
          {panel.description}
        </p>
      </div>
    </ScrollReveal>
  );
};

const EducationFourCsPanel = ({
  panel,
  index,
}: {
  panel: NormalizedEducationFourCsPanel;
  index: number;
}) => {
  const isChalk = panel.background === "chalk";
  const copyDelay = index * 40;
  const mediaDelay = 100 + index * 40;

  return (
    <section
      aria-labelledby={`education-panel-${panel.id}`}
      className={cn(
        "overflow-hidden",
        isChalk ? "bg-gray300" : "bg-white",
        "max-md:h-[725px]",
        panel.id === "carat" ? "lg:h-[610px]" : "lg:h-[633px]",
      )}
    >
      <div className="flex h-full flex-col lg:grid lg:grid-cols-2">
        <div className={cn("shrink-0 lg:h-full", panel.mediaPosition === "left" && "lg:order-2")}>
          <PanelCopy panel={panel} delayMs={copyDelay} />
        </div>
        <div className={cn("shrink-0 lg:h-full", panel.mediaPosition === "left" && "lg:order-1")}>
          <PanelMedia panel={panel} delayMs={mediaDelay} />
        </div>
      </div>
    </section>
  );
};

type EducationFourCsPanelsSectionProps = {
  fourCs: {
    panels: NormalizedEducationFourCsPanel[];
  };
};

const EducationFourCsPanelsSection = ({ fourCs }: EducationFourCsPanelsSectionProps) => {
  return (
    <div className="flex flex-col">
      {fourCs.panels.map((panel, index) => (
        <EducationFourCsPanel key={panel.id} panel={panel} index={index} />
      ))}
    </div>
  );
};

export default EducationFourCsPanelsSection;
