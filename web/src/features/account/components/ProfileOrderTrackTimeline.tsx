"use client";

import { cn } from "@/shared/utils/cn";
import type { ProfileTimelineStep } from "../types/profileUi.types";
import { formatOrderDate } from "../utils/formatAccountData";
import {
  getProfileTimelineStepDescription,
  isProfileTimelineStepActive,
} from "../utils/orderDeliveryTimeline.utils";

type ProfileOrderTrackTimelineProps = {
  steps: ProfileTimelineStep[];
  className?: string;
};

export function ProfileOrderTrackTimeline({ steps, className }: ProfileOrderTrackTimelineProps) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <ol className={cn("flex flex-col", className)}>
      {steps.map((step, index) => {
        const isCompleted = step.status === "completed";
        const isCurrent = step.status === "current";
        const isActive = isProfileTimelineStepActive(step.status);
        const isLast = index === steps.length - 1;
        // Server copy always wins; the local map only fills in the current step.
        const description =
          step.description ??
          (isCurrent ? getProfileTimelineStepDescription(step.label) : undefined);
        const timestamp = isActive && step.timestamp ? formatOrderDate(step.timestamp) : undefined;

        return (
          <li key={`${step.step}-${step.label}`} className="flex gap-4">
            <div className="flex w-10 shrink-0 flex-col items-center">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full font-gill text-base font-normal leading-110",
                  isActive && "bg-gold500 text-darkblack",
                  !isActive && "border border-neutral300 bg-gray300 text-neutral500",
                )}
              >
                {step.step}
              </span>
              {!isLast ? (
                <div
                  className={cn(
                    "w-px flex-1 min-h-10",
                    isCompleted ? "bg-gold500" : "bg-neutral300",
                  )}
                  aria-hidden
                />
              ) : null}
            </div>

            <div className={cn("min-w-0 flex-1", isLast ? "pb-0 pt-1.5" : "pb-6 pt-1.5")}>
              <p
                className={cn(
                  "font-gill text-base leading-110",
                  isActive ? "font-normal text-darkblack" : "font-light text-neutral500",
                )}
              >
                {step.label}
              </p>
              {description ? (
                <p className="mt-1 font-gill text-base font-light leading-110 text-neutral500">
                  {description}
                </p>
              ) : null}
              {timestamp ? (
                <p className="mt-1 font-gill text-sm font-light leading-110 text-neutral500">
                  {timestamp}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
