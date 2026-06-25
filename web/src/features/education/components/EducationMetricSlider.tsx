"use client";

import { useState } from "react";
import { cn } from "@/shared/utils/cn";
import type { EducationSliderOption } from "../data/content";

type EducationMetricSliderProps = {
  options: EducationSliderOption[];
  defaultIndex: number;
};

const EducationMetricSlider = ({ options, defaultIndex }: EducationMetricSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const maxIndex = Math.max(options.length - 1, 1);
  const thumbPercent = (activeIndex / maxIndex) * 100;

  return (
    <div className="w-full">
      <div className="relative px-[10px] pb-[30.5px] lg:pb-[32.5px]">
        <div className="h-px bg-neutral300 lg:h-[1.5px]" aria-hidden />

        <div
          className="absolute top-[5px] flex w-[calc(100%-20px)] justify-between px-[10px] lg:top-[6px]"
          aria-hidden
        >
          {options.map((option) => (
            <span key={option.label} className="size-[4.5px] rounded-full bg-neutral300 lg:size-[6px]" />
          ))}
        </div>

        <button
          type="button"
          aria-label="Adjust diamond grade"
          aria-valuemin={0}
          aria-valuemax={maxIndex}
          aria-valuenow={activeIndex}
          className="absolute top-0 size-[14px] -translate-x-1/2 rounded-full border-2 border-[#ab863b] bg-white lg:size-[18px]"
          style={{ left: `calc(${thumbPercent}% * (100% - 20px) / 100 + 10px)` }}
          onClick={() => setActiveIndex((current) => (current >= maxIndex ? 0 : current + 1))}
        />
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
                isHighlight ? "text-[#ab863b]" : "text-darkblack",
              )}
            >
              <span>{option.label}</span>
              {option.sublabel ? (
                <span className="mt-0.5 text-[14px] font-light leading-normal text-neutral500 lg:text-base">
                  {Array.isArray(option.sublabel) ? (
                    option.sublabel.map((line) => <span key={line} className="block">{line}</span>)
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
