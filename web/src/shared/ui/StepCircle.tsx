"use client";

import { useUiPlatform } from "@/shared/hooks/use-ui-platform";
import { cn } from "@/shared/utils/cn";

type StepCircleProps = {
  number: number;
  className?: string;
  numberClassName?: string;
};

export function StepCircle({ number, className, numberClassName }: StepCircleProps) {
  const { windows } = useUiPlatform();

  return (
    <div className={className}>
      <span
        className={cn(
          "block leading-none",
          numberClassName,
          !windows && "translate-y-0.5",
        )}
      >
        {number}
      </span>
    </div>
  );
}
