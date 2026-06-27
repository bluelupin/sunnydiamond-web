"use client";

import { useCallback, useRef, useState } from "react";
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
  className?: string;
};

const toPercent = (value: number, width: number) => `${(value / width) * 100}%`;

const TRACK_DOT_GAP = 10;

/** Segmented track: ~10px gap on each side of interior dots; first/last flush to track ends. */
const buildTrackSegments = (
  dotCenters: readonly number[],
  trackLeft: number,
  trackWidth: number,
  gap = TRACK_DOT_GAP,
) => {
  const trackEnd = trackLeft + trackWidth;
  const segments: { left: number; width: number }[] = [];

  for (let i = 0; i < dotCenters.length - 1; i++) {
    const start = i === 0 ? trackLeft : dotCenters[i] + gap;
    const end = i === dotCenters.length - 2 ? trackEnd : dotCenters[i + 1] - gap;

    if (end > start) {
      segments.push({ left: start, width: end - start });
    }
  }

  return segments;
};

const EducationMetricSlider = ({
  options,
  defaultIndex,
  activeIndex: controlledIndex,
  onChange,
  spec,
  className,
}: EducationMetricSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIndex = controlledIndex ?? internalIndex;
  const maxIndex = Math.max(options.length - 1, 0);
  const thumbHalf = spec.thumbSize / 2;
  const activeDotCenter = spec.dotCenters[activeIndex] ?? spec.dotCenters[0];
  const activeThumbLeft = activeDotCenter - thumbHalf;
  const hasSublabels = Boolean(spec.sublabelTop);
  const showActiveLabelOnly = spec.labelDisplay === "active";
  const showEndpointLabels = spec.labelDisplay === "endpoints";
  const activeOption = options[activeIndex];
  const showDots = spec.showDots !== false;
  const endpointDotsOnly = spec.endpointDotsOnly === true;
  const lastDotIndex = spec.dotCenters.length - 1;
  const trackDotGap = spec.trackDotGap ?? TRACK_DOT_GAP;
  const endpointTrackSegment =
    endpointDotsOnly && showDots && spec.dotCenters.length >= 2
      ? {
          left: spec.trackLeft,
          width: Math.max(
            spec.dotCenters[lastDotIndex] - trackDotGap - spec.trackLeft,
            0,
          ),
        }
      : null;
  const trackSegments = showDots && !endpointDotsOnly
    ? buildTrackSegments(
        spec.dotCenters,
        spec.trackLeft,
        spec.trackWidth,
        spec.trackDotGap ?? TRACK_DOT_GAP,
      )
    : [];

  const renderTrackSegment = (left: number, width: number, key: string) => (
    <div
      key={key}
      className="absolute bg-[#D1B57A]"
      style={{
        left: toPercent(left, spec.width),
        top: spec.trackTop,
        width: toPercent(width, spec.width),
        height: spec.trackHeight,
      }}
      aria-hidden
    />
  );

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

  const indexFromClientX = useCallback(
    (clientX: number) => {
      const slider = sliderRef.current;
      if (!slider) return activeIndex;

      const rect = slider.getBoundingClientRect();
      const specX = ((clientX - rect.left) / rect.width) * spec.width;

      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      spec.dotCenters.forEach((center, index) => {
        if (index > maxIndex) return;

        const distance = Math.abs(center - specX);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      return nearestIndex;
    },
    [activeIndex, maxIndex, spec.dotCenters, spec.width],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setActiveIndex(indexFromClientX(event.clientX));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    setActiveIndex(indexFromClientX(event.clientX));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={sliderRef}
      className={cn("relative z-20 mx-auto w-full cursor-pointer touch-none", className)}
      style={{ maxWidth: spec.width, height: spec.height }}
      role="group"
      aria-label={spec.ariaLabel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {showDots
        ? endpointTrackSegment
          ? renderTrackSegment(
              endpointTrackSegment.left,
              endpointTrackSegment.width,
              "endpoint-track",
            )
          : trackSegments.length > 0
            ? trackSegments.map((segment, index) =>
                renderTrackSegment(segment.left, segment.width, `track-${index}`),
              )
            : null
        : renderTrackSegment(spec.trackLeft, spec.trackWidth, "continuous-track")}

      {showDots
        ? spec.dotCenters.map((dotCenter, index) => {
            if (endpointDotsOnly && index !== 0 && index !== lastDotIndex) {
              return null;
            }

            return (
              <span
                key={`dot-${index}`}
                className="pointer-events-none absolute size-[6px] -translate-x-1/2 rounded-full bg-[#D1B57A]"
                style={{
                  left: toPercent(dotCenter, spec.width),
                  top: spec.trackTop + spec.trackHeight / 2 - 3,
                }}
                aria-hidden
              />
            );
          })
        : null}

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
            className="absolute top-0 z-30 -translate-x-1/2 cursor-pointer p-0"
            style={{
              left: toPercent(dotCenter, spec.width),
              width: 44,
              height: spec.height,
            }}
          />
        );
      })}

      {showEndpointLabels ? (
        <>
          {options[0] ? (
            <span
              className={cn(
                "pointer-events-none absolute -translate-x-1/2 whitespace-nowrap font-gill text-[16px] font-normal leading-110 transition-colors",
                activeIndex === 0 ? "text-[#AB863B]" : "text-darkblack",
              )}
              style={{
                left: toPercent(spec.dotCenters[0], spec.width),
                top: spec.labelTop,
              }}
            >
              {options[0].label}
            </span>
          ) : null}
          {options[lastDotIndex] ? (
            <span
              className={cn(
                "pointer-events-none absolute -translate-x-1/2 whitespace-nowrap font-gill text-[16px] font-normal leading-110 transition-colors",
                activeIndex === lastDotIndex ? "text-[#AB863B]" : "text-darkblack",
              )}
              style={{
                left: toPercent(spec.dotCenters[lastDotIndex], spec.width),
                top: spec.labelTop,
              }}
            >
              {options[lastDotIndex].label}
            </span>
          ) : null}
          {activeOption && activeIndex > 0 && activeIndex < lastDotIndex ? (
            <span
              className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap font-gill text-[16px] font-normal leading-110 text-[#AB863B] transition-[left] duration-200 ease-out"
              style={{
                left: toPercent(activeDotCenter, spec.width),
                top: spec.labelTop,
              }}
            >
              {activeOption.label}
            </span>
          ) : null}
        </>
      ) : showActiveLabelOnly ? (
        activeOption ? (
          <span
            className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap font-gill text-[16px] font-normal leading-110 text-[#AB863B] transition-[left] duration-200 ease-out"
            style={{
              left: toPercent(activeDotCenter, spec.width),
              top: spec.labelTop,
            }}
          >
            {activeOption.label}
          </span>
        ) : null
      ) : (
        options.map((option, index) => {
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
        })
      )}

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
