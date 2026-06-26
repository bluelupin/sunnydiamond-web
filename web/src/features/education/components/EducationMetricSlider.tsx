"use client";

import { useCallback, useMemo, useState } from "react";
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

const getTouchpointLeft = (index: number, count: number, width: number) => {
  if (count <= 1) return width / 2;
  const inset = claritySpec.sliderTrackInsetLeft;
  const trackWidth = claritySpec.sliderTrackWidth;
  return inset + (trackWidth * index) / (count - 1);
};

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

  const touchpointPositions = useMemo(
    () =>
      options.map((_, index) =>
        getTouchpointLeft(index, options.length, claritySpec.sliderWidth),
      ),
    [options],
  );

  if (isClarity) {
    return (
      <div
        className="relative w-full"
        style={{ maxWidth: claritySpec.sliderWidth, height: claritySpec.sliderLabelTop + 18 }}
        role="group"
        aria-label="Diamond clarity grade"
      >
        <div className="relative h-[18px] w-full">
          <div
            className="absolute"
            style={{
              left: claritySpec.sliderTrackInsetLeft,
              top: claritySpec.sliderTrackTop,
              width: claritySpec.sliderTrackWidth,
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

          {options.map((option, index) => {
            const left = touchpointPositions[index];
            const isActive = index === activeIndex;

            return (
              <button
                key={option.label}
                type="button"
                aria-label={`Select ${option.label} clarity`}
                aria-pressed={isActive}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "absolute flex -translate-x-1/2 items-center justify-center",
                  isActive ? "top-0 size-[24px]" : "top-[6px] size-[24px]",
                )}
                style={{ left }}
              >
                {isActive ? (
                  <Image
                    src={educationPageImages.claritySliderThumb}
                    alt=""
                    width={claritySpec.sliderThumbSize}
                    height={claritySpec.sliderThumbSize}
                    className="size-[18px]"
                    aria-hidden
                  />
                ) : (
                  <span
                    className="rounded-full"
                    style={{
                      width: claritySpec.sliderDotSize,
                      height: claritySpec.sliderDotSize,
                      backgroundColor: claritySpec.sliderDotColor,
                    }}
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>

        <div
          className="absolute inset-x-0 flex justify-between font-gill text-[11px] leading-110 sm:text-[14px] lg:text-[16px]"
          style={{ top: claritySpec.sliderLabelTop }}
        >
          {options.map((option, index) => {
            const isActive = index === activeIndex;
            const isGold = isActive && (option.highlight || isActive);

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "min-w-0 shrink-0 text-center font-normal transition-colors",
                  isGold ? "text-[#AB863B]" : "text-darkblack",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
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
          const isHighlight = option.highlight && isActive;

          return (
            <button
              key={option.label}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "flex flex-col items-center text-center",
                isHighlight || isActive ? "text-[#ab863b]" : "text-darkblack",
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
