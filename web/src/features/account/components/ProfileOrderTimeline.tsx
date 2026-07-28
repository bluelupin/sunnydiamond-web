"use client";

import { cn } from "@/shared/utils/cn";
import type { ProfileTimelineStep } from "../types/profileUi.types";

type ProfileOrderTimelineProps = {
  estimatedLabel?: string;
  estimatedValue?: string;
  steps?: ProfileTimelineStep[];
  className?: string;
};

export function ProfileOrderTimeline({
  estimatedLabel,
  estimatedValue,
  steps,
  className,
}: ProfileOrderTimelineProps) {
  if (!steps || steps.length === 0) {
    return null;
  }

  const lastCompletedIndex = steps.reduce(
    (max, step, index) =>
      step.status === "completed" || step.status === "current" ? index : max,
    -1,
  );

  return (
    <div className={cn("bg-white", className)}>
      {estimatedLabel && estimatedValue ? (
        <div className="flex items-center justify-between px-6 py-4 font-gill text-base leading-110 text-darkblack">
          <span className="font-light">{estimatedLabel}</span>
          <span className="font-normal">{estimatedValue}</span>
        </div>
      ) : null}

      <div className="px-6 pb-6">
        <div className="relative">
          <div
            className="absolute left-6 right-6 top-5 h-px bg-neutral300"
            aria-hidden
          />
          {lastCompletedIndex >= 0 ? (
            <div
              className="absolute left-6 top-5 h-px bg-darkblack"
              style={{
                width: `calc((100% - 3rem) * ${lastCompletedIndex / (steps.length - 1)})`,
              }}
              aria-hidden
            />
          ) : null}

          <ol className="relative flex justify-between gap-2">
            {steps.map((step) => {
              const isActive = step.status === "completed" || step.status === "current";

              return (
                <li
                  key={`${step.step}-${step.label}`}
                  className="flex min-w-0 flex-1 flex-col items-center gap-3"
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full font-gill text-xl leading-110",
                      isActive
                        ? "bg-darkblack text-white"
                        : "bg-neutral300 text-darkblack",
                    )}
                  >
                    {step.step}
                  </span>
                  <span className="text-center font-gill text-base leading-110 text-darkblack">
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
