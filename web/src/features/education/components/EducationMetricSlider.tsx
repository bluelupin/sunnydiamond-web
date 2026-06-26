"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import {
  educationClarityPanelSpec,
  educationPageImages,
  type EducationSliderOption,
} from "../data/content";

type EducationMetricSliderProps = {
  options: EducationSliderOption[];
  defaultIndex: number;
  activeIndex?: number;
  onChange?: (index: number) => void;
  variant?: "clarity" | "default";
};

const claritySpec = educationClarityPanelSpec;

const toPercent = (value: number) => `${(value / claritySpec.sliderWidth) * 100}%`;

const EducationMetricSlider = ({
  options,
  defaultIndex,
  activeIndex: controlledIndex,
  onChange,
  variant = "default",
}: EducationMetricSliderProps) => {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIndex = controlledIndex ?? internalIndex;
  const maxIndex = Math.max(options.length - 1, 0);
  const isClarity = variant === "clarity";

  const setActiveIndex = useCallback(
    (index: number) => {
      const next = Math.min(Math.max(index, 0), maxIndex);
      if (controlledIndex === undefined) {
        setInternalIndex(next);
      }
      onChange?.(next);
    },
    [controlledIndex, maxIndex, onChange],
  );

  if (isClarity) {
    const dotCenters = claritySpec.sliderDotCenters;
    const labelLefts = claritySpec.sliderLabelLeft;
    const thumbHalf = claritySpec.sliderThumbSize / 2;
    const activeDotCenter = dotCenters[activeIndex] ?? dotCenters[0];
    const activeThumbLeft = activeDotCenter - thumbHalf;

    return (
      <div
        className="relative mx-auto w-full max-w-[521.21px]"
        style={{ height: claritySpec.sliderHeight }}
        role="group"
        aria-label="Diamond clarity grade"
      >
        <div
          className="absolute"
          style={{
            left: toPercent(claritySpec.sliderTrackLeft),
            top: claritySpec.sliderTrackTop,
            width: toPercent(claritySpec.sliderTrackWidth),
            height: claritySpec.sliderTrackHeight,
          }}
          aria-hidden
        >
          <Image
            src={educationPageImages.claritySliderTrack}
            alt=""
            width={501}
            height={2}
            className="h-full w-full"
          />
        </div>

        <div
          className="pointer-events-none absolute"
          style={{
            left: toPercent(claritySpec.sliderDotsLeft),
            top: claritySpec.sliderDotsTop,
            width: toPercent(claritySpec.sliderDotsWidth),
            height: claritySpec.sliderDotsHeight,
          }}
          aria-hidden
        >
          <Image
            src={educationPageImages.claritySliderDots}
            alt=""
            width={510}
            height={6}
            className="h-full w-full"
          />
        </div>

        <div
          className="pointer-events-none absolute top-0 transition-[left] duration-200 ease-out"
          style={{ left: toPercent(activeThumbLeft) }}
          aria-hidden
        >
          <Image
            src={educationPageImages.claritySliderThumb}
            alt=""
            width={claritySpec.sliderThumbSize}
            height={claritySpec.sliderThumbSize}
            className="size-[18px]"
          />
        </div>

        {options.map((option, index) => {
          const dotCenter = dotCenters[index] ?? dotCenters[0];
          const isActive = index === activeIndex;

          return (
            <button
              key={option.label}
              type="button"
              aria-label={`Select ${option.label} clarity`}
              aria-pressed={isActive}
              onClick={() => setActiveIndex(index)}
              className="absolute top-0 -translate-x-1/2 p-0"
              style={{
                left: toPercent(dotCenter),
                width: 28,
                height: claritySpec.sliderHeight,
              }}
            />
          );
        })}

        {options.map((option, index) => {
          const labelLeft = labelLefts[index] ?? labelLefts[0];
          const isActive = index === activeIndex;

          return (
            <span
              key={`${option.label}-label`}
              className={cn(
                "pointer-events-none absolute whitespace-nowrap font-gill text-[16px] font-normal leading-110 transition-colors",
                isActive ? "text-[#AB863B]" : "text-darkblack",
              )}
              style={{
                left: toPercent(labelLeft),
                top: claritySpec.sliderLabelTop,
              }}
            >
              {option.label}
            </span>
          );
        })}
      </div>
    );
  }

  const thumbPercent = maxIndex > 0 ? (activeIndex / maxIndex) * 100 : 0;

  return (
    <div className="w-full">
      <div className="relative px-[10px] pb-[32.5px]">
        <div className="h-px bg-neutral300 lg:h-[1.5px]" aria-hidden />

        <div
          className="absolute top-[6px] flex w-[calc(100%-20px)] justify-between px-[10px]"
          aria-hidden
        >
          {options.map((option) => (
            <button
              key={option.label}
              type="button"
              aria-label={`Select ${option.label}`}
              onClick={() => setActiveIndex(options.indexOf(option))}
              className="size-[24px] -translate-x-1/2 translate-y-[-2px] first:translate-x-0 last:translate-x-0"
            >
              <span className="mx-auto block size-[6px] rounded-full bg-[#D1B57A]" />
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Adjust diamond grade"
          aria-valuemin={0}
          aria-valuemax={maxIndex}
          aria-valuenow={activeIndex}
          className="absolute top-0 size-[18px] -translate-x-1/2"
          style={{ left: `calc(${thumbPercent}% * (100% - 20px) / 100 + 10px)` }}
          onClick={() => setActiveIndex(activeIndex >= maxIndex ? 0 : activeIndex + 1)}
        >
          <Image
            src={educationPageImages.claritySliderThumb}
            alt=""
            width={18}
            height={18}
            className="size-full"
            aria-hidden
          />
        </button>
      </div>

      <div className="flex justify-between font-gill text-[14px] leading-110 lg:text-base">
        {options.map((option, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={option.label}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "flex flex-col items-center text-center",
                isActive ? "text-[#ab863b]" : "text-darkblack",
              )}
            >
              <span>{option.label}</span>
              {option.sublabel ? (
                <span className="mt-0.5 text-[14px] font-light leading-normal text-neutral500 lg:text-base">
                  {Array.isArray(option.sublabel) ? (
                    option.sublabel.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))
                  ) : (
                    option.sublabel
                  )}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EducationMetricSlider;
