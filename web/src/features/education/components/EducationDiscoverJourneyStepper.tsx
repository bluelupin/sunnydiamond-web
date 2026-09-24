"use client";

import { cn } from "@/shared/utils/cn";

export type EducationDiscoverJourneyStepperProps = {
  steps: string[];
  /** 1-based active step index. */
  activeStep: number;
  className?: string;
};

const EducationDiscoverJourneyStepper = ({
  steps,
  activeStep,
  className,
}: EducationDiscoverJourneyStepperProps) => {
  const totalSteps = Math.max(steps.length, 1);
  const clampedStep = Math.min(Math.max(activeStep, 1), totalSteps);
  const progressPercent = (clampedStep / totalSteps) * 100;
  const currentLabel = steps[clampedStep - 1] ?? "";

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div
        className="relative h-px w-full bg-neutral300"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={clampedStep}
        aria-label={`Step ${clampedStep} of ${totalSteps}`}
      >
        <div
          className="absolute left-0 top-0 h-[1px] -translate-y-px bg-darkblack transition-[width] duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
          aria-hidden
        />
      </div>
      {currentLabel ? (
        <p className="font-gill text-sm font-light leading-110 text-darkblack">
          Step {clampedStep} | {currentLabel}
        </p>
      ) : null}
    </div>
  );
};

export default EducationDiscoverJourneyStepper;
