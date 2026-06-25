"use client";

import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import {
  educationFourCsPanels,
  educationPageImages,
  type EducationFourCsPanelContent,
} from "../data/content";
import EducationMetricSlider from "./EducationMetricSlider";

const PanelTexture = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    <Image
      src={educationPageImages.panelTexture}
      alt=""
      fill
      className="object-cover opacity-90"
      sizes="50vw"
    />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,252,0)_0%,rgba(255,255,252,1)_100%)]" />
  </div>
);

const PanelMedia = ({ panel }: { panel: EducationFourCsPanelContent }) => {
  const { slider } = panel;

  return (
    <div className="relative flex h-[370px] w-full items-center justify-center lg:h-full lg:min-h-[633px]">
      <PanelTexture />

      <div className="relative z-10 flex w-full max-w-[94.14%] flex-col items-center gap-8 px-4 lg:max-w-[528px] lg:gap-10">
        {slider.dualImages ? (
          <div className="flex items-center gap-4 lg:gap-6">
            {slider.dualImages.map((src) => (
              <div key={src} className="relative size-[120px] lg:size-[200px]">
                <Image src={src} alt="" fill className="object-cover" sizes="200px" />
              </div>
            ))}
          </div>
        ) : slider.showDecorativeDiamond ? (
          <div className="relative size-10 lg:absolute lg:left-1/2 lg:top-[calc(50%-118.5px)] lg:size-10 lg:-translate-x-1/2">
            <Image
              src={educationPageImages.decorativeDiamond}
              alt=""
              fill
              className="object-contain"
              sizes="40px"
            />
          </div>
        ) : slider.image ? (
          <div className="relative size-[120px] lg:size-[200px]">
            <Image src={slider.image} alt="" fill className="object-cover" sizes="200px" />
          </div>
        ) : null}

        {slider.showDecorativeDiamond ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20" aria-hidden>
            <Image
              src={educationPageImages.panelTexture}
              alt=""
              fill
              className="scale-150 object-cover"
              sizes="50vw"
            />
          </div>
        ) : null}

        <EducationMetricSlider options={slider.options} defaultIndex={slider.defaultIndex} />

        {panel.footnote ? (
          <div className="flex flex-col items-center gap-4 lg:max-w-[481px] lg:gap-6">
            <p className="text-center font-gill text-base font-light leading-110 text-neutral500 lg:text-base">
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
    </div>
  );
};

const PanelCopy = ({ panel }: { panel: EducationFourCsPanelContent }) => (
  <div className="flex flex-col items-center justify-center gap-6 px-5 py-10 text-center lg:gap-8 lg:px-10 lg:py-0">
    <p className="font-larken text-[60px] font-light leading-110 text-[#ab863b] opacity-50 lg:text-[110px]">
      {panel.code}
    </p>
    <div className="flex max-w-[441px] flex-col gap-3 lg:gap-4">
      <h3 className="font-larken text-[20px] font-light leading-110 text-darkblack lg:text-[32px]">
        {panel.title}
      </h3>
      <p className="font-gill text-base font-light leading-110 text-darkblack lg:text-[20px]">
        {panel.description}
      </p>
    </div>
  </div>
);

const EducationFourCsPanel = ({ panel }: { panel: EducationFourCsPanelContent }) => {
  const isChalk = panel.background === "chalk";

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
            <PanelMedia panel={panel} />
            <PanelCopy panel={panel} />
          </>
        ) : (
          <>
            <PanelCopy panel={panel} />
            <PanelMedia panel={panel} />
          </>
        )}
      </div>
    </section>
  );
};

const EducationFourCsPanelsSection = () => {
  return (
    <div className="flex flex-col">
      {educationFourCsPanels.map((panel) => (
        <EducationFourCsPanel key={panel.id} panel={panel} />
      ))}
    </div>
  );
};

export default EducationFourCsPanelsSection;
