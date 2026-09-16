"use client";

import { cn } from "@/shared/utils/cn";
import { useUiPlatform } from "@/shared/hooks/use-ui-platform";

const StepConnectorLine = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn(
      "pointer-events-none absolute top-1/2 w-px -translate-y-1/2 bg-neutral500",
      className,
    )}
    style={{ height: "100%" }}
  />
);

export type EducationDiscoverStepsListProps = {
  steps: string[];
  /** 0-based index of the active step in multi-step flows. Omit for static display. */
  activeStepIndex?: number;
  className?: string;
};

const EducationDiscoverStepsList = ({
  steps,
  activeStepIndex,
  className,
}: EducationDiscoverStepsListProps) => {
  const { windows } = useUiPlatform();

  if (steps.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex w-full items-start gap-4", className)}>
      <div className="relative flex shrink-0 flex-col items-start gap-10">
        <StepConnectorLine className="left-2" />
        {steps.map((step, index) => {
          const isActive = activeStepIndex === index;
          const isComplete = activeStepIndex != null && index < activeStepIndex;

          return (
            <div
              key={`${step}-${index}`}
              className={cn(
                "relative z-10 flex h-[26px] w-4 shrink-0 items-center justify-center rounded-full border-[0.4px] p-1",
                isActive || isComplete
                  ? "border-darkblack bg-white"
                  : "border-neutral500 bg-white",
              )}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={cn(
                  !windows && "translate-y-0.5",
                  "font-gill text-sm font-light leading-none tracking-[0.14px]",
                  isActive || isComplete ? "text-darkblack" : "text-neutral500",
                )}
              >
                {index + 1}
              </span>
            </div>
          );
        })}
      </div>
      <ol className="flex flex-col justify-between self-stretch font-gill lg:text-xl md:text-lg text-base font-light leading-110">
        {steps.map((step, index) => {
          const isActive = activeStepIndex === index;
          const isComplete = activeStepIndex != null && index < activeStepIndex;

          return (
            <li
              key={step}
              className={cn(
                isActive || isComplete ? "text-darkblack" : "text-neutral500",
                isActive && "font-normal",
              )}
            >
              {step}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default EducationDiscoverStepsList;
