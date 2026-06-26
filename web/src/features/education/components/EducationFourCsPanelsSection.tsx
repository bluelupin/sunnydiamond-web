"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import {
  educationFourCsPanels,
  educationPageImages,
  type EducationFourCsPanelContent,
} from "../data/content";
import EducationMetricSlider from "./EducationMetricSlider";

const PanelTexture = ({ panelId }: { panelId: string }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    <Image
      src={
        panelId === "clarity"
          ? educationPageImages.panelTexture
          : educationPageImages.panelTexture
      }
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
  const isClarity = panel.id === "clarity";

  const activeImage = useMemo(
    () => resolveActiveImage(panel, activeIndex),
    [panel, activeIndex],
  );

  return (
    <ScrollReveal
      delayMs={delayMs}
      className={cn(
        "relative flex w-full items-center justify-center",
        isClarity ? "h-[370px] lg:h-[633px]" : "h-[370px] lg:min-h-[633px] lg:h-full",
      )}
    >
      <PanelTexture panelId={panel.id} />

      <div
        className={cn(
          "relative z-10 flex w-full flex-col items-center px-4",
          isClarity ? "max-w-[528px] gap-10 lg:gap-16" : "max-w-[94.14%] gap-8 lg:max-w-[528px] lg:gap-10",
        )}
      >
        <div
          className={cn(
            "flex flex-col items-center",
            isClarity ? "gap-10 lg:gap-[40px]" : "gap-8 lg:gap-10",
          )}
        >
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
          ) : activeImage ? (
            <div
              className={cn(
                "relative overflow-hidden transition-opacity duration-300",
                isClarity ? "size-[120px] lg:size-[200px]" : "size-[120px] lg:size-[200px]",
              )}
            >
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

          <EducationMetricSlider
            options={slider.options}
            defaultIndex={slider.defaultIndex}
            activeIndex={activeIndex}
            onChange={setActiveIndex}
            variant={isClarity ? "clarity" : "default"}
          />
        </div>

        {panel.footnote ? (
          <div
            className={cn(
              "flex flex-col items-center",
              isClarity ? "gap-6 lg:max-w-[481px] lg:gap-[24px]" : "gap-4 lg:max-w-[481px] lg:gap-6",
            )}
          >
            <p
              className={cn(
                "text-center font-gill font-light leading-110",
                isClarity
                  ? "text-[14px] text-neutral500 lg:text-[16px] lg:text-[#4D4D4D]"
                  : "text-base text-neutral500 lg:text-base",
              )}
            >
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
  const isClarity = panel.id === "clarity";

  return (
    <ScrollReveal
      delayMs={delayMs}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        isClarity
          ? "gap-8 px-5 py-10 lg:gap-[32px] lg:px-10 lg:py-0"
          : "gap-6 px-5 py-10 lg:gap-8 lg:px-10 lg:py-0",
      )}
    >
      <p
        className={cn(
          "font-larken font-light leading-110 text-[#ab863b] opacity-50",
          isClarity ? "text-[60px] lg:text-[110px]" : "text-[60px] lg:text-[110px]",
        )}
      >
        {panel.code}
      </p>
      <div
        className={cn(
          "flex max-w-[441px] flex-col",
          isClarity ? "gap-3 lg:gap-[16px]" : "gap-3 lg:gap-4",
        )}
      >
        <h3
          id={`education-panel-${panel.id}`}
          className={cn(
            "font-larken font-light leading-110 text-darkblack",
            isClarity ? "text-[20px] lg:text-[32px]" : "text-[20px] lg:text-[32px]",
          )}
        >
          {panel.title}
        </h3>
        <p
          className={cn(
            "font-gill font-light leading-110 text-darkblack",
            isClarity ? "text-base lg:text-[20px]" : "text-base lg:text-[20px]",
          )}
        >
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
        {panel.mediaPosition === "left" ? (
          <>
            <PanelMedia panel={panel} delayMs={mediaDelay} />
            <PanelCopy panel={panel} delayMs={copyDelay} />
          </>
        ) : (
          <>
            <PanelCopy panel={panel} delayMs={copyDelay} />
            <PanelMedia panel={panel} delayMs={mediaDelay} />
          </>
        )}
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
