"use client";

import { cn } from "@/shared/utils/cn";
import { useUiPlatform } from "../hooks/use-ui-platform";

type StepCircleProps = {
  number: number;
  className?: string;
  numberClassName?: string;
};

export function StepCircle({ number, className, numberClassName }: StepCircleProps) {
  const { windows } = useUiPlatform();
  return (
    <div className={className}>
      <span className={cn(!windows && "translate-y-0.5", "block leading-none", numberClassName)}>{number}</span>
    </div>
  );
}
