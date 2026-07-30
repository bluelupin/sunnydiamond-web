"use client";

import { cn } from "@/shared/utils/cn";
import type { ProfileTimelineStep } from "../types/profileUi.types";
import {
  getProfileTimelineCompletedThroughIndex,
  getProfileTimelineFilledThroughIndex,
  isProfileTimelineStepActive,
} from "../utils/orderDeliveryTimeline.utils";

type ProfileOrderTimelineProps = {
  estimatedLabel?: string;
  estimatedValue?: string;
  steps?: ProfileTimelineStep[];
  className?: string;
  variant?: "default" | "detail";
};

export function ProfileOrderTimeline({
  estimatedLabel,
  estimatedValue,
  steps,
  className,
  variant = "default",
}: ProfileOrderTimelineProps) {
  if (!steps || steps.length === 0) {
    return null;
  }

  const filledThroughIndex =
    variant === "detail"
      ? getProfileTimelineCompletedThroughIndex(steps)
      : getProfileTimelineFilledThroughIndex(steps);

  return (
    <div className={cn("bg-white", className)}>
      {estimatedLabel && estimatedValue ? (
        <div
          className="flex items-center justify-between border-b border-neutral300 bg-chalk300 px-6 py-4 font-gill text-base font-normal leading-110 text-darkblack"
        >
          <span>{estimatedLabel}</span>
          <span>{estimatedValue}</span>
        </div>
      ) : null}

      <div className="p-6">
        <div className="relative">
          <div className="absolute left-5 right-5 top-5 h-px bg-neutral300" aria-hidden />

          {filledThroughIndex > 0 && steps.length > 1 ? (
            <div
              className="absolute left-5 top-5 h-px bg-gold500"
              style={{
                width: `calc((100% - 2.5rem) * ${filledThroughIndex / (steps.length - 1)})`,
              }}
              aria-hidden
            />
          ) : null}

          <ol className="relative flex justify-between gap-2">
            {steps.map((step) => {
              const isCompleted = step.status === "completed";
              const isCurrent = step.status === "current";
              const isUpcoming = step.status === "upcoming";
              const isActive = isProfileTimelineStepActive(step.status);

              return (
                <li
                  key={`${step.step}-${step.label}`}
                  className="flex min-w-0 flex-1 flex-col items-center gap-3"
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full font-gill text-base font-normal leading-110",
                      variant === "detail" && isCompleted && "bg-gold500 text-white",
                      variant === "detail" &&
                        isCurrent &&
                        "border border-gold500 bg-white text-darkblack",
                      variant === "detail" &&
                        isUpcoming &&
                        "border border-neutral300 bg-gray300 text-neutral500",
                      variant === "default" && isActive && "bg-gold500 text-white",
                      variant === "default" &&
                        isUpcoming &&
                        "border border-neutral300 bg-gray300 text-neutral500",
                    )}
                  >
                    {step.step}
                  </span>
                  <span
                    className={cn(
                      "text-center font-gill text-base leading-110",
                      isActive || isCurrent ? "font-normal text-darkblack" : "font-light text-neutral500",
                    )}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
