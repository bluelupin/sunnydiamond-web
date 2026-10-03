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
