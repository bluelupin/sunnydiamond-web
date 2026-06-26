"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import {
  educationPageImages,
  type EducationSliderOption,
  type EducationSliderSpec,
} from "../data/content";

type EducationMetricSliderProps = {
  options: EducationSliderOption[];
  defaultIndex: number;
  activeIndex?: number;
  onChange?: (index: number) => void;
  spec: EducationSliderSpec;
};

const toPercent = (value: number, width: number) => `${(value / width) * 100}%`;

const EducationMetricSlider = ({
  options,
  defaultIndex,
  activeIndex: controlledIndex,
  onChange,
  spec,
}: EducationMetricSliderProps) => {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIndex = controlledIndex ?? internalIndex;
  const maxIndex = Math.max(options.length - 1, 0);
  const thumbHalf = spec.thumbSize / 2;
  const activeDotCenter = spec.dotCenters[activeIndex] ?? spec.dotCenters[0];
  const activeThumbLeft = activeDotCenter - thumbHalf;
  const hasSublabels = Boolean(spec.sublabelTop);

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

  return (
    <div
      className="relative mx-auto w-full"
      style={{ maxWidth: spec.width, height: spec.height }}
      role="group"
      aria-label={spec.ariaLabel}
    >
      <div
        className="absolute bg-[#D1B57A]"
        style={{
          left: toPercent(spec.trackLeft, spec.width),
          top: spec.trackTop,
          width: toPercent(spec.trackWidth, spec.width),
          height: spec.trackHeight,
        }}
        aria-hidden
      />

      {spec.dotCenters.map((dotCenter, index) => (
        <span
          key={`dot-${index}`}
          className="pointer-events-none absolute size-[6px] -translate-x-1/2 rounded-full bg-[#D1B57A]"
          style={{
            left: toPercent(dotCenter, spec.width),
            top: spec.trackTop + spec.trackHeight / 2 - 3,
          }}
          aria-hidden
        />
      ))}

      <div
        className="pointer-events-none absolute top-0 z-10 transition-[left] duration-200 ease-out"
        style={{ left: toPercent(activeThumbLeft, spec.width) }}
        aria-hidden
      >
        <Image
          src={educationPageImages.claritySliderThumb}
          alt=""
          width={spec.thumbSize}
          height={spec.thumbSize}
          className="size-[18px]"
        />
      </div>

      {options.map((option, index) => {
        const dotCenter = spec.dotCenters[index] ?? spec.dotCenters[0];

        return (
          <button
            key={option.label}
            type="button"
            aria-label={`Select ${option.label}`}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className="absolute top-0 -translate-x-1/2 p-0"
            style={{
              left: toPercent(dotCenter, spec.width),
              width: 28,
              height: spec.height,
            }}
          />
        );
      })}

      {options.map((option, index) => {
        const labelLeft = spec.labelLeft[index] ?? spec.labelLeft[0];
        const isActive = index === activeIndex;

        return (
          <span
            key={`${option.label}-label`}
            className={cn(
              "pointer-events-none absolute whitespace-nowrap font-gill text-[16px] font-normal leading-110 transition-colors",
              isActive ? "text-[#AB863B]" : "text-darkblack",
            )}
            style={{
              left: toPercent(labelLeft, spec.width),
              top: spec.labelTop,
            }}
          >
            {option.label}
          </span>
        );
      })}

      {hasSublabels
        ? options.map((option, index) => {
            const sublabelLeft = spec.sublabelLeft?.[index] ?? spec.sublabelLeft?.[0] ?? 0;
            const isActive = index === activeIndex;

            if (!option.sublabel) return null;

            return (
              <span
                key={`${option.label}-sublabel`}
                className={cn(
                  "pointer-events-none absolute max-w-[80px] text-center font-gill text-[14px] font-light leading-110",
                  isActive ? "text-[#AB863B]" : "text-darkblack",
                )}
                style={{
                  left: toPercent(sublabelLeft, spec.width),
                  top: spec.sublabelTop,
                }}
              >
                {Array.isArray(option.sublabel) ? (
                  option.sublabel.map((line) => (
                    <span key={line} className="block whitespace-nowrap">
                      {line}
                    </span>
                  ))
                ) : (
                  <span className="block whitespace-nowrap">{option.sublabel}</span>
                )}
              </span>
            );
          })
        : null}
    </div>
  );
};

export default EducationMetricSlider;
