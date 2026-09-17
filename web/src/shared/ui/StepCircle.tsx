"use client";

import { cn } from "@/shared/utils/cn";

type StepCircleProps = {
  number: number;
  className?: string;
  numberClassName?: string;
};

export function StepCircle({ number, className, numberClassName }: StepCircleProps) {
  return (
    <div className={className}>
      <span className={cn("block leading-none", numberClassName)}>{number}</span>
    </div>
  );
}
