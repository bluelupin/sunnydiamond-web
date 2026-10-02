"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import {
  educationCaratVisualSpec,
  educationPageImages,
  educationScrollArrowClassName,
  type EducationFourCsPanelContent,
} from "../data/content";
import type { NormalizedEducationFourCsPanel } from "@/services/education/learn-about-diamonds-page.types";
import EducationMetricSlider from "./EducationMetricSlider";
import EducationCaratHandVisual from "./EducationCaratHandVisual";
import Reveal from "@/shared/Animation/Reveal";

const PanelTexture = ({ panelId, alt }: { panelId: string; alt?: string }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <Image
      src={educationPageImages.panelTexture}
      alt={alt || ""}
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

  // No dual/compare fallback — if this gradeStop has no CMS gradeImage, show nothing.
  // Clarity/Colour can still use panel-level visualImage via slider.image.
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
  const sliderSpec = panel.sliderSpec;

  const activeImage = useMemo(
    () => resolveActiveImage(panel, activeIndex),
    [panel, activeIndex],
  );

  const activeCarat = slider.options[activeIndex]?.caratWeight ?? 1.0;

  const caratWeightRange = useMemo(() => {
    const weights = slider.options
      .map((option) => option.caratWeight)
      .filter((weight): weight is number => weight != null);

    if (!weights.length) {
      return {
        min: educationCaratVisualSpec.minCarat,
        max: educationCaratVisualSpec.maxCarat,
      };
    }

    return {
      min: Math.min(...weights),
      max: Math.max(...weights),
    };
  }, [slider.options]);

  const activeCaratOption = slider.options[activeIndex];

  const cutDualImages =
    panel.id === "cut" ? slider.options[activeIndex]?.dualImages : undefined;

  return (
    <ScrollReveal
      delayMs={delayMs}
      className={cn(
        "relative box-border flex w-full shrink-0 lg:mx-0",
        "max-md:mx-4 max-md:w-[calc(100%-32px)]",
        panel.id === "carat"
          ? "items-start justify-start max-md:h-auto md:py-5 py-14 md:h-[600px] lg:h-[610px]"
          : "items-center justify-center max-md:h-auto md:py-5 py-14 md:h-500 lg:h-[633px]",
      )}
    >
      <PanelTexture panelId={panel.id} alt={panel.panelTextureAlt} />

      <div
        className={cn(
          "relative z-10 flex w-full min-w-0 flex-col",
          panel.id === "carat"
            ? "items-start lg:px-0"
            : " items-center max-w-[322px] md:max-w-[500px] xl:max-w-[528px] lg:px-0 px-4",
        )}
      >
        {panel.id === "carat" ? (
          <div className="flex w-full flex-col items-start gap-10 gap-0">
            <div className="w-full shrink-0 self-start overflow-hidden">
              {panel.caratHandImage ? (
                <EducationCaratHandVisual
                  activeCarat={activeCarat}
                  minCarat={caratWeightRange.min}
                  maxCarat={caratWeightRange.max}
                  handDesktopUrl={panel.caratHandImage.desktopUrl}
                  handMobileUrl={panel.caratHandImage.mobileUrl}
                  handAlt={panel.caratHandImage.alt}
                  diamondImageUrl={activeCaratOption?.image}
                  diamondImageAlt={activeCaratOption?.imageAlt}
                />
              ) : null}
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
              "flex w-full flex-col gap-10",
              "items-center",
            )}
          >
            {cutDualImages ? (
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="relative size-[120px] shrink-0 overflow-hidden md:size-[160px] lg:size-[200px]">
                  <Image
                    key={`${panel.id}-${activeIndex}-dual-1-${cutDualImages[1]}`}
                    src={cutDualImages[1]}
                    alt={slider.options[activeIndex]?.dualImageAlts?.[1] ?? ""}
                    fill
                    className="object-contain"
                    sizes="200px"
                  />
                </div>
                <div className="relative size-[120px] shrink-0 overflow-hidden md:size-[160px] lg:size-[200px]">
                  <Image
                    key={`${panel.id}-${activeIndex}-dual-0-${cutDualImages[0]}`}
                    src={cutDualImages[0]}
                    alt={slider.options[activeIndex]?.dualImageAlts?.[0] ?? ""}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              </div>
            ) : activeImage ? (
              <div className="relative size-[120px] shrink-0 overflow-hidden md:size-[160px] lg:size-[200px]">
                <Image
                  key={`${panel.id}-${activeIndex}-${activeImage}`}
                  src={activeImage}
                  alt={slider.options[activeIndex]?.imageAlt ?? ""}
                  fill
                  className="object-contain"
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

        {panel.footnote &&
          <ScrollReveal delayMs={300} className="flex w-full flex-col items-center md:max-w-[481px] max-w-[317px] mx-auto lg:mt-16 mt-10 lg:gap-6 gap-4">
            <p className="text-center font-gill font-light leading-110 text-darkblack text-base lg:text-neutral500">
              {panel.footnote}
            </p>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.15453 12.1386C3.77843 12.129 4.42509 12.1209 5.04794 12.1374C6.78988 12.1833 8.47929 12.9876 9.72624 14.2242C11.0562 15.544 11.8249 17.3483 11.8654 19.2457C11.8762 20.0056 11.8544 20.7716 11.862 21.5298L11.8202 21.5586L11.7968 21.5477C11.797 20.8965 11.3759 19.6203 11.1349 18.9748C10.8331 18.1659 10.222 17.0972 9.69249 16.4086C7.93114 14.0738 5.33633 12.5535 2.48047 12.183C2.58489 12.1079 2.9598 12.1595 3.15453 12.1386Z" fill="#0A0A0A" />
              <path d="M10.9309 5.28612C11.2432 4.58679 11.5304 3.6885 11.7223 2.93877C11.7913 2.66921 11.78 2.26891 11.8464 2C11.8706 2.5051 11.8646 3.06019 11.8667 3.57021C11.8695 4.23837 11.8966 5.19963 11.7252 5.85247C11.6993 6.11291 11.56 6.44458 11.4766 6.69466C11.1017 7.81744 10.5293 8.68789 9.70828 9.53456C8.06154 11.2327 5.93485 11.7195 3.67158 11.6011C3.15292 11.574 2.55759 11.6612 2.03516 11.6526C2.35275 11.5494 2.73028 11.4999 3.06354 11.4518C3.89002 11.3326 4.55591 11.0935 5.32446 10.776C7.58717 9.84117 9.51016 8.04536 10.6488 5.83497C10.7436 5.65097 10.8333 5.46869 10.9309 5.28612Z" fill="#0A0A0A" />
              <path d="M10.9297 5.28612C11.2419 4.58679 11.5291 3.6885 11.721 2.93877C11.79 2.66921 11.7787 2.26891 11.8451 2C11.8693 2.5051 11.8633 3.06019 11.8655 3.57021C11.8683 4.23837 11.8953 5.19963 11.724 5.85247C11.6732 5.50945 11.8458 5.11113 11.7927 4.76038C11.7753 4.64503 11.4391 4.50971 11.3189 4.4303C11.2355 4.62574 11.0974 5.18659 10.9297 5.28612Z" fill="#0A0A0A" />
              <path d="M12.1074 2C12.1925 2.08086 12.3527 2.91819 12.3906 3.08589C13.0842 6.15526 15.1517 8.81832 17.8676 10.2769C18.4391 10.5838 19.0945 10.7976 19.6968 11.031C19.9971 11.1474 21.696 11.4042 21.7409 11.5021C21.2371 11.4858 20.7331 11.4742 20.2288 11.4672C18.6531 11.4563 17.4085 11.4475 15.9657 10.6248C15.4567 10.3345 15.2175 10.2007 14.7515 9.80521C13.2002 8.48458 12.2605 6.55686 12.1616 4.49175C12.1175 3.68667 12.184 2.81033 12.1074 2Z" fill="#0A0A0A" />
              <path d="M16.9567 12.6019C17.056 12.6209 17.1305 12.5823 17.225 12.546C17.3214 12.7035 17.6959 13.281 17.711 13.4212C17.6399 13.5382 17.5313 13.4708 17.4745 13.6308C17.2612 13.8195 16.9325 13.9992 16.6969 14.1713C14.6388 15.6744 13.1285 17.9753 12.537 20.4928C12.4765 20.7503 12.3961 21.0422 12.3567 21.3056L12.2695 21.2419C12.3094 20.7118 12.2675 20.0243 12.2844 19.482C12.3276 18.0889 12.6024 16.8731 13.3147 15.6721C13.9256 14.6421 14.7501 13.8006 15.7563 13.1802C16.1518 12.9364 16.5047 12.7246 16.9567 12.6019Z" fill="#0A0A0A" />
              <path d="M16.957 12.6021C17.9892 12.1138 19.0073 12.1326 20.1038 12.1317C20.5826 12.132 21.0614 12.1271 21.5402 12.1169L21.5917 12.1931C20.5738 12.3275 19.4204 12.6606 18.4903 13.1116C18.1518 13.2757 17.811 13.459 17.4748 13.6309C17.5316 13.471 17.6402 13.5384 17.7113 13.4214C17.6962 13.2812 17.3217 12.7037 17.2253 12.5462C17.1308 12.5825 17.0563 12.6211 16.957 12.6021Z" fill="#0A0A0A" />
              <path d="M2 12.0996C2.36886 12.1091 2.79276 12.1103 3.15659 12.1388C2.96185 12.1598 2.58695 12.1082 2.48252 12.1832C2.35786 12.1974 2.12184 12.1376 2 12.0996Z" fill="#0A0A0A" />
              <path d="M12.2713 21.2421L12.3585 21.3057C12.3259 21.4847 12.2901 21.6631 12.2513 21.8408C12.2342 21.6454 12.2504 21.4369 12.2713 21.2421Z" fill="#0A0A0A" />
              <path d="M11.7973 21.5482L11.8208 21.5591L11.8625 21.5303C11.8621 21.6869 11.8598 21.8436 11.8556 22.0002C11.8221 21.8612 11.785 21.6916 11.7973 21.5482Z" fill="#0A0A0A" />
              <path d="M21.541 12.1172C21.6911 12.119 21.8512 12.1183 22.0001 12.1253C21.8428 12.1607 21.7523 12.1784 21.5924 12.1933L21.541 12.1172Z" fill="#0A0A0A" />
            </svg>
          </ScrollReveal>
        }
      </div>
    </ScrollReveal>
  );
};

const PanelCopy = ({ panel, delayMs = 0 }: { panel: EducationFourCsPanelContent; delayMs?: number }) => {
  return (
    <Reveal direction="up"
      className={cn(
        "flex w-full shrink-0 flex-col items-center justify-center text-center",
        "min-h-[355px] max-md:px-5 max-md:pt-10 max-md:pb-6",
        "lg:h-full lg:gap-8 gap-6 lg:px-10 lg:py-0",
      )}
    >
      <Reveal as="p" direction="up" className="font-larken font-light leading-110 text-linkGold opacity-50 lg:text-[110px] text-6xl">
        {panel.code}
      </Reveal>
      <div className="flex flex-col max-w-[303px] md:max-w-[400px] xl:max-w-[441px] lg:gap-4 gap-3">
        <Reveal as="h3" direction="up"
          id={`education-panel-${panel.id}`}
          className="font-larken text-xl font-light leading-110 text-darkblack lg:text-32"
        >
          {panel.title}
        </Reveal>
        <Reveal as="p" direction="up" className="font-gill text-base font-light leading-110 text-darkblack lg:text-xl">
          {panel.description}
        </Reveal>
      </div>
    </Reveal>
  );
};

const EducationFourCsPanel = ({
  panel,
  index,
  totalPanels,
}: {
  panel: NormalizedEducationFourCsPanel;
  index: number;
  totalPanels: number;
}) => {
  const isChalk = panel.background === "chalk";
  const isCopyWhiteBackground = index === totalPanels - 1;
  const copyDelay = index * 40;
  const mediaDelay = 100 + index * 40;

  return (
    <section
      aria-labelledby={`education-panel-${panel.id}`}
      className={cn(
        "overflow-hidden",
        isChalk ? "bg-gray300" : "md:bg-white bg-gray300",
        "max-md:h-auto",
        panel.id === "carat" ? "lg:h-[610px]" : "lg:h-[633px]",
      )}
    >
      <div className="flex h-full flex-col lg:grid lg:grid-cols-2">
        <div
          className={cn(
            "shrink-0 lg:h-full",
            panel.mediaPosition === "left" && "lg:order-2",
            isCopyWhiteBackground && "lg:bg-white",
          )}
        >
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
        <EducationFourCsPanel
          key={panel.id}
          panel={panel}
          index={index}
          totalPanels={fourCs.panels.length}
        />
      ))}
    </div>
  );
};

export default EducationFourCsPanelsSection;
