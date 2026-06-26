"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import {
  educationFourCsPanels,
  educationPageImages,
  educationSliderSpecs,
  type EducationFourCsPanelContent,
} from "../data/content";
import EducationMetricSlider from "./EducationMetricSlider";

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

const PanelMedia = ({ panel, delayMs = 0 }: { panel: EducationFourCsPanelContent; delayMs?: number }) => {
  const { slider } = panel;
  const [activeIndex, setActiveIndex] = useState(slider.defaultIndex);
  const sliderSpec = educationSliderSpecs[panel.id];

  const activeImage = useMemo(
    () => resolveActiveImage(panel, activeIndex),
    [panel, activeIndex],
  );

  return (
    <ScrollReveal
      delayMs={delayMs}
      className={cn(
        "relative flex w-full items-center justify-center",
        panel.id === "carat" ? "h-[370px] lg:h-[610px]" : "h-[370px] lg:h-[633px]",
      )}
    >
      <PanelTexture panelId={panel.id} />

      <div className="relative z-10 flex w-full max-w-[528px] flex-col items-center px-4">
        <div className="flex w-full flex-col items-center gap-10 lg:gap-[40px]">
          {slider.showDecorativeDiamond ? (
            <>
              <div className="relative size-10 lg:absolute lg:left-1/2 lg:top-[calc(50%-118.5px)] lg:size-10 lg:-translate-x-1/2">
                <Image
                  src={educationPageImages.decorativeDiamond}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20" aria-hidden>
                <Image
                  src={educationPageImages.panelTexture}
                  alt=""
                  fill
                  className="scale-150 object-cover"
                  sizes="50vw"
                />
              </div>
            </>
          ) : panel.id === "cut" ? (
            <div className="flex items-center gap-6 lg:gap-[24px]">
              <div className="relative size-[120px] shrink-0 overflow-hidden lg:size-[200px]">
                <Image
                  src={educationPageImages.cutDiamondGood}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <div className="relative size-[120px] shrink-0 overflow-hidden lg:size-[200px]">
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
            <EducationMetricSlider
              options={slider.options}
              defaultIndex={slider.defaultIndex}
              activeIndex={activeIndex}
              onChange={setActiveIndex}
              spec={sliderSpec}
            />
          ) : null}
        </div>

        {panel.footnote ? (
          <div className="mt-10 flex w-full max-w-[481px] flex-col items-center gap-6 lg:mt-[64px] lg:gap-[24px]">
            <p className="text-center font-gill text-[14px] font-light leading-110 text-neutral500 lg:text-[16px] lg:text-[#4D4D4D]">
              {panel.footnote}
            </p>
            <Image
              src={educationPageImages.scrollArrow}
              alt=""
              width={24}
              height={23}
              className="h-[16px] w-4 lg:h-[23px] lg:w-6"
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
      className="flex flex-col items-center justify-center gap-8 px-5 py-10 text-center lg:h-full lg:gap-[32px] lg:px-10 lg:py-0"
    >
      <p className="font-larken text-[60px] font-light leading-110 text-[#ab863b] opacity-50 lg:text-[110px]">
        {panel.code}
      </p>
      <div className="flex max-w-[441px] flex-col gap-3 lg:gap-[16px]">
        <h3
          id={`education-panel-${panel.id}`}
          className="font-larken text-[20px] font-light leading-110 text-darkblack lg:text-[32px]"
        >
          {panel.title}
        </h3>
        <p className="font-gill text-base font-light leading-110 text-darkblack lg:text-[20px]">
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
  panel: EducationFourCsPanelContent;
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
        isChalk ? "bg-[#F4F3EE]" : "bg-white",
        panel.id === "carat" ? "lg:h-[610px]" : "lg:h-[633px]",
      )}
    >
      <div className="flex flex-col lg:grid lg:h-full lg:grid-cols-2">
        <div className={cn("lg:h-full", panel.mediaPosition === "left" && "lg:order-2")}>
          <PanelCopy panel={panel} delayMs={copyDelay} />
        </div>
        <div className={cn("lg:h-full", panel.mediaPosition === "left" && "lg:order-1")}>
          <PanelMedia panel={panel} delayMs={mediaDelay} />
        </div>
      </div>
    </section>
  );
};

const EducationFourCsPanelsSection = () => {
  return (
    <div className="flex flex-col">
      {educationFourCsPanels.map((panel, index) => (
        <EducationFourCsPanel key={panel.id} panel={panel} index={index} />
      ))}
    </div>
  );
};

export default EducationFourCsPanelsSection;
