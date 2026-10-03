import { cn } from "@/shared/utils/cn";

/** Figma Neutrals/600 — Desktop/Heading/h2-32-Light (e.g. Sign In 4903:134158). */
export const AUTH_FLOW_HEADING_COLOR_CLASS = "text-darkblack";

const authFlowTitleBaseClassName = cn(
  "shrink-0 font-larken font-light leading-110",
  AUTH_FLOW_HEADING_COLOR_CLASS,
);

/** Desktop auth panel title — Larken 32px / #0A0A0A / 110% line-height. */
export const authFlowTitleClassName = cn(authFlowTitleBaseClassName, "text-32");

export const getAuthFlowTitleClassName = (titleClassName?: string) =>
  cn(authFlowTitleBaseClassName, titleClassName ?? "text-32");

/** Figma Desktop/Title/t4-14-Regular — OTP destination copy (4903:134440). */
export const authFlowOtpInstructionClassName = cn(
  "min-w-0 flex-1 break-words font-gill font-normal leading-110 text-darkblack",
  "text-sm lg:text-base",
);

/** Figma Desktop/Body/b3-14-Light — OTP resend line (4903:134444). */
export const authFlowOtpResendClassName = cn(
  "w-full text-right font-gill text-sm font-light leading-110 lg:text-base",
);
