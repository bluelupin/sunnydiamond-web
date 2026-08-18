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

function ProfileOrderTimelineEstimatedHeader({
  estimatedLabel,
  estimatedValue,
}: {
  estimatedLabel: string;
  estimatedValue: string;
}) {
  return (
    <div
      className="flex items-center justify-between border-b border-neutral300 bg-chalk300 px-4 py-4 font-gill text-base font-normal leading-110 text-darkblack lg:px-6"
    >
      <span>{estimatedLabel}</span>
      <span>{estimatedValue}</span>
    </div>
  );
}

function ProfileOrderTimelineVertical({ steps }: { steps: ProfileTimelineStep[] }) {
  return (
    <div className="flex flex-col gap-2 p-4 lg:hidden">
      {steps.map((step, index) => {
        const isCompleted = step.status === "completed";
        const isCurrent = step.status === "current";
        const isUpcoming = step.status === "upcoming";
        const isActive = isProfileTimelineStepActive(step.status);
        const isLast = index === steps.length - 1;

        return (
          <div
            key={`${step.step}-${step.label}`}
            className={cn("flex gap-4", !isLast && "h-[60px]")}
          >
            <div className="flex w-10 shrink-0 flex-col items-center">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full font-gill text-base leading-110",
                  isActive && "bg-gold500 font-normal text-darkblack",
                  isUpcoming && "border border-neutral300 bg-gray300 font-light text-darkblack",
                )}
              >
                {step.step}
              </span>
              {!isLast ? (
                <div
                  className={cn(
                    "h-8 w-px shrink-0",
                    isCompleted ? "bg-gold500" : "bg-neutral300",
                  )}
                  aria-hidden
                />
              ) : null}
            </div>

            <div className="flex h-10 min-w-0 flex-1 items-center">
              <span
                className={cn(
                  "font-gill text-base leading-110 text-darkblack",
                  isActive || isCurrent ? "font-normal" : "font-light",
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProfileOrderTimelineHorizontal({
  steps,
  variant,
}: {
  steps: ProfileTimelineStep[];
  variant: "default" | "detail";
}) {
  const filledThroughIndex =
    variant === "detail"
      ? getProfileTimelineCompletedThroughIndex(steps)
      : getProfileTimelineFilledThroughIndex(steps);
  const stepCount = steps.length;
  const lineInset = stepCount > 1 ? `calc(100% / ${stepCount} / 2)` : undefined;
  const lineSpan =
    stepCount > 1 ? `calc(100% - 100% / ${stepCount})` : undefined;
  const filledLineWidth =
    stepCount > 1 && filledThroughIndex > 0
      ? `calc((100% - 100% / ${stepCount}) * ${filledThroughIndex / (stepCount - 1)})`
      : undefined;

  return (
    <div className="hidden p-6 lg:block">
      <div className="relative">
        {lineInset && lineSpan ? (
          <>
            <div
              className="absolute top-5 h-px bg-transparent border border-dashed border-neutral300"
              style={{ left: lineInset, width: lineSpan }}
              aria-hidden
            />

            {filledLineWidth ? (
              <div
                className="absolute top-5 h-px bg-transparent border border-neutral500"
                style={{ left: lineInset, width: filledLineWidth }}
                aria-hidden
              />
            ) : null}
          </>
        ) : null}

        <ol className="relative flex justify-between">
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
                    variant === "detail" && isCompleted && "bg-gold500 text-darkblack",
                    variant === "detail" &&
                    isCurrent &&
                    "border border-gold500 bg-white text-darkblack",
                    variant === "detail" &&
                    isUpcoming &&
                    "border border-neutral300 bg-gray300 text-neutral500",
                    variant === "default" && isActive && "bg-gold500 text-darkblack",
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
                    isActive || isCurrent
                      ? "font-normal text-darkblack"
                      : "font-light text-neutral500",
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
  );
}

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

  return (
    <div className={cn("bg-white", className)}>
      {estimatedLabel && estimatedValue ? (
        <ProfileOrderTimelineEstimatedHeader
          estimatedLabel={estimatedLabel}
          estimatedValue={estimatedValue}
        />
      ) : null}

      <ProfileOrderTimelineVertical steps={steps} />
      <ProfileOrderTimelineHorizontal steps={steps} variant={variant} />
    </div>
  );
}
