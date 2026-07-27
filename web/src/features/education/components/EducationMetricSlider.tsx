"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import {
  educationPageImages,
  buildSliderSpecForOptionCount,
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

const dotPositionStyle = (center: number, specWidth: number, top: number): CSSProperties => ({
  left: toPercent(center, specWidth),
  top,
});

const endpointLabelAlignClass = (index: number, total: number) => {
  if (index === 0) return "-translate-x-0 text-left";
  if (index === total - 1) return "-translate-x-full text-right";
  return "-translate-x-1/2 text-center";
};

const MOBILE_THUMB_SIZE = 14;

const labelFontProps = (useMobileLayout: boolean, mobileFontSize?: number) =>
  useMobileLayout
    ? { className: undefined as string | undefined, style: { fontSize: mobileFontSize ?? 12 } }
    : { className: "text-base", style: undefined as CSSProperties | undefined };

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

const SliderLabel = ({
  option,
  isActive,
  dotCenter,
  labelTop,
  specWidth,
  index,
  total,
  useMobileLayout,
  mobileLabelFontSize,
  centeredLabelLayout,
}: {
  option: EducationSliderOption;
  isActive: boolean;
  dotCenter: number;
  labelTop: number;
  specWidth: number;
  index: number;
  total: number;
  useMobileLayout: boolean;
  mobileLabelFontSize?: number;
  centeredLabelLayout?: boolean;
}) => {
  const colorClass = isActive ? "text-linkGold" : "text-darkblack";
  const font = labelFontProps(useMobileLayout, mobileLabelFontSize);
  const labelAlignClass =
    centeredLabelLayout && useMobileLayout
      ? "-translate-x-1/2 text-center"
      : endpointLabelAlignClass(index, total);

  if (useMobileLayout) {
    if (option.mobileLabelLines) {
      return (
        <span
          className={cn(
            "pointer-events-none absolute font-gill font-normal leading-110 transition-colors whitespace-nowrap",
            font.className,
            labelAlignClass,
            colorClass,
          )}
          style={{
            left: toPercent(dotCenter, specWidth),
            top: labelTop,
            ...font.style,
          }}
        >
          {option.mobileLabelLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </span>
      );
    }

    return (
      <span
        className={cn(
          "pointer-events-none absolute font-gill font-normal leading-110 transition-colors whitespace-nowrap",
          font.className,
          labelAlignClass,
          colorClass,
        )}
        style={{
          left: toPercent(dotCenter, specWidth),
          top: labelTop,
          ...font.style,
        }}
      >
        {option.label}
      </span>
    );
  }

  if (option.mobileLabelLines) {
    return (
      <span
        className={cn(
          "pointer-events-none absolute -translate-x-1/2 whitespace-nowrap text-center font-gill text-base font-normal leading-110 transition-colors",
          colorClass,
        )}
        style={dotPositionStyle(dotCenter, specWidth, labelTop)}
      >
        {option.label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "pointer-events-none absolute -translate-x-1/2 whitespace-nowrap text-center font-gill text-base font-normal leading-110 transition-colors",
        colorClass,
      )}
      style={dotPositionStyle(dotCenter, specWidth, labelTop)}
    >
      {option.label}
    </span>
  );
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
  const [useMobileLayout, setUseMobileLayout] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setUseMobileLayout(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const activeIndex = controlledIndex ?? internalIndex;
  const dotCenters = useMemo(() => {
    if (spec.dotCenters.length === options.length) {
      return spec.dotCenters;
    }

    return buildSliderSpecForOptionCount(spec, options.length).dotCenters;
  }, [options.length, spec]);
  const sliderHeight =
    useMobileLayout && spec.mobileHeight ? spec.mobileHeight : spec.height;
  const sliderMaxWidth =
    useMobileLayout && spec.mobileWidth ? spec.mobileWidth : spec.width;
  const thumbSize = useMobileLayout ? MOBILE_THUMB_SIZE : spec.thumbSize;
  const maxIndex = Math.max(options.length - 1, 0);
  const labelFont = labelFontProps(useMobileLayout, spec.mobileLabelFontSize);
  const activeDotCenter = dotCenters[activeIndex] ?? dotCenters[0];
  const hasSublabels = Boolean(spec.sublabelTop);
  const showActiveLabelOnly = spec.labelDisplay === "active";
  const showEndpointLabels = spec.labelDisplay === "endpoints";
  const showAllLabels =
    spec.labelDisplay === "all" || spec.labelDisplay === undefined;
  const activeOption = options[activeIndex];
  const showDots = spec.showDots !== false;
  const endpointDotsOnly = spec.endpointDotsOnly === true;
  const lastDotIndex = dotCenters.length - 1;
  const trackDotGap = spec.trackDotGap ?? TRACK_DOT_GAP;
  const endpointTrackSegment =
    endpointDotsOnly && showDots && dotCenters.length >= 2
      ? {
          left: spec.trackLeft,
          width: Math.max(
            dotCenters[lastDotIndex]! - trackDotGap - spec.trackLeft,
            0,
          ),
        }
      : null;
  const trackSegments = showDots && !endpointDotsOnly
    ? buildTrackSegments(
        dotCenters,
        spec.trackLeft,
        spec.trackWidth,
        spec.trackDotGap ?? TRACK_DOT_GAP,
      )
    : [];

  const renderTrackSegment = (left: number, width: number, key: string) => (
    <div
      key={key}
      className="absolute bg-lightGold"
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

      dotCenters.forEach((center, index) => {
        if (index > maxIndex) return;

        const distance = Math.abs(center - specX);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      return nearestIndex;
    },
    [activeIndex, maxIndex, dotCenters, spec.width],
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
      className={cn("relative z-20 mx-auto w-full max-w-full cursor-pointer touch-none", className)}
      style={{ width: "100%", maxWidth: sliderMaxWidth, height: sliderHeight }}
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
        ? dotCenters.map((dotCenter, index) => {
            if (endpointDotsOnly && index !== 0 && index !== lastDotIndex) {
              return null;
            }

            return (
              <span
                key={`dot-${index}`}
                className="pointer-events-none absolute size-[6px] -translate-x-1/2 rounded-full bg-lightGold"
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
        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-200 ease-out"
        style={dotPositionStyle(
          activeDotCenter,
          spec.width,
          spec.trackTop + spec.trackHeight / 2,
        )}
        aria-hidden
      >
        <Image
          src={educationPageImages.claritySliderThumb}
          alt=""
          width={thumbSize}
          height={thumbSize}
          className={useMobileLayout ? "size-[14px]" : "size-[18px]"}
        />
      </div>

      {options.map((option, index) => {
        const dotCenter = dotCenters[index] ?? dotCenters[0];

        return (
          <button
            key={option.label}
            type="button"
            aria-label={`Select ${option.label}`}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer p-0"
            style={{
              left: toPercent(dotCenter, spec.width),
              top: spec.trackTop + spec.trackHeight / 2,
              width: 44,
              height: 44,
            }}
          />
        );
      })}

      {showEndpointLabels ? (
        <>
          {options[0] ? (
            <span
              className={cn(
                "pointer-events-none absolute whitespace-nowrap font-gill font-normal leading-110 transition-colors",
                labelFont.className,
                endpointLabelAlignClass(0, options.length),
                activeIndex === 0 ? "text-linkGold" : "text-darkblack",
              )}
              style={{
                left: toPercent(dotCenters[0]!, spec.width),
                top: spec.labelTop,
                ...labelFont.style,
              }}
            >
              {options[0].label}
            </span>
          ) : null}
          {options[lastDotIndex] ? (
            <span
              className={cn(
                "pointer-events-none absolute whitespace-nowrap font-gill font-normal leading-110 transition-colors",
                labelFont.className,
                endpointLabelAlignClass(lastDotIndex, options.length),
                activeIndex === lastDotIndex ? "text-linkGold" : "text-darkblack",
              )}
              style={{
                left: toPercent(dotCenters[lastDotIndex]!, spec.width),
                top: spec.labelTop,
                ...labelFont.style,
              }}
            >
              {options[lastDotIndex].label}
            </span>
          ) : null}
          {activeOption && activeIndex > 0 && activeIndex < lastDotIndex ? (
            <span
              className={cn(
                "pointer-events-none absolute whitespace-nowrap font-gill font-normal leading-110 text-linkGold transition-[left] duration-200 ease-out",
                labelFont.className,
                endpointLabelAlignClass(activeIndex, options.length),
              )}
              style={{
                left: toPercent(activeDotCenter, spec.width),
                top: spec.labelTop,
                ...labelFont.style,
              }}
            >
              {activeOption.label}
            </span>
          ) : null}
        </>
      ) : showActiveLabelOnly ? (
        activeOption ? (
          <span
            className={cn(
              "pointer-events-none absolute whitespace-nowrap font-gill font-normal leading-110 text-linkGold transition-[left] duration-200 ease-out",
              labelFont.className,
              useMobileLayout
                ? endpointLabelAlignClass(activeIndex, options.length)
                : "-translate-x-1/2",
            )}
            style={{
              left: toPercent(activeDotCenter, spec.width),
              top: spec.labelTop,
              ...labelFont.style,
            }}
          >
            {activeOption.label}
          </span>
        ) : null
      ) : (
        options.map((option, index) => {
          const dotCenter = dotCenters[index] ?? dotCenters[0];
          const isActive = index === activeIndex;

          return (
            <SliderLabel
              key={`${option.label}-label`}
              option={option}
              isActive={isActive}
              dotCenter={dotCenter}
              labelTop={spec.labelTop}
              specWidth={spec.width}
              index={index}
              total={options.length}
              useMobileLayout={useMobileLayout}
              mobileLabelFontSize={spec.mobileLabelFontSize}
              centeredLabelLayout={showAllLabels}
            />
          );
        })
      )}

      {hasSublabels
        ? options.map((option, index) => {
            const sublabelLeft = spec.sublabelLeft?.[index] ?? spec.sublabelLeft?.[0] ?? 0;
            const dotCenter = dotCenters[index] ?? dotCenters[0];
            const isActive = index === activeIndex;

            if (!option.sublabel) return null;

            return (
              <span
                key={`${option.label}-sublabel`}
                className={cn(
                  "pointer-events-none absolute max-w-[80px] font-gill font-light leading-110",
                  useMobileLayout
                    ? cn(
                        "text-[12px]",
                        endpointLabelAlignClass(index, options.length),
                      )
                    : "text-center text-sm",
                  isActive ? "text-linkGold" : "text-darkblack",
                )}
                style={{
                  left: toPercent(useMobileLayout ? dotCenter : sublabelLeft, spec.width),
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
